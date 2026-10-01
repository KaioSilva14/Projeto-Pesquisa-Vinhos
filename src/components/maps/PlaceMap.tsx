"use client";

// Client Component: o Leaflet só funciona no navegador (usa window e document).

import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { MapPinIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { boundsOf, REGION_ZOOM, type MapPoint } from "@/lib/maps/map-points";

/** Mapa padrão do OpenStreetMap, sem chave (política de uso: atribuição visível; ADR-033). */
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">colaboradores do OpenStreetMap</a>';

/** Cor da marca no marcador (--color-accent em cada tema). */
const MARKER = { light: "#6b1d2f", dark: "#db909f" };

type PlaceMapProps = {
  points: readonly MapPoint[];
  /** Descrição do mapa para leitores de tela. */
  label: string;
  className?: string;
};

type Status = "idle" | "loading" | "ready" | "failed";

/** Elemento com o texto como conteúdo (nunca interpretado como HTML). */
function textElement(text: string): HTMLElement {
  const element = document.createElement("span");
  element.textContent = text;
  return element;
}

/**
 * Mapa real (Leaflet + OpenStreetMap), carregado só quando a pessoa pede (ADR-033): nenhuma
 * imagem de mapa atrasa a página, e o navegador só contata o OpenStreetMap com o clique.
 */
export function PlaceMap({ points, label, className }: PlaceMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  /** A pessoa pediu o mapa: só então o Leaflet é baixado e montado (uma vez). */
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!requested || !element || points.length === 0) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    async function mount(target: HTMLDivElement) {
      const L = (await import("leaflet")).default;
      if (cancelled) return;
      const dark = window.matchMedia("(prefers-color-scheme: dark)");
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const map = L.map(target, {
        zoomControl: false,
        // A roda do mouse rola a página, não o mapa; no toque, um dedo também rola a página
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        zoomAnimation: !calm,
        fadeAnimation: !calm,
        markerZoomAnimation: !calm,
      });
      L.control.zoom({ zoomInTitle: "Aproximar", zoomOutTitle: "Afastar" }).addTo(map);
      map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');

      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
      const markers = points.map((point) =>
        L.circleMarker([point.lat, point.lng], {
          radius: 9,
          weight: 3,
          color: "#ffffff",
          fillColor: dark.matches ? MARKER.dark : MARKER.light,
          fillOpacity: 1,
        })
          // Texto puro: o Leaflet trataria uma string como HTML (proteção contra XSS)
          .bindTooltip(textElement(point.name), { direction: "top", offset: [0, -8] })
          .addTo(map),
      );

      if (points.length === 1) {
        const [point] = points;
        if (point) map.setView([point.lat, point.lng], REGION_ZOOM);
      } else {
        map.fitBounds(boundsOf(points), { padding: [40, 40], maxZoom: REGION_ZOOM });
      }
      // Nos mapas de país, clicar no marcador abre a página da região
      points.forEach((point, index) => {
        if (point.href) markers[index]?.on("click", () => window.location.assign(point.href!));
      });

      // O marcador acompanha a troca de tema claro/escuro (o mapa troca pelo filtro de CSS)
      const onTheme = () => {
        for (const marker of markers)
          marker.setStyle({ fillColor: dark.matches ? MARKER.dark : MARKER.light });
      };
      dark.addEventListener("change", onTheme);
      target.setAttribute("aria-label", label);
      target.setAttribute("aria-roledescription", "mapa");
      setStatus("ready");
      // O botão sumiu: o foco vai para o mapa (setas movem, + e − aproximam)
      target.focus();
      cleanup = () => {
        dark.removeEventListener("change", onTheme);
        map.remove();
      };
    }

    mount(element).catch(() => {
      if (!cancelled) setStatus("failed");
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [requested, points, label]);

  return (
    // isolate: os z-index altos do Leaflet (controles) não passam por cima do cabeçalho fixo
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-media bg-sunken",
        // Mapa do OSM mais sóbrio, como o resto do site; no tema escuro, invertido para tons escuros
        "[&_.leaflet-tile-pane]:[filter:grayscale(0.6)_contrast(0.95)]",
        "dark:[&_.leaflet-tile-pane]:[filter:invert(1)_hue-rotate(180deg)_grayscale(0.6)_brightness(0.85)_contrast(0.9)]",
        className,
      )}
    >
      {/* Altura reservada: nada "pula" quando o mapa aparece */}
      <div ref={container} className="aspect-[4/3] w-full sm:aspect-[16/9]" />
      {status === "idle" && (
        <div className="absolute inset-0 grid place-content-center justify-items-center gap-3 p-6 text-center">
          <MapPinIcon aria-hidden weight="light" className="size-10 text-text-subtle" />
          <Button
            variant="secondary"
            onClick={() => {
              setRequested(true);
              setStatus("loading");
            }}
          >
            Mostrar o mapa
          </Button>
          <p className="max-w-xs text-small text-text-subtle">
            Carrega imagens do OpenStreetMap (veja a política de privacidade).
          </p>
        </div>
      )}
      {status === "loading" && (
        <p
          role="status"
          className="absolute inset-0 grid place-items-center text-small text-text-muted"
        >
          Carregando o mapa…
        </p>
      )}
      {status === "failed" && (
        <p
          role="status"
          className="absolute inset-0 grid place-items-center p-6 text-center text-small text-text-muted"
        >
          Não foi possível carregar o mapa. Verifique a conexão; a localização continua descrita
          abaixo.
        </p>
      )}
    </div>
  );
}
