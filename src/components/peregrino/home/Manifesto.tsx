import { Reveal } from "../Reveal";

export function Manifesto() {
  return (
    <section className="section">
      <div className="content">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="caption text-gold">Manifesto</span>
          <p className="mt-10 display-2 text-olive-950">
            Você não está apenas caminhando.
            <br />
            Existe um propósito em cada passo.
          </p>
          <span className="rule mx-auto mt-12" />
          <p className="mx-auto mt-10 max-w-xl body-lg">
            Peregrino nasce da convicção de que a fé não se guarda. Ela se carrega — na forma como
            se anda, no que se veste, no modo como se atravessa o dia. Cada peça é feita para durar
            e para ser lembrada por quem cruzar o seu caminho.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
