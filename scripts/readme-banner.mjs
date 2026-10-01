// Gera os banners animados do README (claro e escuro), com as fontes do site embutidas
// (o GitHub não carrega fontes externas dentro de imagens). Uso: node scripts/readme-banner.mjs
// Animação só com CSS; com "reduzir movimento", o banner fica parado.
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = process.cwd();
const font = (file) => readFileSync(`${ROOT}/src/assets/fonts/${file}`).toString("base64");
const serif = font("Newsreader-Medium.ttf");
const sans = font("HankenGrotesk-Medium.ttf");

const themes = {
  claro: {
    bg: "#f5f4f0",
    text: "#1c1c1f",
    muted: "#4f4f55",
    accent: "#6b1d2f",
    detail: "#7e6430",
    border: "#d9d6ce",
  },
  escuro: {
    bg: "#141416",
    text: "#edebe6",
    muted: "#b8b6b0",
    accent: "#db909f",
    detail: "#c9ab72",
    border: "#34343a",
  },
};

const WORDS = ["Vinhos", "Uvas", "Regiões", "Produtores", "Harmonizações"];
const STEP = 2.6; // segundos por palavra
const CYCLE = STEP * WORDS.length;
const START = 1.8; // a rotação começa depois da entrada

const svg = (
  c,
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 380" width="1280" height="380" role="img" aria-labelledby="t d">
<title id="t">Vinum</title>
<desc id="d">Vinum: pesquisa, descoberta e consulta de vinhos, com fontes verificadas. Vinhos com fonte, do rótulo à região.</desc>
<style>
@font-face { font-family: "Newsreader"; src: url(data:font/ttf;base64,${serif}) format("truetype"); font-weight: 500; }
@font-face { font-family: "Hanken"; src: url(data:font/ttf;base64,${sans}) format("truetype"); font-weight: 500; }
.serif { font-family: "Newsreader", Georgia, serif; font-weight: 500; }
.sans { font-family: "Hanken", "Segoe UI", Arial, sans-serif; font-weight: 500; }
.in { opacity: 0; animation: rise .9s cubic-bezier(.22,1,.36,1) forwards; transform-box: fill-box; }
.d1 { animation-delay: .15s } .d2 { animation-delay: .55s } .d3 { animation-delay: .9s } .d4 { animation-delay: 1.2s } .d5 { animation-delay: 1.5s }
.draw { stroke-dasharray: 140; stroke-dashoffset: 140; animation: draw 1s .45s cubic-bezier(.22,1,.36,1) forwards; }
.word { opacity: 0; animation: word ${CYCLE}s linear infinite; transform-box: fill-box; }
${WORDS.map((_, i) => `.w${i} { animation-delay: ${(START + i * STEP).toFixed(1)}s }`).join(" ")}
@keyframes rise { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
@keyframes draw { to { stroke-dashoffset: 0 } }
@keyframes word {
  0% { opacity: 0; transform: translateY(14px) }
  4% { opacity: 1; transform: none }
  ${((STEP / CYCLE) * 100 - 4).toFixed(1)}% { opacity: 1; transform: none }
  ${((STEP / CYCLE) * 100).toFixed(1)}% { opacity: 0; transform: translateY(-10px) }
  100% { opacity: 0 }
}
@media (prefers-reduced-motion: reduce) {
  .in, .draw, .word { animation: none; opacity: 1; stroke-dashoffset: 0; }
  .word:not(.w0) { opacity: 0; }
}
</style>
<rect width="1280" height="380" rx="24" fill="${c.bg}"/>
<rect x="0.5" y="0.5" width="1279" height="379" rx="23.5" fill="none" stroke="${c.border}"/>
<rect x="0" y="40" width="10" height="300" fill="${c.accent}"/>

<text class="serif in d1" x="92" y="190" font-size="128" letter-spacing="-2" fill="${c.text}">Vinum</text>
<line class="draw" x1="96" y1="228" x2="236" y2="228" stroke="${c.detail}" stroke-width="3"/>
<text class="sans in d3" x="96" y="282" font-size="30" fill="${c.muted}">Vinhos com fonte, do rótulo à região.</text>
<text class="sans in d4" x="96" y="326" font-size="19" letter-spacing="1" fill="${c.muted}">Pesquisa e descoberta · sem venda · sem publicidade · cada fato com fonte</text>

<line class="in d4" x1="820" y1="96" x2="820" y2="300" stroke="${c.border}" stroke-width="2"/>
<text class="sans in d5" x="868" y="150" font-size="18" letter-spacing="5" fill="${c.muted}">EXPLORE POR</text>
${WORDS.map((w, i) => `<text class="serif word w${i}" x="866" y="232" font-size="64" fill="${c.accent}">${w}</text>`).join("\n")}
<text class="sans in d5" x="868" y="292" font-size="18" fill="${c.muted}">Next.js · TypeScript · dados com fonte</text>
</svg>
`;

for (const [name, colors] of Object.entries(themes)) {
  writeFileSync(`${ROOT}/.github/readme/banner-${name}.svg`, svg(colors));
}
console.log("ok");
