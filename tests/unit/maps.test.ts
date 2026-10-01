import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { catalog } from "@/data/catalog";
import { boundsOf, openStreetMapUrl, REGION_ZOOM } from "@/lib/maps/map-points";
import { regionCitationIds } from "@/lib/places/citations";
import { createCatalogService } from "@/services/catalog-service";

// Fase 9 (ADR-033): pontos dos mapas, sempre com fonte
const service = () => createCatalogService(createLocalAdapter([catalog]));

describe("map-points", () => {
  it("link do OpenStreetMap aponta para o mesmo ponto", () => {
    expect(openStreetMapUrl({ lat: 44.6147, lng: 7.9394 })).toBe(
      `https://www.openstreetmap.org/?mlat=44.6147&mlon=7.9394#map=${REGION_ZOOM}/44.6147/7.9394`,
    );
  });

  it("enquadramento contém todos os pontos", () => {
    expect(
      boundsOf([
        { lat: -33.49, lng: -69.26 },
        { lat: -26.07, lng: -65.98 },
      ]),
    ).toEqual([
      [-33.49, -69.26],
      [-26.07, -65.98],
    ]);
  });
});

describe("pontos das regiões", () => {
  const sourceById = new Map(catalog.sources.map((source) => [source.id, source]));

  it("toda região tem ponto, com o lugar e uma fonte secundária que existe", () => {
    for (const region of catalog.regions) {
      expect(region.coordinates, region.id).toBeDefined();
      expect(region.coordinates!.value.place.length, region.id).toBeGreaterThan(1);
      for (const id of region.coordinates!.sourceIds) {
        expect(sourceById.get(id)?.reliability, `${region.id}: ${id}`).toBe("secondary");
      }
    }
  });

  it("a fonte do ponto entra na lista de fontes da região", () => {
    const barolo = catalog.regions.find((region) => region.id === "barolo")!;
    expect(regionCitationIds(barolo)).toContain("src-osm-barolo");
  });

  it("o país reúne os pontos das suas regiões, com as fontes deles", async () => {
    const data = await service().getCountryPage("argentina");
    expect(data!.mapPoints.map((point) => point.name)).toEqual(["Mendoza", "Valle de Cafayate"]);
    expect(data!.mapPoints[0]!.href).toBe("/regioes/mendoza");
    const sourceIds = data!.sources.map((source) => source.id);
    expect(sourceIds).toContain("src-commons-geo-mendoza");
    expect(sourceIds).toContain("src-osm-cafayate");
  });
});
