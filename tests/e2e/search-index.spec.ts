import { expect, test } from "./helpers/test";

// F3-02: o índice do autocomplete é um JSON estático, pequeno e só com dados publicados
test.describe("Índice de busca", () => {
  test("responde JSON com documentos de todos os tipos", async ({ request }) => {
    const response = await request.get("/api/search-index");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    const documents: { kind: string }[] = await response.json();
    const kinds = new Set(documents.map((document) => document.kind));
    expect([...kinds].sort()).toEqual(["country", "grape", "producer", "region", "wine"]);
    expect((await response.body()).length).toBeLessThanOrEqual(150 * 1024);
  });
});
