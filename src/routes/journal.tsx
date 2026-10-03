import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/peregrino/PageShell";
import { Reveal } from "@/components/peregrino/Reveal";
import { JOURNAL_POSTS } from "@/components/peregrino/home/Journal";

const title = "Journal | Peregrino — Fé e Caminho";
const description =
  "Textos sobre fé, propósito e ofício. O journal da Peregrino: palavras para quem caminha com Cristo.";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Journal"
        title="Palavras para o caminho."
        intro="Reflexões sobre fé, missão e o ofício de fazer peças que duram."
      />

      <section className="content pb-32">
        <div className="border-t border-border">
          {JOURNAL_POSTS.map((post, i) => (
            <Reveal key={post.title} delay={i * 80}>
              <article className="grid gap-6 border-b border-border py-12 md:grid-cols-12 md:py-16">
                <div className="md:col-span-3">
                  <span className="caption text-gold">{post.tag}</span>
                  <span className="caption mt-3 block text-earth">{post.date}</span>
                </div>
                <div className="md:col-span-8 md:col-start-5">
                  <h2 className="display-3 text-olive-950">{post.title}</h2>
                  <p className="mt-4 max-w-xl body-base">{post.excerpt}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
