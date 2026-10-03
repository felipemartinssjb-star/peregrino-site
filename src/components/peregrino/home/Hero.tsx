import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-caminho.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full film">
      <img
        src={hero}
        alt="Homem caminhando por uma rua ao entardecer, luz dourada"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, var(--p-beige-50) 0%, color-mix(in srgb, var(--p-beige-50) 88%, transparent) 32%, transparent 62%)",
        }}
      />
      <div className="relative flex min-h-[92vh] items-center">
        <div className="content">
          <div className="max-w-2xl pt-32 pb-24 reveal" style={{ animationDelay: "120ms" }}>
            <h1 className="display-1 uppercase text-olive-950">
              Evangelizar
              <br />
              sem falar
              <br />
              <span className="text-gold">uma palavra.</span>
            </h1>

            <span className="rule mt-10" />

            <p className="mt-8 max-w-md body-lg">
              Algumas mensagens precisam ser ditas. Outras podem ser vividas.
            </p>
            <p className="mt-5 max-w-md body-base">
              A Peregrino acredita que aquilo que vestimos também pode abrir portas para conversas,
              despertar perguntas e apontar para Cristo.
            </p>

            <div className="mt-10 space-y-1 font-display text-xl text-olive-900">
              <p>Vista sua fé.</p>
              <p>Carregue uma mensagem.</p>
              <p>Seja luz onde Deus te plantar.</p>
            </div>

            <Link to="/produto" className="btn-base btn-solid mt-12">
              Vista sua fé
              <ArrowRight size={15} strokeWidth={1.25} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
