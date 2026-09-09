import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";
import camiseta from "@/assets/produto-camiseta-oliva.jpg";
import oliveira from "@/assets/editorial-oliveira.jpg";
import estrada from "@/assets/editorial-estrada.jpg";

const ITEMS = [
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
];

export function Collections() {
  return (
    <section className="section">
      <div className="content">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="caption text-gold">Coleção</span>
            <h2 className="mt-6 display-2 text-olive-950">Vista aquilo em que você crê.</h2>
          </div>
          <Link to="/produto" className="caption text-olive-800 link-underline">
            Ver tudo
          </Link>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal key={item.caption} delay={i * 100}>
              <Link to="/produto" className="group block">
                <div className="film overflow-hidden rounded-sm bg-beige-200">
                  <img
                    src={item.img}
                    alt={item.alt}
                    width={1200}
                    height={1504}
                    loading="lazy"
                    className="img-slow aspect-[4/5] w-full object-cover"
                  />
                </div>
                <span className="caption mt-6 block text-earth">{item.caption}</span>
                <h3 className="mt-3 display-3 text-olive-950">{item.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
