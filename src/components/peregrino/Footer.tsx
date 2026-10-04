import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-olive-950 text-beige-100">
      <div className="content py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="block font-display text-2xl uppercase tracking-[0.34em] text-beige-50">
              Peregrino
            </span>
            <span className="mt-3 block caption text-gold">Fé e Caminho</span>
            <p className="mt-8 max-w-sm font-display text-xl leading-relaxed text-beige-200">
              “Somos peregrinos nesta terra.”
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <span className="caption text-sand">Navegar</span>
            <ul className="mt-6 space-y-4">
              {[
                { label: "Catálogo", to: "/catalogo" },
                { label: "Carrinho", to: "/carrinho" },
                { label: "O Peregrino", to: "/peregrino" },
                { label: "Missão", to: "/missao" },
              ].map((i) => (
                <li key={i.to}>
                  <Link to={i.to} className="text-sm text-beige-200 link-underline">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <span className="caption text-sand">Marca</span>
            <ul className="mt-6 space-y-4">
              {[
                { label: "História", to: "/historia" },
                { label: "Journal", to: "/journal" },
              ].map((i) => (
                <li key={i.to}>
                  <Link to={i.to} className="text-sm text-beige-200 link-underline">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-4 border-t border-olive-800 pt-8 md:flex-row md:items-center md:justify-between">
          <span className="caption text-earth">© {new Date().getFullYear()} Peregrino</span>
          <span className="caption text-earth">Vista aquilo em que você crê</span>
        </div>
      </div>
    </footer>
  );
}
