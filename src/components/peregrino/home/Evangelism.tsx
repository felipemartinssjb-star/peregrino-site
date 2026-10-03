import { Reveal } from "../Reveal";
import oliveira from "@/assets/editorial-oliveira.jpg";

export function Evangelism() {
  return (
    <section className="bg-olive-950 text-beige-100">
      <div className="content grid items-center gap-16 py-24 md:grid-cols-12 md:py-32">
        <Reveal className="md:col-span-5">
          <span className="caption text-gold">Evangelismo silencioso</span>
          <h2 className="mt-8 display-2 text-beige-50">Viva de modo que Jesus apareça.</h2>
          <span className="rule mt-8" />
          <p className="mt-8 text-[0.9375rem] leading-[1.85] text-sand">
            Nem toda conversa começa com palavras. Às vezes começa com uma frase nas costas de
            alguém que atravessa a rua com calma, e termina com uma pergunta sincera.
          </p>
          <p className="mt-5 text-[0.9375rem] leading-[1.85] text-sand">
            É esse o espaço que a Peregrino ocupa: entre o que se veste e o que se testemunha.
          </p>
        </Reveal>

        <Reveal delay={120} className="md:col-span-6 md:col-start-7">
          <div className="film overflow-hidden rounded-sm">
            <img
              src={oliveira}
              alt="Ramo de oliveira sobre concreto com luz natural"
              width={1200}
              height={1504}
              loading="lazy"
              className="img-slow aspect-[4/5] w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
