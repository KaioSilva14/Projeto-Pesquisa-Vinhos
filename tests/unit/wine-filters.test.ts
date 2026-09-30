import { describe, expect, it } from "vitest";

import { keepKnownValues, parseWineListParams } from "@/lib/filters/params";
import {
  applyFilters,
  countSelected,
  facetCounts,
  toggleValue,
  winesHref,
  type FacetRecord,
  type FilterOptions,
} from "@/lib/filters/wine-filters";
import { sortWines, type WineListItem } from "@/lib/wines/list-item";

// Registros fictícios: só testam a lógica dos filtros
const record = (id: string, tipo: string, pais: string, uva: string[] = []): FacetRecord => ({
  id,
  facets: { tipo: [tipo], pais: [pais], regiao: [], uva, produtor: [] },
});
const records = [
  record("a", "tinto", "italia", ["uva-x"]),
  record("b", "tinto", "franca", ["uva-x", "uva-y"]),
  record("c", "branco", "franca", ["uva-y"]),
  record("d", "tinto", "argentina"),
];
const ids = (list: readonly FacetRecord[]) => list.map((item) => item.id);

describe("applyFilters", () => {
  it('"E" entre grupos, "OU" dentro do grupo', () => {
    expect(ids(applyFilters(records, { tipo: ["tinto"], pais: ["italia", "franca"] }))).toEqual([
      "a",
      "b",
    ]);
  });

  it("sem seleção, devolve tudo", () => {
    expect(applyFilters(records, {})).toHaveLength(4);
    expect(applyFilters(records, { pais: [] })).toHaveLength(4);
  });

  it("vinho com várias uvas atende a qualquer uma delas", () => {
    expect(ids(applyFilters(records, { uva: ["uva-y"] }))).toEqual(["b", "c"]);
  });
});

describe("facetCounts", () => {
  it("conta cada opção considerando os outros grupos, não o próprio", () => {
    const selection = { tipo: ["tinto"], pais: ["franca"] };
    expect(Object.fromEntries(facetCounts(records, selection, "pais"))).toEqual({
      italia: 1,
      franca: 1,
      argentina: 1,
    });
    expect(Object.fromEntries(facetCounts(records, selection, "tipo"))).toEqual({
      tinto: 1,
      branco: 1,
    });
  });
});

describe("seleção e URL", () => {
  it("marca, desmarca e conta", () => {
    const one = toggleValue({}, "pais", "franca");
    const two = toggleValue(one, "tipo", "tinto");
    expect(countSelected(two)).toBe(2);
    expect(toggleValue(two, "pais", "franca").pais).toEqual([]);
  });

  it("monta a URL em português, na ordem dos grupos, omitindo o padrão", () => {
    expect(winesHref({})).toBe("/vinhos");
    expect(
      winesHref({ selection: { pais: ["italia", "franca"], tipo: ["tinto"] }, sort: "nome" }),
    ).toBe("/vinhos?tipo=tinto&pais=italia&pais=franca");
    expect(winesHref({ sort: "safra", limit: 48 })).toBe("/vinhos?ordem=safra&mostrar=48");
  });

  it("a URL lida de novo volta ao mesmo estado", () => {
    const state = {
      selection: { tipo: ["tinto"], uva: ["uva-x", "uva-y"] },
      sort: "safra" as const,
      limit: 48,
    };
    const url = new URL(winesHref(state), "https://x");
    const params: Record<string, string | string[]> = {};
    for (const key of new Set(url.searchParams.keys())) {
      const values = url.searchParams.getAll(key);
      params[key] = values.length > 1 ? values : values[0]!;
    }
    expect(parseWineListParams(params)).toEqual(state);
  });
});

describe("parseWineListParams", () => {
  it("usa o padrão e ignora valores inválidos", () => {
    expect(parseWineListParams({})).toEqual({ selection: {}, sort: "nome", limit: 24 });
    expect(
      parseWineListParams({ pais: ["franca", "<script>", "franca"], ordem: "preco", mostrar: "7" }),
    ).toEqual({ selection: { pais: ["franca"] }, sort: "nome", limit: 24 });
  });

  it("descarta valores que não existem nos dados", () => {
    const options = {
      tipo: [{ value: "tinto", label: "Tinto" }],
      pais: [],
      regiao: [],
      uva: [],
      produtor: [],
    } satisfies FilterOptions;
    expect(keepKnownValues({ tipo: ["tinto", "azul"], pais: ["atlantida"] }, options)).toEqual({
      tipo: ["tinto"],
    });
  });
});

describe("sortWines", () => {
  const item = (name: string, latestYear?: number): WineListItem => ({
    ...record(name, "tinto", "x"),
    name,
    href: `/vinhos/${name}`,
    typeLabel: "Tinto",
    isNonVintage: false,
    ...(latestYear !== undefined && { latestYear }),
  });
  const list = [item("Bravo", 2019), item("Alfa"), item("Ébano", 2022), item("Delta", 2019)];

  it("nome: ordem alfabética do português", () => {
    expect(sortWines(list, "nome").map((wine) => wine.name)).toEqual([
      "Alfa",
      "Bravo",
      "Delta",
      "Ébano",
    ]);
  });

  it("safra: mais recente primeiro, sem safra no fim", () => {
    expect(sortWines(list, "safra").map((wine) => wine.name)).toEqual([
      "Ébano",
      "Bravo",
      "Delta",
      "Alfa",
    ]);
  });
});
