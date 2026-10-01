import "server-only";

import { ImageResponse } from "next/og";

import { BRAND, loadBrandFonts } from "./og-image";

/**
 * Formato do ícone:
 * - rounded: aba do navegador e resultados de busca (cantos arredondados no próprio desenho);
 * - square: iPhone, que arredonda o ícone sozinho;
 * - maskable: Android, que recorta em círculo ou outras formas; o "V" fica dentro da zona
 *   segura (80% centrais) e o fundo vai até a borda.
 */
export type BrandIconShape = "rounded" | "square" | "maskable";

/** Ícone do Vinum: "V" em serifa (Newsreader) sobre o bordô da marca. */
export async function renderBrandIcon(sizePx: number, shape: BrandIconShape) {
  const [serif] = await loadBrandFonts();
  const glyph = shape === "maskable" ? 0.56 : 0.78;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND.accent,
        borderRadius: shape === "rounded" ? sizePx * 0.22 : 0,
        color: BRAND.onAccent,
        fontFamily: "Newsreader",
        fontSize: sizePx * glyph,
        // Compensa o espaço da fonte abaixo da linha de base, para o V ficar centrado
        paddingTop: sizePx * glyph * 0.16,
      }}
    >
      V
    </div>,
    { width: sizePx, height: sizePx, fonts: serif ? [serif] : [] },
  );
}
