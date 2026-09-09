import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/peregrino/PageShell";
import { Hero } from "@/components/peregrino/home/Hero";
import { Pillars } from "@/components/peregrino/home/Pillars";
import { Manifesto } from "@/components/peregrino/home/Manifesto";
import { FaithAndPath } from "@/components/peregrino/home/FaithAndPath";
import { Collections } from "@/components/peregrino/home/Collections";
import { Evangelism } from "@/components/peregrino/home/Evangelism";
import { JournalSection } from "@/components/peregrino/home/Journal";
import { Newsletter } from "@/components/peregrino/home/Newsletter";

const title = "Peregrino — Fé e Caminho | Vestuário cristão premium";
const description =
  "Marca premium de fé e propósito para quem decidiu caminhar com Cristo. Peças editoriais para evangelizar sem falar uma palavra.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell overlay>
      <Hero />
      <Pillars />
      <Manifesto />
      <FaithAndPath />
      <Collections />
      <Evangelism />
      <JournalSection />
      <Newsletter />
    </PageShell>
  );
}
