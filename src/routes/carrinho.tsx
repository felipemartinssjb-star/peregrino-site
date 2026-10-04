import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, PageShell } from "@/components/peregrino/PageShell";
import { useCart } from "@/lib/cart";
import { trayConfigurado } from "@/lib/config";
import { formatPreco, getProduto } from "@/lib/produtos";
import { irParaCheckoutTray, transferirParaTray, urlAdicionarAoCarrinho } from "@/lib/tray";

const title = "Carrinho | Peregrino — Fé e Caminho";
const description = "Revise seus itens e finalize o pedido no checkout da loja Tray.";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Carrinho,
});

type Progresso = { atual: number; total: number; nome: string };

function Carrinho() {
  const { itens, carregado, definirQuantidade, remover, manterApenas } = useCart();
  const [progresso, setProgresso] = useState<Progresso | null>(null);

  const linhas = itens.flatMap((item) => {
    const produto = getProduto(item.produtoId);
    if (!produto) return [];
    return [{ item, produto, subtotal: produto.preco * item.qtd }];
  });

  const total = linhas.reduce((acumulado, linha) => acumulado + linha.subtotal, 0);

  async function finalizarNaTray() {
    if (linhas.length === 0) return;
    if (!trayConfigurado) {
      toast.error(
        "Configuração da Tray ausente: defina VITE_TRAY_BASE_URL e VITE_TRAY_LOJA_ID no .env",
      );
      return;
    }

    const prontos: { nome: string; url: string }[] = [];
    const pendentes: string[] = [];
    const transferidos = new Set<number>();

    linhas.forEach((linha, indice) => {
      const tray = linha.produto.tray;
      if (!tray.produtoId) {
        pendentes.push(linha.produto.nome);
        return;
      }
      let variante: number | undefined;
      if (linha.produto.tamanhos.length > 0) {
        variante = linha.item.tamanho ? tray.variantes?.[linha.item.tamanho] : undefined;
        if (variante === undefined) {
          pendentes.push(
            `${linha.produto.nome}${linha.item.tamanho ? ` (${linha.item.tamanho})` : ""}`,
          );
          return;
        }
      }
      const rotulo = `${linha.produto.nome}${linha.item.tamanho ? ` ${linha.item.tamanho}` : ""}`;
      prontos.push({
        nome: rotulo,
        url: urlAdicionarAoCarrinho(tray.produtoId, variante),
      });
      transferidos.add(indice);
    });

    if (prontos.length === 0) {
      toast.error(
        "Nenhum item está pronto para ir à Tray. Cadastre o ID do produto da Tray no /admin.",
      );
      return;
    }

    setProgresso({ atual: 0, total: prontos.length, nome: "Preparando" });
    try {
      await transferirParaTray(prontos, (atual, totalItens, nome) =>
        setProgresso({ atual, total: totalItens, nome }),
      );
      if (pendentes.length > 0) {
        toast.warning(`Itens fora da transferência: ${pendentes.join(", ")}`);
        manterApenas(linhas.filter((_, i) => !transferidos.has(i)).map((linha) => linha.item));
      } else {
        manterApenas([]);
      }
      irParaCheckoutTray();
    } catch (erro) {
      setProgresso(null);
      toast.error(erro instanceof Error ? erro.message : "Falha ao transferir para a Tray.");
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Carrinho"
        title="Seu caminho até aqui."
        intro="Os itens ficam reservados neste navegador. Ao finalizar, eles vão para o carrinho da loja Tray, onde você conclui frete, pagamento e pedido."
      />

      <section className="content pb-24 md:pb-32">
        {!carregado ? null : linhas.length === 0 ? (
          <div className="border-t border-border py-20 text-center">
            <p className="display-3 text-olive-950">Seu carrinho está vazio.</p>
            <Link to="/catalogo" className="btn-base btn-solid mt-8">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="border-t border-border">
                {linhas.map((linha) => (
                  <div
                    key={`${linha.item.produtoId}-${linha.item.tamanho}`}
                    className="flex gap-6 border-b border-border py-8"
                  >
                    <Link
                      to="/produto/$slug"
                      params={{ slug: linha.produto.id }}
                      className="w-24 shrink-0 sm:w-28"
                    >
                      <div className="film overflow-hidden rounded-sm bg-beige-200">
                        {linha.produto.imagens[0] ? (
                          <img
                            src={linha.produto.imagens[0]}
                            alt={linha.produto.nome}
                            width={240}
                            height={300}
                            className="aspect-[4/5] w-full object-cover"
                          />
                        ) : (
                          <div className="aspect-[4/5] w-full" />
                        )}
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div>
                        <Link
                          to="/produto/$slug"
                          params={{ slug: linha.produto.id }}
                          className="font-display text-xl text-olive-950 link-underline"
                        >
                          {linha.produto.nome}
                        </Link>
                        {linha.item.tamanho && (
                          <span className="caption mt-2 block text-earth">
                            Tamanho {linha.item.tamanho}
                          </span>
                        )}
                        <span className="mt-2 block text-sm text-earth">
                          {formatPreco(linha.produto.preco)}
                        </span>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            aria-label="Diminuir quantidade"
                            className="h-10 w-10 text-olive-800 transition-colors hover:bg-beige-100"
                            onClick={() =>
                              definirQuantidade(
                                linha.item.produtoId,
                                linha.item.tamanho,
                                linha.item.qtd - 1,
                              )
                            }
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm">{linha.item.qtd}</span>
                          <button
                            type="button"
                            aria-label="Aumentar quantidade"
                            className="h-10 w-10 text-olive-800 transition-colors hover:bg-beige-100"
                            onClick={() =>
                              definirQuantidade(
                                linha.item.produtoId,
                                linha.item.tamanho,
                                linha.item.qtd + 1,
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="caption text-earth transition-colors hover:text-destructive"
                          onClick={() => remover(linha.item.produtoId, linha.item.tamanho)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>

                    <span className="font-display text-xl text-olive-950">
                      {formatPreco(linha.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 md:col-start-9">
              <div className="border border-border bg-white p-8 md:sticky md:top-32">
                <span className="caption text-earth">Resumo</span>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between body-base">
                    <span>Subtotal</span>
                    <span className="font-display text-xl text-olive-950">
                      {formatPreco(total)}
                    </span>
                  </div>
                  <p className="text-[0.8125rem] leading-relaxed text-earth">
                    Frete, cupons e formas de pagamento são calculados no checkout da loja Tray.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={finalizarNaTray}
                  className="btn-base btn-solid mt-8 w-full"
                >
                  Finalizar na Tray
                </button>

                <Link to="/catalogo" className="caption mt-6 block text-olive-800 link-underline">
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {progresso && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-beige-50/95 backdrop-blur-sm">
          <div className="max-w-md px-6 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-border border-t-gold" />
            <p className="mt-10 display-3 text-olive-950">Levando seu pedido para a Tray</p>
            <p className="mt-4 body-base">
              {progresso.atual > 0
                ? `Adicionando ${progresso.nome}… (${progresso.atual}/${progresso.total})`
                : "Preparando itens…"}
            </p>
            <p className="mt-6 caption text-earth">Você será levado ao checkout para pagar</p>
          </div>
        </div>
      )}
    </PageShell>
  );
}
