import { describe, expect, it } from "vitest";

import { cn } from "@/lib/cn";

describe("cn", () => {
  it("junta classes e ignora valores falsos", () => {
    expect(cn("px-4", false, undefined, null, "py-2")).toBe("px-4 py-2");
  });

  it("aceita objetos de classes condicionais", () => {
    expect(cn("rounded-sm", { "bg-accent": true, "bg-sunken": false })).toBe(
      "rounded-sm bg-accent",
    );
  });

  it("deixa a última classe vencer quando há conflito", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
    expect(cn("bg-surface", "bg-sunken")).toBe("bg-sunken");
  });

  it("mantém tamanho e cor de texto juntos (tokens diferentes)", () => {
    expect(cn("text-h1", "text-text-muted")).toBe("text-h1 text-text-muted");
    expect(cn("text-caption", "text-accent")).toBe("text-caption text-accent");
  });

  it("resolve conflitos entre tokens da escala tipográfica", () => {
    expect(cn("text-body", "text-lead")).toBe("text-lead");
    expect(cn("text-h1", "text-display")).toBe("text-display");
  });

  it("resolve conflitos entre raios e contêineres próprios do Vinum", () => {
    expect(cn("rounded-sm", "rounded-pill")).toBe("rounded-pill");
    expect(cn("rounded-media", "rounded-md")).toBe("rounded-md");
    expect(cn("max-w-content", "max-w-lead")).toBe("max-w-lead");
  });
});
