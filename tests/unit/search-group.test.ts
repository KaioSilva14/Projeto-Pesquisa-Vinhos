import { describe, expect, it } from "vitest";

import { groupResults } from "@/lib/search/group";
import type { SearchKind, SearchResult } from "@/lib/search/types";

const result = (id: string, kind: SearchKind): SearchResult => ({
  document: { id, kind, name: id, href: `/${id}` },
  score: 0,
});

describe("groupResults", () => {
  it("agrupa por tipo na ordem em que cada tipo aparece primeiro", () => {
    const groups = groupResults(
      [result("u1", "grape"), result("v1", "wine"), result("u2", "grape")],
      5,
    );
    expect(groups.map((group) => group.kind)).toEqual(["grape", "wine"]);
    expect(groups[0]?.results.map((item) => item.document.id)).toEqual(["u1", "u2"]);
  });

  it("limita a quantidade por grupo", () => {
    const many = Array.from({ length: 8 }, (_, index) => result(`v${index}`, "wine"));
    expect(groupResults(many, 5)[0]?.results).toHaveLength(5);
  });

  it("lista vazia gera nenhum grupo", () => {
    expect(groupResults([], 5)).toEqual([]);
  });
});
