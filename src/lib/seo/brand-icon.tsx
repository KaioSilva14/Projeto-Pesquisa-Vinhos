import "server-only";

import { ImageResponse } from "next/og";

import { BRAND, loadBrandFonts } from "./og-image";

/** Ícone do site (favicon e ícone do iPhone): "V" em serifa sobre bordô. */
export async function renderBrandIcon(sizePx: number, { rounded }: { rounded: boolean }) {
  const [serif] = await loadBrandFonts();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND.accent,
        // O iPhone já arredonda o próprio ícone; o favicon vem arredondado
        borderRadius: rounded ? sizePx * 0.22 : 0,
        color: BRAND.onAccent,
        fontFamily: "Newsreader",
        fontSize: sizePx * 0.78,
        // Compensa o espaço da fonte abaixo da linha de base, para o V ficar centrado
        paddingTop: sizePx * 0.06,
      }}
    >
      V
    </div>,
    { width: sizePx, height: sizePx, fonts: serif ? [serif] : [] },
  );
}
