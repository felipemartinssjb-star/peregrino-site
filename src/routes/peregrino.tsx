import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/peregrino/PageShell";
import { Reveal } from "@/components/peregrino/Reveal";
import hero from "@/assets/hero-caminho.jpg";

const title = "O Peregrino | Peregrino — Fé e Caminho";
const description =
  "Quem é o peregrino: alguém que caminha com propósito, carrega uma mensagem e permanece fiel ao destino prometido.";

export const Route = createFileRoute("/peregrino")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PeregrinoPage,
});

const TRAITS = [
  { title: "Caminha", text: "Não espera condições perfeitas. Anda com o que tem, para onde foi enviado." },
  { title: "Carrega", text: "Leva consigo uma mensagem que não é sua — e por isso não a distorce." },
  { title: "Permanece", text: "Não desiste na subida. Sabe que a promessa não depende do cansaço." },
];

function PeregrinoPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="O peregrino"
        title="Você não está apenas caminhando."
        intro="Existe um propósito em cada passo. O peregrino não é um turista da fé: ele conhece o destino e caminha por ele."
      />

      <section className="content">
        <Reveal>
          <div className="film overflow-hidden rounded-sm">
            <img
              src={hero}
              alt="Silhueta de um homem caminhando em luz dourada"
              width={1920}
              height={1280}
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="section">
        <div className="content grid gap-16 md:grid-cols-3">
          {TRAITS.map((t, i) => (
            <Reveal key={t.title} delay={i * 100}>
              <h2 className="display-3 text-olive-950">{t.title}</h2>
              <span className="rule mt-6" />
              <p className="mt-6 body-base">{t.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-beige-100">
        <div className="content py-24 text-center md:py-32">
          <Reveal>
            <p className="mx-auto max-w-2xl display-2 text-olive-950">
              “Somos peregrinos nesta terra.”
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
