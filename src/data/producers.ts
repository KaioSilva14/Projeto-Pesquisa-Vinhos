import type { Producer } from "@/schemas/producer";

import { imageIdsOf } from "./images";

// Produtores aprovados em docs/CURATION.md (ADR-023). Fatos lidos nas fichas técnicas e páginas
// oficiais citadas (src/data/sources.ts) em 2026-09-30. Certificações (orgânico etc.) não entram:
// as fichas afirmam, mas não citam o registro da certificadora (DATA_MODEL.md §3.4).

function producer(data: Omit<Producer, "status" | "createdAt" | "updatedAt" | "slug">): Producer {
  const imageIds = imageIdsOf("producer", data.id);
  return {
    ...data,
    ...(imageIds.length > 0 && { imageIds }),
    slug: data.id,
    status: "published",
    createdAt: "2026-09-30",
    updatedAt: "2026-09-30",
  };
}

const site = (url: string, sourceId: string) => ({ value: url, sourceIds: [sourceId] as [string] });

export const producers: Producer[] = [
  producer({
    id: "chateau-montelena",
    name: "Chateau Montelena",
    countryId: "us",
    regionIds: ["napa-valley"],
    sourceIds: ["src-montelena-cs-2018"],
    officialWebsite: site("https://montelena.com", "src-montelena-cs-2018"),
    // "ESTABLISHED 1882" no cabeçalho das fichas técnicas
    foundedYear: { value: 1882, sourceIds: ["src-montelena-cs-2018"] },
    location: { value: { city: "Calistoga" }, sourceIds: ["src-montelena-cs-2018"] },
  }),
  producer({
    id: "gd-vajra",
    name: "G.D. Vajra",
    countryId: "it",
    regionIds: ["barolo"],
    sourceIds: ["src-vajra-albe-2021"],
    officialWebsite: site("https://www.gdvajra.it", "src-vajra-albe-2021"),
    location: { value: { city: "Barolo" }, sourceIds: ["src-vajra-albe-2021"] },
  }),
  producer({
    id: "chateau-palmer",
    name: "Château Palmer",
    countryId: "fr",
    regionIds: ["bordeaux"],
    sourceIds: ["src-palmer-wine-library"],
    officialWebsite: site("https://www.chateau-palmer.com", "src-palmer-wine-library"),
  }),
  producer({
    id: "louis-roederer",
    name: "Louis Roederer",
    countryId: "fr",
    regionIds: ["champagne"],
    sourceIds: ["src-roederer-collection-245"],
    officialWebsite: site("https://www.louis-roederer.com", "src-roederer-collection-245"),
  }),
  producer({
    id: "la-rioja-alta",
    name: "La Rioja Alta, S.A.",
    countryId: "es",
    regionIds: ["rioja", "rias-baixas"],
    sourceIds: ["src-riojalta-904", "src-riojalta-lagar-de-cervera"],
    officialWebsite: site("https://www.riojalta.com", "src-riojalta-904"),
  }),
  producer({
    id: "catena-zapata",
    name: "Bodega Catena Zapata",
    countryId: "ar",
    regionIds: ["mendoza"],
    sourceIds: ["src-catena-argentino-2021"],
    officialWebsite: site("https://catenazapata.com", "src-catena-argentino-2021"),
  }),
  producer({
    id: "miolo",
    name: "Miolo",
    countryId: "br",
    regionIds: ["vale-dos-vinhedos"],
    sourceIds: ["src-miolo-lote-43-pagina"],
    officialWebsite: site("https://institucional.miolo.com.br", "src-miolo-lote-43-pagina"),
    location: { value: { city: "Bento Gonçalves" }, sourceIds: ["src-miolo-lote-43-pagina"] },
    history: {
      text: "Segundo a própria vinícola, o patriarca Giuseppe Miolo chegou ao Brasil em 1897 e comprou um lote de terra conhecido como Lote 43, onde hoje fica a Vinícola Miolo, no Vale dos Vinhedos.",
      basedOnSourceIds: ["src-miolo-lote-43-pagina"],
      writtenAt: "2026-09-30",
    },
  }),
];
