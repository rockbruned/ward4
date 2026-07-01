import Link from "next/link";
import { CandidateHeadshot } from "@/components/CandidateHeadshot";
import { ContactQrCode } from "@/components/ContactQrCode";
import { MailtoLink } from "@/components/MailtoLink";
import { PrimaryNav } from "@/components/PrimaryNav";
import { footerNavLinks } from "@/lib/nav-links";
import { SITE } from "@/lib/config";

export function SiteHeader() {  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-warm-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/#home" className="focus-ring group flex min-w-0 items-center gap-3 rounded-xl">
          <CandidateHeadshot size="compact" className="hidden transition group-hover:scale-105 sm:block" />
          <div className="min-w-0">
            <p className="font-serif text-2xl font-bold leading-tight text-lake-900 transition group-hover:text-lake-700 sm:text-3xl">
              {SITE.candidateName}
            </p>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-forest-700 sm:text-base">
              Ward {SITE.ward} · {SITE.city} · {SITE.electionYear}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/#home"
            className="focus-ring hidden shrink-0 rounded-lg border-l-2 border-accent px-2 py-1 sm:block"
          >
            <span className="block text-[0.6rem] font-bold uppercase leading-none tracking-[0.28em] text-forest-700 sm:text-[0.65rem]">
              Vote for
            </span>
            <span className="mt-0.5 block font-serif text-base font-bold uppercase leading-none tracking-wide text-lake-900 lg:text-lg">
              Better
            </span>
          </Link>
          <PrimaryNav />
        </div>
      </div>
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="border-t border-lake-800 bg-lake-950 text-warm-white">
      <div className="section-wrap !py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-serif text-2xl font-bold">{SITE.candidateName}</p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-accent-light">
              Ward {SITE.ward} City Councillor · {SITE.electionYear}
            </p>
            <p className="mt-4 max-w-md text-warm-cream/90">{SITE.tagline}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-warm-cream/70">Explore</p>
            <ul className="mt-4 space-y-2">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-accessible text-warm-cream decoration-warm-cream/30 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-warm-cream/80 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/#home" className="focus-ring shrink-0 rounded-lg border-l-2 border-accent-light pl-3">
              <span className="block text-[0.6rem] font-bold uppercase leading-none tracking-[0.28em] text-accent-light">
                Vote for
              </span>
              <span className="mt-0.5 block font-serif text-sm font-bold uppercase leading-none tracking-wide text-warm-white sm:text-base">
                Better
              </span>
            </Link>
            <p>
              Contact:{" "}
              <MailtoLink className="link-accessible text-warm-white">
                {SITE.contactEmail}
              </MailtoLink>
            </p>
          </div>
          <ContactQrCode size={120} variant="dark" showCaption={false} className="lg:text-right" />
          <p className="text-xs lg:max-w-[12rem] lg:text-right">
            Paid for by the Don Rockbrune Ward 4 campaign.
          </p>
        </div>
      </div>
    </footer>
  );
}