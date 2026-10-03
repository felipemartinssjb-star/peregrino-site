import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

let carregado: Record<string, string> | undefined;

/** Lê `.env` manualmente (fallback caso o runtime não carregue automaticamente). */
function carregarDotenv(): Record<string, string> {
  if (carregado) return carregado;
  const variaveis: Record<string, string> = {};
  try {
    const caminho = resolve(process.cwd(), ".env");
    if (existsSync(caminho)) {
      for (const linha of readFileSync(caminho, "utf8").split(/\r?\n/)) {
        const correspondencia = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!correspondencia?.[1]) continue;
        let valor = correspondencia[2] ?? "";
        if (
          (valor.startsWith('"') && valor.endsWith('"')) ||
          (valor.startsWith("'") && valor.endsWith("'"))
        ) {
          valor = valor.slice(1, -1);
        }
        variaveis[correspondencia[1]] = valor;
      }
    }
  } catch {
    // sem .env — usa apenas process.env
  }
  carregado = variaveis;
  return variaveis;
}

export function serverEnv(chave: string): string | undefined {
  const doProcesso = process.env[chave];
  if (doProcesso) return doProcesso;
  return carregarDotenv()[chave];
}
