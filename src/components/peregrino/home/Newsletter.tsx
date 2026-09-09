import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Reveal } from "../Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    setEmail("");
    toast.success("Você está no caminho. Em breve entraremos em contato.");
  };

  return (
    <section className="section">
      <div className="content">
        <Reveal className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="caption text-gold">Newsletter</span>
            <h2 className="mt-6 display-2 text-olive-950">Caminhe conosco</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="body-base">
              Cartas ocasionais sobre fé, propósito e novas peças. Sem ruído.
            </p>
            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                aria-label="Seu e-mail"
                className="min-h-[54px] flex-1 rounded-sm border border-input bg-transparent px-5 text-sm text-olive-950 outline-none transition-colors placeholder:text-earth focus:border-gold"
              />
              <button type="submit" className="btn-base btn-solid">
                Assinar
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
