import { describe, expect, it } from "vitest";

import { imageAssetSchema } from "@/schemas/image-asset";

import { exampleImage } from "../fixtures/images";

const isValid = (data: unknown) => imageAssetSchema.safeParse(data).success;

describe("imageAssetSchema", () => {
  it("aceita uma imagem completa de entidade", () => {
    expect(isValid(exampleImage)).toBe(true);
  });

  it("exige origem e licença em https (bloqueia javascript: e http)", () => {
    expect(isValid({ ...exampleImage, sourceUrl: "javascript:alert(1)" })).toBe(false);
    expect(isValid({ ...exampleImage, sourceUrl: "http://example.org/foto" })).toBe(false);
    expect(isValid({ ...exampleImage, licenseUrl: "http://example.org/licenca" })).toBe(false);
  });

  it("exige arquivo local em /images (sem hotlink)", () => {
    expect(isValid({ ...exampleImage, src: "https://example.org/foto.jpg" })).toBe(false);
  });

  it("exige crédito e texto alternativo descritivo", () => {
    expect(isValid({ ...exampleImage, credit: "  " })).toBe(false);
    expect(isValid({ ...exampleImage, alt: "foto" })).toBe(false);
  });

  it("exige dizer de qual entidade é a foto", () => {
    const { subjectId, ...withoutSubject } = exampleImage;
    expect(isValid(withoutSubject)).toBe(false);
  });

  it("imagem ambiente precisa ser ilustrativa e não pode representar uma entidade", () => {
    const { subjectId, ...base } = exampleImage;
    expect(isValid({ ...base, subjectType: "ambient", isIllustrative: true })).toBe(true);
    expect(isValid({ ...base, subjectType: "ambient" })).toBe(false);
    expect(isValid({ ...exampleImage, subjectType: "ambient", isIllustrative: true })).toBe(false);
  });

  it("exige data de consulta válida", () => {
    expect(isValid({ ...exampleImage, accessedAt: "28/09/2026" })).toBe(false);
  });
});
