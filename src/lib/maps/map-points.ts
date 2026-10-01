// Pontos dos mapas (fase 9, ADR-033). Sem Leaflet aqui: lógica pura, testável e leve.

export type MapPoint = {
  /** Nome da região (rótulo do marcador). */
  name: string;
  /** Página da região, nos mapas de país. */
  href?: string;
  lat: number;
  lng: number;
  /** Lugar que o ponto marca (ex.: "Radda in Chianti"). */
  place: string;
  sourceIds: readonly string[];
};

/** Aproximação ao abrir: vale (≈ 10 km ao redor) para uma região; país, para vários pontos. */
export const REGION_ZOOM = 9;

/** Link para o mesmo ponto no site do OpenStreetMap (alternativa ao mapa). */
export function openStreetMapUrl({ lat, lng }: Pick<MapPoint, "lat" | "lng">, zoom = REGION_ZOOM) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;
}

/** Retângulo que contém todos os pontos: [[sul, oeste], [norte, leste]]. */
export function boundsOf(points: readonly Pick<MapPoint, "lat" | "lng">[]) {
  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ] as [[number, number], [number, number]];
}
