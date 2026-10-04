import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/peregrino/PageShell";
import { Reveal } from "@/components/peregrino/Reveal";
import { catalogo, formatPreco } from "@/lib/produtos";

const title = "Catálogo | Peregrino — Fé e Caminho";
const description =
  "Todos os produtos Peregrino: camisetas e essenciais de fé e propósito, produção em pequenos lotes.";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Catálogo"
        title="Vista aquilo em que você crê."
        intro="Peças editoriais de algodão pesado, feitas em pequenos lotes para atravessar a semana — e a conversa."
      />

      <section className="content pb-24 md:pb-32">
        {catalogo.length === 0 ? (
          <p className="body-base">
            Nenhum produto cadastrado ainda. Entre no <span className="text-olive-950">/admin</span>{" "}
            para publicar o catálogo.
          </p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {catalogo.map((produto, i) => (
              <Reveal key={produto.id} delay={i * 80}>
                <Link to="/produto/$slug" params={{ slug: produto.id }} className="group block">
                  <div className="film overflow-hidden rounded-sm bg-beige-200">
                    {produto.imagens[0] ? (
                      <img
                        src={produto.imagens[0]}
                        alt={produto.nome}
                        width={1200}
                        height={1504}
                        loading="lazy"
                        className="img-slow aspect-[4/5] w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-[4/5] w-full" />
                    )}
                  </div>
                  <span className="caption mt-6 block text-earth">
                    {produto.categoria || "Coleção"}
                  </span>
                  <h3 className="mt-3 display-3 text-olive-950">{produto.nome}</h3>
                  <p className="mt-2 font-display text-xl text-earth">
                    {formatPreco(produto.preco)}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
