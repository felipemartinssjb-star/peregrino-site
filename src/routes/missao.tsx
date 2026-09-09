import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/peregrino/PageShell";
import { Reveal } from "@/components/peregrino/Reveal";
import oliveira from "@/assets/editorial-oliveira.jpg";

const title = "Missão | Peregrino — Fé e Caminho";
const description =
  "O IDE não é um detalhe da fé. Conheça a missão da Peregrino: vestir propósito e apontar para Cristo no dia a dia.";

export const Route = createFileRoute("/missao")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Missao,
});

const PRINCIPLES = [
  {
    n: "01",
    title: "Apontar, nunca ofuscar",
    text: "A peça não é o centro. Ela existe para que Cristo seja notado, não a marca.",
  },
  {
    n: "02",
    title: "Fazer bem-feito",
    text: "Qualidade é uma forma de respeito — com quem veste e com o que se anuncia.",
  },
  {
    n: "03",
    title: "Permanecer",
    text: "Nada de tendências passageiras. Peças atemporais para uma fé que atravessa estações.",
  },
];

function Missao() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Missão"
        title="O IDE não é um detalhe da fé."
        intro="Existimos para que a mensagem do Evangelho caminhe por lugares onde uma conversa ainda não chegou."
      />

      <section className="bg-olive-950 text-beige-100">
        <div className="content grid items-center gap-16 py-24 md:grid-cols-12 md:py-32">
          <Reveal className="md:col-span-6">
            <div className="film overflow-hidden rounded-sm">
              <img
                src={oliveira}
                alt="Ramo de oliveira e pedras sobre concreto"
                width={1200}
                height={1504}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5 md:col-start-8">
            <h2 className="display-2 text-beige-50">Viva de modo que Jesus apareça.</h2>
            <span className="rule mt-8" />
            <p className="mt-8 text-[0.9375rem] leading-[1.85] text-sand">
              Toda missão começa em um lugar comum: o trabalho, a rua, a mesa de casa. É ali que a
              fé se torna visível — na constância, na gentileza, na coerência.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="content grid gap-16 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.n} delay={i * 100}>
              <span className="caption text-gold">{p.n}</span>
              <h3 className="mt-6 display-3 text-olive-950">{p.title}</h3>
              <p className="mt-4 body-base">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
