import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { SITE } from "@/config/site";

// Imagens para redes sociais (SEO.md §4): só tipográficas, nunca desenham garrafa. Geradas no
// build com as mesmas fontes do site (licença OFL em src/assets/fonts).

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Cores da marca (tokens do tema claro em globals.css). */
export const BRAND = {
  bg: "#f5f4f0",
  text: "#1c1c1f",
  muted: "#4f4f55",
  accent: "#6b1d2f",
  onAccent: "#f5f4f0",
  detail: "#7e6430",
} as const;

const fontsDir = path.join(process.cwd(), "src/assets/fonts");

export async function loadBrandFonts() {
  const [serif, sans] = await Promise.all([
    readFile(path.join(fontsDir, "Newsreader-Medium.ttf")),
    readFile(path.join(fontsDir, "HankenGrotesk-Medium.ttf")),
  ]);
  return [
    { name: "Newsreader", data: serif, weight: 500 as const, style: "normal" as const },
    { name: "Hanken Grotesk", data: sans, weight: 500 as const, style: "normal" as const },
  ];
}

type OgCardProps = {
  /** Tipo da página, em cima do título (ex.: "Vinho", "Uva"). */
  eyebrow: string;
  title: string;
  /** Linha de apoio curta (ex.: produtor, país). */
  subtitle?: string;
};

/** Nomes longos ganham fonte menor para caber em até 2–3 linhas. */
const titleSize = (title: string) => (title.length <= 24 ? 96 : title.length <= 44 ? 76 : 60);

export async function renderOgCard({ eyebrow, title, subtitle }: OgCardProps) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: BRAND.bg,
        fontFamily: "Hanken Grotesk",
      }}
    >
      <div style={{ width: 28, height: "100%", background: BRAND.accent }} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px 64px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: BRAND.muted,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily: "Newsreader",
              fontSize: titleSize(title),
              lineHeight: 1.05,
              letterSpacing: -1,
              color: BRAND.text,
            }}
          >
            {title}
          </div>
          <div style={{ width: 96, height: 3, background: BRAND.detail }} />
          {subtitle && <div style={{ fontSize: 34, color: BRAND.muted }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <div style={{ fontFamily: "Newsreader", fontSize: 48, color: BRAND.accent }}>
            {SITE.name}
          </div>
          <div style={{ fontSize: 26, color: BRAND.muted }}>
            Vinhos com fonte, do rótulo à região.
          </div>
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await loadBrandFonts() },
  );
}
