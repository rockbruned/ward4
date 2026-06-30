import Link from "next/link";
import { CandidateHeadshot } from "@/components/CandidateHeadshot";
import { CreekCollage } from "@/components/CreekCollage";
import { SITE } from "@/lib/config";

export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-lake-950 text-warm-white"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-hero-mesh" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-lake-900/40 via-lake-950/80 to-lake-950"
        aria-hidden="true"
      />
      <div
        className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-lake-600/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-16 bottom-32 h-64 w-64 rounded-full bg-forest-700/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="section-wrap relative z-10 !pb-8 !pt-14 lg:!pt-20">
        <div className="animate-fade-up w-full max-w-none sm:max-w-3xl lg:max-w-none">
          <p className="inline-flex rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 m-text-xs text-xs font-bold uppercase tracking-[0.2em] text-accent-light">
            Ward {SITE.ward} · {SITE.city} · {SITE.electionYear}
          </p>

          <div className="mt-5 flex items-start justify-between gap-4 sm:gap-6">
            <div className="min-w-0 w-full flex-1">
              <p className="qol-banner font-serif m-text-3xl text-3xl font-bold leading-none text-accent-light sm:text-4xl lg:text-5xl">
                {SITE.movementSubtitle}
              </p>
              <h1
                id="hero-heading"
                className="hero-text-contrast mt-1 font-serif m-text-3xl text-3xl font-bold leading-none tracking-tight text-warm-white sm:text-4xl lg:text-5xl"
              >
                {SITE.movementHeadline}
              </h1>
              <p className="mt-4 m-text-xl text-xl font-semibold text-accent-light sm:text-2xl">
                {SITE.candidateName} for {SITE.office} Ward {SITE.ward}
              </p>
              <p className="mt-3 w-full max-w-none text-base leading-relaxed text-warm-cream/90 m-text-base sm:max-w-xl sm:text-lg">
                {SITE.tagline}
              </p>
            </div>
            <CandidateHeadshot
              size="corner"
              variant="bio"
              priority
              className="shrink-0 shadow-glow"
            />
          </div>
        </div>
      </div>

      <div className="section-wrap relative z-10 !pt-4">
        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,36rem)_1fr] lg:gap-8">
          <CreekCollage
            className="order-1 h-28 w-full sm:h-32 lg:order-2 lg:h-full lg:min-h-[220px]"
            showCaption
            priority
          />

          <div className="hero-text-panel animate-fade-up order-2 min-w-0 w-full lg:order-1">
            <p className="m-text-lg text-lg leading-relaxed text-warm-cream/95">{SITE.whyRunning}</p>
            <blockquote className="mt-8 border-l-2 border-accent pl-4 sm:pl-6">
              <p className="font-serif m-text-xl text-xl leading-relaxed text-warm-white sm:text-2xl lg:text-[1.6rem] lg:leading-snug">
                {SITE.visionStatement}
              </p>
            </blockquote>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/#volunteer" className="btn-primary-on-dark focus-ring">
                Join the campaign
              </Link>
              <Link href="/#priorities" className="btn-secondary-on-dark focus-ring">
                Read the platform
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>  );
}
