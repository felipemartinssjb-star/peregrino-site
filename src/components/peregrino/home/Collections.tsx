import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";
import camiseta from "@/assets/produto-camiseta-oliva.jpg";
import oliveira from "@/assets/editorial-oliveira.jpg";
import estrada from "@/assets/editorial-estrada.jpg";
import { catalogo, formatPreco } from "@/lib/produtos";

const EDITORIAIS = [
  {
    img: camiseta,
    alt: "Camiseta verde oliva de algodão pesado sobre linho",
    caption: "Camisetas",
    title: "Peso e permanência",
  },
  {
    img: oliveira,
    alt: "Ramo de oliveira e pedras sobre concreto",
    caption: "Essenciais",
    title: "Terra e raiz",
  },
  {
    img: estrada,
    alt: "Estrada em direção ao horizonte",
    caption: "Jornada",
    title: "Para o caminho",
  },
] as const;

type Card =
  | {
      tipo: "produto";
      id: string;
      img?: string | undefined;
      alt: string;
      caption: string;
      title: string;
      preco: number;
    }
  | {
      tipo: "editorial";
      img: string;
      alt: string;
      caption: string;
      title: string;
    };

function montarCards(): Card[] {
  const produtos: Card[] = catalogo.slice(0, 3).map((produto) => ({
    tipo: "produto",
    id: produto.id,
    img: produto.imagens[0],
    alt: produto.nome,
    caption: produto.categoria || "Coleção",
    title: produto.nome,
    preco: produto.preco,
  }));
  const preenchimento: Card[] = EDITORIAIS.slice(0, Math.max(0, 3 - produtos.length)).map(
    (item) => ({ ...item, tipo: "editorial" as const }),
  );
  return [...produtos, ...preenchimento];
}

export function Collections() {
  const cards = montarCards();

  return (
    <section className="section">
      <div className="content">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="caption text-gold">Coleção</span>
            <h2 className="mt-6 display-2 text-olive-950">Vista aquilo em que você crê.</h2>
          </div>
          <Link to="/catalogo" className="caption text-olive-800 link-underline">
            Ver tudo
          </Link>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {cards.map((card, i) => {
            const conteudo = (
              <>
                <div className="film overflow-hidden rounded-sm bg-beige-200">
                  {card.img ? (
                    <img
                      src={card.img}
                      alt={card.alt}
                      width={1200}
                      height={1504}
                      loading="lazy"
                      className="img-slow aspect-[4/5] w-full object-cover"
                    />
                  ) : (
                    <div className="img-slow aspect-[4/5] w-full" />
                  )}
                </div>
                <span className="caption mt-6 block text-earth">{card.caption}</span>
                <h3 className="mt-3 display-3 text-olive-950">{card.title}</h3>
                {card.tipo === "produto" && (
                  <p className="mt-2 font-display text-xl text-earth">{formatPreco(card.preco)}</p>
                )}
              </>
            );
            return (
              <Reveal key={`${card.tipo}-${card.title}`} delay={i * 100}>
                {card.tipo === "produto" ? (
                  <Link to="/produto/$slug" params={{ slug: card.id }} className="group block">
                    {conteudo}
                  </Link>
                ) : (
                  <Link to="/catalogo" className="group block">
                    {conteudo}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
