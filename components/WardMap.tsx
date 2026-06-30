import dynamic from "next/dynamic";
import { SectionHeader } from "@/components/SectionHeader";
import { SITE } from "@/lib/config";

const OshawaWardMap = dynamic(
  () => import("@/components/OshawaWardMap").then((mod) => mod.OshawaWardMap),
  { ssr: false },
);

export function WardMap() {
  return (
    <section className="bg-warm-sand/40" aria-labelledby="ward-map-heading">
      <div className="section-wrap">
        <SectionHeader
          id="ward-map-heading"
          eyebrow="Ward 4"
          title="Oshawa ward map"
          description="Interactive map with streets, parks, and ward boundaries from City of Oshawa open data. Ward 4 is highlighted."
        />

        <div className="mt-10 overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-card">
          <OshawaWardMap />
          <p className="border-t border-stone-100 bg-lake-50/50 px-5 py-4 text-xs text-stone-600">
            Streets: OpenStreetMap · Wards &amp; parks:{" "}
            <a
              href="https://map.oshawa.ca/arcgis/rest/services/Operational/OpenData/MapServer"
              className="link-accessible"
              target="_blank"
              rel="noopener noreferrer"
            >
              City of Oshawa Open Data
            </a>
          </p>
        </div>

        <article className="card-accent mt-8">
          <h3 className="font-serif m-text-xl text-xl font-bold text-lake-900">Ward {SITE.ward} boundaries</h3>
          <p className="mt-3 m-text-base leading-relaxed text-stone-700">{SITE.wardDescription}</p>
        </article>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <a
            href="https://www.oshawa.ca/city-hall/elections/find-your-ward/"
            className="btn-secondary focus-ring"
            target="_blank"
            rel="noopener noreferrer"
          >
            Find your ward
          </a>
          <a
            href="https://www.oshawa.ca/getting-around/interactive-map/"
            className="btn-secondary focus-ring"
            target="_blank"
            rel="noopener noreferrer"
          >
            mapOshawa
          </a>
        </div>
      </div>
    </section>
  );
}
