import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";

export const JOURNAL_POSTS = [
  {
    tag: "Caminho",
    title: "Somos peregrinos nesta terra",
    excerpt:
      "Sobre o desconforto de não pertencer completamente a lugar nenhum — e por que isso é uma boa notícia.",
    date: "Março, 2026",
  },
  {
    tag: "Missão",
    title: "O IDE não é um detalhe da fé",
    excerpt:
      "A ordem final de Cristo não foi uma sugestão para os mais preparados. Foi um envio para todos.",
    date: "Fevereiro, 2026",
  },
  {
    tag: "Ofício",
    title: "Por que escolhemos o algodão pesado",
    excerpt:
      "Peças que envelhecem bem dizem algo sobre permanência. Nossa escolha de tecido começa aí.",
    date: "Janeiro, 2026",
  },
];

export function JournalSection() {
  return (
    <section className="section bg-beige-100">
      <div className="content">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="caption text-gold">Journal</span>
            <h2 className="mt-6 display-2 text-olive-950">Palavras para o caminho</h2>
          </div>
          <Link to="/journal" className="caption text-olive-800 link-underline">
            Ler o journal
          </Link>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {JOURNAL_POSTS.map((post, i) => (
            <Reveal key={post.title} delay={i * 100} className="bg-beige-50">
              <Link to="/journal" className="flex h-full flex-col p-8 md:p-10">
                <span className="caption text-gold">{post.tag}</span>
                <h3 className="mt-6 display-3 text-olive-950">{post.title}</h3>
                <p className="mt-4 body-base">{post.excerpt}</p>
                <span className="caption mt-auto pt-10 text-earth">{post.date}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
