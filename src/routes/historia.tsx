import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/peregrino/PageShell";
import { Reveal } from "@/components/peregrino/Reveal";
import estrada from "@/assets/editorial-estrada.jpg";

const title = "Nossa História | Peregrino — Fé e Caminho";
const description =
  "Como nasceu a Peregrino: uma marca de fé e propósito criada para quem entende que a caminhada cristã também se veste.";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Historia,
});

const CHAPTERS = [
  {
    year: "O início",
    title: "Uma inquietação",
    text: "Peregrino começou como uma pergunta simples: por que quase tudo o que carrega uma mensagem de fé precisa parecer datado? Quisemos algo silencioso, bem-feito e verdadeiro.",
  },
  {
    year: "O ofício",
    title: "Poucas peças, feitas devagar",
    text: "Escolhemos algodão pesado, tinturas discretas e acabamentos que resistem ao tempo. Preferimos lançar menos e acertar mais.",
  },
  {
    year: "Hoje",
    title: "Uma caminhada compartilhada",
    text: "Cada peça vestida é uma conversa possível. É isso que nos move — não a estética por si só, mas o que ela abre.",
  },
];

function Historia() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Nossa história"
        title="Somos peregrinos nesta terra."
        intro="Não construímos uma loja. Construímos um caminho — e convidamos quem quiser andar junto."
      />

      <section className="content">
        <Reveal>
          <div className="film overflow-hidden rounded-sm">
            <img
              src={estrada}
              alt="Estrada seguindo em direção às montanhas ao entardecer"
              width={1600}
              height={1008}
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="section">
        <div className="content grid gap-16 md:grid-cols-12">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.title} delay={i * 100} className="md:col-span-4">
              <span className="caption text-gold">{c.year}</span>
              <h2 className="mt-6 display-3 text-olive-950">{c.title}</h2>
              <p className="mt-5 body-base">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
