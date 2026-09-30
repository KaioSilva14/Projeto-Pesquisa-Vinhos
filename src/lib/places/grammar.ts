// "de" + artigo do nome do país ("da Itália", "do Brasil", "dos Estados Unidos"). É gramática
// do português, não dado sobre vinhos. País sem artigo cadastrado → "de {nome}".
const CONTRACTIONS: Readonly<Record<string, string>> = {
  it: "da",
  fr: "da",
  es: "da",
  us: "dos",
  ar: "da",
  br: "do",
};

/** "da Itália", "do Brasil"… */
export function ofCountry(country: { id: string; name: string }): string {
  return `${CONTRACTIONS[country.id] ?? "de"} ${country.name}`;
}
