import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/peregrino/PageShell";
import { Reveal } from "@/components/peregrino/Reveal";
import { useCart } from "@/lib/cart";
import { formatPreco, getProduto } from "@/lib/produtos";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const produto = getProduto(params.slug);
    if (!produto) throw notFound();
    return produto;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.nome} | Peregrino — Fé e Caminho`
      : "Produto | Peregrino — Fé e Caminho";
    const description = loaderData?.descricao || "Produto Peregrino — fé e caminho.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProdutoDetalhe,
  notFoundComponent: ProdutoNaoEncontrado,
});

function ProdutoDetalhe() {
  const produto = Route.useLoaderData();
  const { adicionar } = useCart();
  const navigate = useNavigate();
  const [tamanho, setTamanho] = useState(produto.tamanhos[0] ?? "");
  const temTamanho = produto.tamanhos.length > 0;

  function aoAdicionar() {
    if (temTamanho && !tamanho) {
      toast.error("Escolha um tamanho.");
      return;
    }
    adicionar(produto.id, tamanho);
    toast.success(`${produto.nome}${tamanho ? ` (${tamanho})` : ""} adicionado ao carrinho.`, {
      action: {
        label: "Ver carrinho",
        onClick: () => navigate({ to: "/carrinho" }),
      },
    });
  }

  return (
    <PageShell>
      <section className="content pt-40 pb-24 md:pt-52">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="space-y-6 md:col-span-7">
            {produto.imagens.length === 0 && (
              <div className="film aspect-[4/5] rounded-sm bg-beige-200" />
            )}
            {produto.imagens.map((imagem, i) => (
              <div key={imagem} className="film overflow-hidden rounded-sm bg-beige-200">
                <img
                  src={imagem}
                  alt={`${produto.nome} — imagem ${i + 1}`}
                  width={1200}
                  height={1504}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <div className="md:sticky md:top-32">
              <span className="caption text-gold">{produto.categoria || "Coleção Peregrino"}</span>
              <h1 className="mt-6 display-2 text-olive-950">{produto.nome}</h1>
              <p className="mt-6 font-display text-2xl text-earth">{formatPreco(produto.preco)}</p>
              <span className="rule mt-8" />
              {produto.descricao && <p className="mt-8 body-base">{produto.descricao}</p>}

              {temTamanho && (
                <div className="mt-10">
                  <span className="caption text-earth">Tamanho</span>
                  <div className="mt-4 flex gap-3">
                    {produto.tamanhos.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTamanho(s)}
                        className="min-h-11 min-w-11 rounded-sm border text-xs tracking-[0.18em] transition-colors"
                        style={{
                          borderColor: tamanho === s ? "var(--p-olive-900)" : "var(--color-input)",
                          backgroundColor: tamanho === s ? "var(--p-olive-900)" : "transparent",
                          color: tamanho === s ? "var(--p-beige-50)" : "var(--p-olive-900)",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={aoAdicionar}
                className="btn-base btn-solid mt-10 w-full"
              >
                Adicionar ao carrinho
              </button>

              {produto.tray.url ? (
                <a
                  href={produto.tray.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-outline mt-4 w-full"
                >
                  Comprar agora
                </a>
              ) : (
                <p className="mt-4 text-center text-[0.8125rem] text-earth">
                  Comprar agora indisponível — cadastre o link da Tray no /admin.
                </p>
              )}

              <Link to="/carrinho" className="caption mt-6 block text-olive-800 link-underline">
                Ver carrinho
              </Link>

              {produto.bullets.length > 0 && (
                <ul className="mt-10 space-y-3 border-t border-border pt-8">
                  {produto.bullets.map((item) => (
                    <li key={item} className="text-[0.8125rem] leading-relaxed text-earth">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-beige-100">
        <div className="content py-24 text-center md:py-32">
          <Reveal>
            <p className="mx-auto max-w-2xl display-2 text-olive-950">
              “Vista aquilo em que você crê.”
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function ProdutoNaoEncontrado() {
  return (
    <PageShell>
      <section className="content pt-44 pb-24 text-center">
        <span className="caption text-gold">404</span>
        <h1 className="mt-6 display-2 text-olive-950">Produto não encontrado</h1>
        <Link to="/catalogo" className="btn-base btn-solid mt-10">
          Ver catálogo
        </Link>
      </section>
    </PageShell>
  );
}
