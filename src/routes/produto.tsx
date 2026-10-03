import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageShell } from "@/components/peregrino/PageShell";
import { Reveal } from "@/components/peregrino/Reveal";
import camiseta from "@/assets/produto-camiseta-oliva.jpg";
import oliveira from "@/assets/editorial-oliveira.jpg";
import { useState } from "react";

const title = "Camiseta Caminho Oliva | Peregrino — Fé e Caminho";
const description =
  "Camiseta de algodão pesado em verde oliva, com a mensagem Evangelizar sem falar uma palavra. Peça atemporal da Peregrino.";

export const Route = createFileRoute("/produto")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Produto,
});

const SIZES = ["P", "M", "G", "GG"];

function Produto() {
  const [size, setSize] = useState("M");

  return (
    <PageShell>
      <section className="content pt-40 pb-24 md:pt-52">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="space-y-6 md:col-span-7">
            <div className="film overflow-hidden rounded-sm bg-beige-200">
              <img
                src={camiseta}
                alt="Camiseta verde oliva de algodão pesado"
                width={1200}
                height={1504}
                className="w-full object-cover"
              />
            </div>
            <div className="film overflow-hidden rounded-sm bg-beige-200">
              <img
                src={oliveira}
                alt="Ramo de oliveira sobre concreto, referência de cor da coleção"
                width={1200}
                height={1504}
                loading="lazy"
                className="w-full object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <div className="md:sticky md:top-32">
              <span className="caption text-gold">Coleção Caminho</span>
              <h1 className="mt-6 display-2 text-olive-950">Camiseta Oliva</h1>
              <p className="mt-6 font-display text-2xl text-earth">R$ 189,00</p>
              <span className="rule mt-8" />
              <p className="mt-8 body-base">
                Algodão penteado 240g, corte oversized e caimento estruturado. Estampa discreta nas
                costas: “Evangelizar sem falar uma palavra.”
              </p>

              <div className="mt-10">
                <span className="caption text-earth">Tamanho</span>
                <div className="mt-4 flex gap-3">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className="min-h-11 min-w-11 rounded-sm border text-xs tracking-[0.18em] transition-colors"
                      style={{
                        borderColor: size === s ? "var(--p-olive-900)" : "var(--color-input)",
                        backgroundColor: size === s ? "var(--p-olive-900)" : "transparent",
                        color: size === s ? "var(--p-beige-50)" : "var(--p-olive-900)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.success(`Camiseta Oliva (${size}) reservada para você.`)}
                className="btn-base btn-solid mt-10 w-full"
              >
                Vista sua fé
              </button>

              <ul className="mt-10 space-y-3 border-t border-border pt-8">
                {["Algodão 100% penteado 240g", "Tingimento em tons da terra", "Produção em pequenos lotes"].map(
                  (item) => (
                    <li key={item} className="text-[0.8125rem] leading-relaxed text-earth">
                      {item}
                    </li>
                  ),
                )}
              </ul>
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
