// Adiciona verificações como toBeInTheDocument() e toHaveAccessibleName() ao expect do Vitest
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// O jsdom não implementa algumas APIs do navegador que o Radix usa (posicionamento de
// popovers e listas). Versões mínimas, só para os testes: o comportamento real é conferido
// no navegador pelos testes E2E.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub;
Element.prototype.scrollIntoView ??= () => {};
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.releasePointerCapture ??= () => {};

// Desmonta o que cada teste renderizou, para um teste não interferir no seguinte
afterEach(() => {
  cleanup();
});
