import { describe, expect, it } from "vitest";

import { normalize } from "@/lib/normalize";

describe("normalize", () => {
  it("converte para minúsculas", () => {
    expect(normalize("MALBEC")).toBe("malbec");
  });

  it("remove acentos do português, francês e espanhol", () => {
    expect(normalize("França")).toBe("franca");
    expect(normalize("Côtes du Rhône")).toBe("cotes du rhone");
    expect(normalize("Ribera del Duero, España")).toBe("ribera del duero espana");
    expect(normalize("Müller-Thurgau")).toBe("muller thurgau");
  });

  it("separa ligaduras que o Unicode não decompõe", () => {
    expect(normalize("Œil")).toBe("oeil");
    expect(normalize("Straße")).toBe("strasse");
  });

  it("troca hífens, apóstrofos e pontuação por espaço", () => {
    expect(normalize("Saint-Émilion")).toBe("saint emilion");
    expect(normalize("Barbera d'Asti")).toBe("barbera d asti");
    expect(normalize("tinto, francês!")).toBe("tinto frances");
  });

  it("junta espaços repetidos e remove espaços nas pontas", () => {
    expect(normalize("   vinho    tinto  ")).toBe("vinho tinto");
    expect(normalize("vinho\t\ntinto")).toBe("vinho tinto");
  });

  it("preserva números (safras)", () => {
    expect(normalize("Safra 2019")).toBe("safra 2019");
  });

  it("devolve texto vazio quando não sobra nada comparável", () => {
    expect(normalize("")).toBe("");
    expect(normalize("  ")).toBe("");
    expect(normalize("!?-—")).toBe("");
  });

  it("lida com entradas muito longas sem erro", () => {
    const long = "Ç".repeat(10_000);
    expect(normalize(long)).toBe("c".repeat(10_000));
  });
});
