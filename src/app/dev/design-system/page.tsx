import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";

import { ComponentsShowcase } from "./_components/ComponentsShowcase";
import { Section } from "./_components/Section";

// Página interna para conferir os tokens do DESIGN.md. Não existe em produção.
export const metadata: Metadata = {
  title: "Design system (interno)",
  robots: { index: false, follow: false },
};

const surfaces = [
  { name: "bg", className: "bg-bg" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-raised", className: "bg-surface-raised" },
  { name: "sunken", className: "bg-sunken" },
  { name: "accent-soft", className: "bg-accent-soft" },
] as const;

const textColors = [
  { name: "text", className: "text-text" },
  { name: "text-muted", className: "text-text-muted" },
  { name: "text-subtle", className: "text-text-subtle" },
  { name: "accent", className: "text-accent" },
  { name: "detail", className: "text-detail" },
  { name: "success", className: "text-success" },
  { name: "warning", className: "text-warning" },
  { name: "danger", className: "text-danger" },
  { name: "info", className: "text-info" },
] as const;

const typeScale = [
  { name: "display", className: "font-serif text-display" },
  { name: "h1", className: "font-serif text-h1" },
  { name: "h2", className: "font-serif text-h2" },
  { name: "h3", className: "font-serif text-h3 font-medium" },
  { name: "h4", className: "text-h4 font-semibold" },
  { name: "lead", className: "text-lead" },
  { name: "body-lg", className: "text-body-lg" },
  { name: "body", className: "text-body" },
  { name: "small", className: "text-small" },
  { name: "caption", className: "text-caption text-text-subtle" },
  { name: "overline", className: "text-overline uppercase text-text-muted" },
] as const;

const radii = [
  { name: "media · 2px", className: "rounded-media" },
  { name: "sm · 4px", className: "rounded-sm" },
  { name: "md · 8px", className: "rounded-md" },
  { name: "lg · 16px", className: "rounded-lg" },
  { name: "pill", className: "rounded-pill" },
] as const;

const shadows = [
  { name: "sm", className: "shadow-sm" },
  { name: "md", className: "shadow-md" },
  { name: "lg", className: "shadow-lg" },
] as const;

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Container className="py-16">
      <h1 className="font-serif text-h1">Design system</h1>
      <p className="mt-4 mb-12 max-w-lead text-lead text-text-muted">
        Tokens do DESIGN.md renderizados no tema atual. Troque o tema do sistema para conferir o
        escuro.
      </p>

      <Section title="Superfícies">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {surfaces.map((s) => (
            <li key={s.name} className={`${s.className} rounded-sm border border-border p-4`}>
              <p className="text-small font-medium">{s.name}</p>
              <p className="text-caption text-text-subtle">Legenda em text-subtle</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Texto e estados">
        <ul className="grid gap-3 md:grid-cols-3">
          {textColors.map((c) => (
            <li key={c.name} className={`${c.className} text-body`}>
              {c.name}: texto de exemplo com acentuação
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="inline-flex h-11 items-center rounded-sm bg-accent px-5 font-medium text-on-accent">
            Acento
          </span>
          <span className="inline-flex h-11 items-center rounded-sm border border-border-strong px-5 font-medium">
            Borda forte
          </span>
          <span className="inline-flex items-center rounded-pill bg-accent-soft px-3 py-1 text-small text-accent">
            Selecionado
          </span>
        </div>
      </Section>

      <Section title="Tipografia">
        <ul className="space-y-6">
          {typeScale.map((t) => (
            <li key={t.name} className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
              <span className="text-caption text-text-subtle">{t.name}</span>
              <span className={t.className}>Uvas, regiões e produtores (1234)</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 font-serif text-h2">
          Títulos com <em>ênfase em itálico</em> da mesma família
        </p>
        <p className="mt-4 text-small text-text-muted">
          Acentos: ã â á à ç é ê í ó ô õ ú ü · Ñ ñ · Œ œ
        </p>
        <dl className="mt-6 grid max-w-xs grid-cols-2 gap-x-6 gap-y-1 text-body">
          <dt className="text-text-muted">Números tabulares</dt>
          <dd className="text-right">1111</dd>
          <dt className="text-text-muted">alinhados à direita</dt>
          <dd className="text-right">8888</dd>
          <dt className="text-text-muted">em listas dl</dt>
          <dd className="text-right">12,5</dd>
        </dl>
      </Section>

      <Section title="Raios e sombras">
        <ul className="flex flex-wrap gap-4">
          {radii.map((r) => (
            <li key={r.name} className={`${r.className} bg-sunken px-5 py-6 text-small`}>
              {r.name}
            </li>
          ))}
        </ul>
        <ul className="mt-8 flex flex-wrap gap-6">
          {shadows.map((s) => (
            <li
              key={s.name}
              className={`${s.className} rounded-md bg-surface px-6 py-8 text-small`}
            >
              shadow-{s.name}
            </li>
          ))}
        </ul>
      </Section>

      <ComponentsShowcase />
    </Container>
  );
}
