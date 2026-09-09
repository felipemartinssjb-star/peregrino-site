import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({
  children,
  overlay = false,
}: {
  children: ReactNode;
  overlay?: boolean;
}) {
  return (
    <div className="min-h-screen bg-beige-50">
      <Header overlay={overlay} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="content pt-44 pb-20 md:pt-56 md:pb-28">
      <div className="max-w-3xl">
        <span className="caption text-gold">{eyebrow}</span>
        <h1 className="mt-8 display-1 text-olive-950">{title}</h1>
        <span className="rule mt-10" />
        <p className="mt-8 max-w-xl body-lg">{intro}</p>
      </div>
    </section>
  );
}
