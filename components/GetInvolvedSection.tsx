import Link from "next/link";
import { ContactQrCode } from "@/components/ContactQrCode";
import { SectionHeader } from "@/components/SectionHeader";
import { SITE } from "@/lib/config";

export function GetInvolvedSection() {
  return (
    <section className="section-wrap scroll-mt-20" aria-labelledby="volunteer-heading" id="volunteer">
      <SectionHeader
        id="volunteer-heading"
        eyebrow="Get involved"
        title={`Volunteer for ${SITE.candidateName}`}
        description={`Help elect Don Rockbrune as Ward ${SITE.ward} City Councillor in ${SITE.electionYear}. Lawn signs, canvassing, events — or stay in the loop.`}
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <article className="card-accent card-interactive">
          <h2 className="font-serif text-2xl font-bold text-lake-900">Join the campaign</h2>
          <p className="mt-4 leading-relaxed text-stone-700">
            Every conversation matters. Reach out and tell us how you&apos;d like to help build a
            better Oshawa.
          </p>
          <div className="mt-6 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <a href={`mailto:${SITE.contactEmail}`} className="btn-primary focus-ring inline-flex">
              Email {SITE.contactEmail}
            </a>
            <ContactQrCode size={160} className="sm:ml-auto" />
          </div>
        </article>

        <article className="card-interactive">
          <h2 className="font-serif text-2xl font-bold text-lake-900">Read the platform</h2>
          <p className="mt-4 leading-relaxed text-stone-700">
            See all ten priorities for transparency, modernization, community, and stewardship.
          </p>
          <Link href="/#priorities" className="btn-secondary mt-6 focus-ring inline-flex">
            View priorities
          </Link>
        </article>
      </div>
    </section>
  );
}
