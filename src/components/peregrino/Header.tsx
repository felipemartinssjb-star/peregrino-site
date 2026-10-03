import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const NAV = [
  { label: "Coleção", to: "/produto" },
  { label: "Peregrino", to: "/peregrino" },
  { label: "Missão", to: "/missao" },
  { label: "Journal", to: "/journal" },
  { label: "História", to: "/historia" },
] as const;

export function Header({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !overlay || scrolled || open;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        backgroundColor: solid ? "color-mix(in srgb, var(--p-beige-50) 94%, transparent)" : "transparent",
        backgroundImage: solid
          ? "none"
          : "linear-gradient(180deg, color-mix(in srgb, var(--p-beige-50) 72%, transparent) 0%, transparent 100%)",
        borderBottom: solid ? "1px solid var(--color-border)" : "1px solid transparent",
        backdropFilter: solid ? "blur(10px)" : "none",
        transition: "background-color 350ms ease, border-color 350ms ease",
      }}
    >

      <div className="shell flex items-center justify-between px-6 py-5 md:px-12">
        <Logo />

        <nav className="hidden items-center gap-10 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="caption text-olive-800 transition-colors hover:text-gold"
              activeProps={{ className: "caption text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link to="/produto" className="caption hidden text-olive-800 hover:text-gold md:inline-block">
            Vista sua fé
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-olive-900 lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X size={20} strokeWidth={1.25} /> : <Menu size={20} strokeWidth={1.25} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-beige-50 lg:hidden">
          <nav className="flex flex-col gap-6 px-6 py-10">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="caption text-olive-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
