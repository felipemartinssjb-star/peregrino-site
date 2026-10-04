import { DoorOpen, MessageCircle, Compass, Sun } from "lucide-react";

const PILLARS = [
  { icon: DoorOpen, title: "Abre portas", lines: ["Uma mensagem pode", "abrir caminhos."] },
  {
    icon: MessageCircle,
    title: "Desperta perguntas",
    lines: ["Perguntas abrem diálogos.", "Diálogos transformam vidas."],
  },
  { icon: Compass, title: "Aponta para Cristo", lines: ["O objetivo não é você.", "É Ele."] },
  { icon: Sun, title: "Seja luz", lines: ["Seja luz onde Deus", "te plantar."] },
];

export function Pillars() {
  return (
    <section className="bg-olive-900 text-beige-100">
      <div className="content grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:py-14">
        {PILLARS.map(({ icon: Icon, title, lines }, i) => (
          <div
            key={title}
            className={`flex flex-col items-center px-6 text-center ${
              i > 0 ? "lg:border-l lg:border-olive-700" : ""
            }`}
          >
            <Icon size={22} strokeWidth={1} className="text-gold" />
            <span className="caption mt-5 text-beige-100">{title}</span>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-sand">
              {lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
