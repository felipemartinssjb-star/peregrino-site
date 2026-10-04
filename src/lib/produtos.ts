import { z } from "zod";
import dados from "@/data/produtos.json";

export const produtoSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífen"),
  nome: z.string().min(1, "Informe o nome do produto"),
  descricao: z.string().default(""),
  preco: z.number().min(0, "Preço inválido"),
  categoria: z.string().default(""),
  tamanhos: z.array(z.string().min(1)).default([]),
  imagens: z.array(z.string().min(1)).max(3, "Máximo de 3 imagens").default([]),
  bullets: z.array(z.string().min(1)).default([]),
  tray: z
    .object({
      url: z.string().default(""),
      produtoId: z.number().int().positive().optional(),
      variantes: z.record(z.string(), z.number().int().positive()).optional(),
    })
    .default({ url: "" }),
});

export const catalogoSchema = z.array(produtoSchema);

export type Produto = z.infer<typeof produtoSchema>;

const resultado = catalogoSchema.safeParse(dados);

if (!resultado.success) {
  const detalhes = resultado.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`src/data/produtos.json inválido — ${detalhes}`);
}

export const catalogo: Produto[] = resultado.data;

export function getProduto(slug: string): Produto | undefined {
  return catalogo.find((produto) => produto.id === slug);
}

const formatadorBRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPreco(valor: number): string {
  return formatadorBRL.format(valor);
}
