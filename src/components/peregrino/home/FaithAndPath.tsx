import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";
import estrada from "@/assets/editorial-estrada.jpg";

export function FaithAndPath() {
  return (
    <section className="section bg-beige-100">
      <div className="content grid items-center gap-16 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <div className="film overflow-hidden rounded-sm">
            <img
              src={estrada}
              alt="Estrada vazia em direção às montanhas na luz do fim de tarde"
              width={1600}
              height={1008}
              loading="lazy"
              className="img-slow h-full w-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={120} className="md:col-span-5 md:pl-6">
          <span className="caption text-gold">Fé e Caminho</span>
          <h2 className="mt-8 display-2 text-olive-950">O IDE não é um detalhe da fé.</h2>
          <span className="rule mt-8" />
          <p className="mt-8 body-base">
            O caminho raramente é reto e quase nunca é curto. Mas quem anda com propósito
            reconhece que o destino já foi prometido — e que cada passo é uma resposta.
          </p>
          <p className="mt-5 body-base">
            Nossas peças são pensadas para esse trajeto: tecidos densos, cores da terra, formas que
            não competem com a mensagem.
          </p>
          <Link to="/missao" className="btn-base btn-outline mt-10">
            Nossa missão
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
