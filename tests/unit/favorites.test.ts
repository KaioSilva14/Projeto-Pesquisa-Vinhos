import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MAX_FAVORITES, sanitizeFavorites } from "@/lib/favorites/favorites";
import { FAVORITES_STORAGE_KEY, useFavorites } from "@/stores/favorites";

// Favoritos (F6-01): TESTING.md §2 item 5

const saved = () => JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "null");
const store = () => useFavorites.getState();

beforeEach(() => {
  window.localStorage.clear();
  useFavorites.setState({ items: [] });
});

afterEach(() => vi.restoreAllMocks());

describe("sanitizeFavorites", () => {
  it("aceita itens válidos e descarta o resto", () => {
    expect(
      sanitizeFavorites([
        { kind: "wine", id: "vinho-exemplo", savedAt: "2026-10-01T10:00:00.000Z" },
        { kind: "pais", id: "brasil" },
        { kind: "grape", id: "<script>" },
        { kind: "grape" },
        "texto",
        null,
      ]),
    ).toEqual([{ kind: "wine", id: "vinho-exemplo", savedAt: "2026-10-01T10:00:00.000Z" }]);
  });

  it("une repetidos e troca data inválida por vazio", () => {
    expect(
      sanitizeFavorites([
        { kind: "region", id: "regiao-a", savedAt: "ontem" },
        { kind: "region", id: "regiao-a", savedAt: "2026-10-01" },
      ]),
    ).toEqual([{ kind: "region", id: "regiao-a", savedAt: "" }]);
  });

  it("qualquer coisa que não seja lista vira lista vazia", () => {
    expect(sanitizeFavorites(undefined)).toEqual([]);
    expect(sanitizeFavorites({ items: [] })).toEqual([]);
  });

  it("limita a quantidade (localStorage manipulado)", () => {
    const many = Array.from({ length: MAX_FAVORITES + 50 }, (_, index) => ({
      kind: "wine",
      id: `vinho-${index}`,
    }));
    expect(sanitizeFavorites(many)).toHaveLength(MAX_FAVORITES);
  });
});

describe("store de favoritos", () => {
  it("salva, remove e informa o estado", () => {
    expect(store().toggle("wine", "vinho-exemplo")).toBe(true);
    expect(store().items.map((item) => item.id)).toEqual(["vinho-exemplo"]);
    expect(store().toggle("wine", "vinho-exemplo")).toBe(false);
    expect(store().items).toEqual([]);
  });

  it("o mais recente fica primeiro", () => {
    store().toggle("grape", "uva-a");
    store().toggle("grape", "uva-b");
    expect(store().items.map((item) => item.id)).toEqual(["uva-b", "uva-a"]);
  });

  it("persiste no localStorage com versão", () => {
    store().toggle("producer", "produtor-exemplo");
    expect(saved()).toMatchObject({
      version: 1,
      state: { items: [{ kind: "producer", id: "produtor-exemplo" }] },
    });
  });

  it("recarrega o que estava salvo, validando", async () => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        state: {
          items: [
            { kind: "wine", id: "vinho-a" },
            { kind: "x", id: "?" },
          ],
        },
      }),
    );
    await useFavorites.persist.rehydrate();
    expect(store().items).toEqual([{ kind: "wine", id: "vinho-a", savedAt: "" }]);
  });

  it("JSON corrompido não quebra: começa vazio", async () => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, "{isso não é json");
    await useFavorites.persist.rehydrate();
    expect(store().items).toEqual([]);
  });

  it("localStorage indisponível não quebra: guarda na memória da aba", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    expect(() => store().toggle("wine", "vinho-a")).not.toThrow();
    await useFavorites.persist.rehydrate();
    expect(store().items.map((item) => item.id)).toEqual(["vinho-a"]);
  });
});
