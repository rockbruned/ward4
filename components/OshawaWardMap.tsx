"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/config";

const WARDS_URL =
  "https://map.oshawa.ca/arcgis/rest/services/Operational/OpenData/MapServer/11/query?where=1%3D1&outFields=WARDNUMBER&returnGeometry=true&outSR=4326&f=geojson";
const PARKS_URL =
  "https://map.oshawa.ca/arcgis/rest/services/Operational/OpenData/MapServer/9/query?where=1%3D1&outFields=FULLNAME,LOCATION&returnGeometry=true&outSR=4326&f=geojson";

const OSHAWA_CENTER: [number, number] = [43.8971, -78.8658];

export function OshawaWardMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let map: import("leaflet").Map | null = null;

    async function init() {
      if (!containerRef.current) return;

      try {
        const L = (await import("leaflet")).default;

        map = L.map(containerRef.current, {
          scrollWheelZoom: false,
          zoomControl: true,
        }).setView(OSHAWA_CENTER, 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const wardLayer = L.layerGroup().addTo(map);
        const parkLayer = L.layerGroup().addTo(map);

        const wardsResponse = await fetch(WARDS_URL);
        const wardsGeojson = await wardsResponse.json();

        L.geoJSON(wardsGeojson, {
          style: (feature) => {
            const ward = feature?.properties?.WARDNUMBER;
            const isTarget = ward === String(SITE.ward);
            return {
              color: isTarget ? "#1e4d7b" : "#64748b",
              weight: isTarget ? 4 : 2,
              fillColor: isTarget ? "#1e4d7b" : "#94a3b8",
              fillOpacity: isTarget ? 0.2 : 0.06,
            };
          },
          onEachFeature: (feature, layer) => {
            const ward = feature.properties.WARDNUMBER;
            layer.bindPopup(
              `<strong>Ward ${ward}</strong>${ward === String(SITE.ward) ? "<br/>Don Rockbrune is running here." : ""}`,
            );
          },
        }).addTo(wardLayer);

        const ward4 = wardsGeojson.features?.find(
          (feature: { properties: { WARDNUMBER: string } }) =>
            feature.properties.WARDNUMBER === String(SITE.ward),
        );
        if (ward4) {
          map.fitBounds(L.geoJSON(ward4).getBounds(), { padding: [40, 40], maxZoom: 13 });
        }

        try {
          const parksResponse = await fetch(PARKS_URL);
          const parksGeojson = await parksResponse.json();
          L.geoJSON(parksGeojson, {
            style: {
              color: "#2d5a3d",
              weight: 1,
              fillColor: "#2d5a3d",
              fillOpacity: 0.25,
            },
            onEachFeature: (feature, layer) => {
              const name = feature.properties?.FULLNAME ?? feature.properties?.LOCATION ?? "Park";
              layer.bindPopup(`<strong>${name}</strong>`);
            },
          }).addTo(parkLayer);
        } catch {
          // Parks are optional if the layer fails to load.
        }

        L.control
          .layers(
            {},
            {
              "Ward boundaries": wardLayer,
              Parks: parkLayer,
            },
            { collapsed: false },
          )
          .addTo(map);

        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    init();

    return () => {
      map?.remove();
    };
  }, []);

  if (status === "error") {
    return (
      <div className="flex h-[min(520px,70vh)] items-center justify-center rounded-xl bg-stone-100 px-6 text-center text-stone-700">
        Map could not load. Try{" "}
        <a
          href="https://www.oshawa.ca/getting-around/interactive-map/"
          className="link-accessible ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          mapOshawa
        </a>
        .
      </div>
    );
  }

  return (
    <div className="relative">
      {status === "loading" && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-stone-100 text-stone-600"
          role="status"
          aria-live="polite"
        >
          Loading map…
        </div>
      )}
      <div
        ref={containerRef}
        className="h-[min(520px,70vh)] w-full rounded-xl"
        role="region"
        aria-label={`Interactive map of Oshawa showing streets, Ward ${SITE.ward} boundary, and parks`}
        tabIndex={0}
      />
    </div>
  );
}
