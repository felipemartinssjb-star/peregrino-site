import { Link } from "@tanstack/react-router";

/**
 * Assinatura tipográfica provisória.
 * Substituir pelo arquivo oficial da marca assim que disponível.
 */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const color = tone === "light" ? "text-beige-50" : "text-olive-900";
  return (
    <Link to="/" className={`inline-block ${color}`} aria-label="Peregrino — Fé e Caminho">
      <span className="block font-display text-[1.35rem] leading-none tracking-[0.34em] uppercase">
        Peregrino
      </span>
      <span className="mt-2 block caption text-gold text-[0.5625rem] tracking-[0.34em]">
        Fé e Caminho
      </span>
    </Link>
  );
}
