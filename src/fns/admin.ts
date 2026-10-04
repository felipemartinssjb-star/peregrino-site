import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { catalogoSchema } from "@/lib/produtos";

/**
 * IMPORTANTE: nenhum import de módulo Node no topo deste arquivo — ele é
 * importado pelo cliente (as server functions viram chamadas RPC). Módulos
 * com `node:*` são carregados por dynamic import dentro dos handlers, que
 * são removidos do bundle do browser.
 */

const MENSAGEM_TOKEN = "peregrino-admin-v1";

async function assinar(segreto: string): Promise<string> {
  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(segreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const assinatura = await crypto.subtle.sign(
    "HMAC",
    chave,
    new TextEncoder().encode(MENSAGEM_TOKEN),
  );
  return Array.from(new Uint8Array(assinatura))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function tokenValido(token: string): Promise<boolean> {
  const { serverEnv } = await import("./env");
  const segredo = serverEnv("ADMIN_PASSWORD");
  if (!segredo) return false;
  const esperado = await assinar(segredo);
  return token === esperado;
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((dados: unknown) => z.object({ senha: z.string().min(1) }).parse(dados))
  .handler(async ({ data }) => {
    const { serverEnv } = await import("./env");
    const segredo = serverEnv("ADMIN_PASSWORD");
    if (!segredo) {
      return { ok: false as const, erro: "ADMIN_PASSWORD não está configurado no servidor." };
    }
    if (data.senha !== segredo) return { ok: false as const, erro: "Senha incorreta." };
    return { ok: true as const, token: await assinar(segredo) };
  });

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => ({
  gravavel: import.meta.env.DEV === true,
}));

export const adminSalvarProdutos = createServerFn({ method: "POST" })
  .validator((dados: unknown) =>
    z.object({ token: z.string().min(1), produtos: catalogoSchema }).parse(dados),
  )
  .handler(async ({ data }) => {
    if (!(await tokenValido(data.token))) {
      return { ok: false as const, erro: "sessao" as const };
    }
    if (import.meta.env.DEV !== true) {
      return { ok: false as const, modo: "export" as const };
    }
    try {
      const fs = await import("node:fs/promises");
      const { resolve } = await import("node:path");
      const caminho = resolve(process.cwd(), "src", "data", "produtos.json");
      await fs.writeFile(caminho, `${JSON.stringify(data.produtos, null, 2)}\n`, "utf8");
      return { ok: true as const, modo: "arquivo" as const };
    } catch (erro) {
      return { ok: false as const, modo: "export" as const, motivo: String(erro) };
    }
  });

export const adminSalvarImagem = createServerFn({ method: "POST" })
  .validator((dados: unknown) =>
    z
      .object({
        token: z.string().min(1),
        nomeArquivo: z.string().regex(/^[a-z0-9][a-z0-9._-]*\.(jpg|jpeg|png|webp)$/i),
        base64: z.string().min(1).max(12_000_000),
      })
      .parse(dados),
  )
  .handler(async ({ data }) => {
    if (!(await tokenValido(data.token))) {
      return { ok: false as const, erro: "sessao" as const };
    }
    if (import.meta.env.DEV !== true) {
      return { ok: false as const, modo: "export" as const };
    }
    try {
      const fs = await import("node:fs/promises");
      const { resolve } = await import("node:path");
      const dir = resolve(process.cwd(), "public", "produtos");
      await fs.mkdir(dir, { recursive: true });
      const caminho = resolve(dir, data.nomeArquivo);
      if (!caminho.startsWith(dir)) throw new Error("Caminho de arquivo inválido");
      await fs.writeFile(caminho, Buffer.from(data.base64, "base64"));
      return {
        ok: true as const,
        modo: "arquivo" as const,
        caminho: `/produtos/${data.nomeArquivo}`,
      };
    } catch (erro) {
      return { ok: false as const, modo: "export" as const, motivo: String(erro) };
    }
  });
