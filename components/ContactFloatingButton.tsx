import { MailtoLink } from "@/components/MailtoLink";
import { SITE } from "@/lib/config";

/** Floating contact pill — same position/style as CampaignChat when chat is off. */
export function ContactFloatingButton() {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <MailtoLink
        className="focus-ring flex min-h-[3.25rem] min-w-[9.5rem] items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-lake-700 to-lake-800 px-5 py-3.5 font-serif text-base font-bold text-white shadow-panel ring-2 ring-accent/40 transition hover:from-lake-600 hover:to-lake-700 hover:ring-accent/60 sm:min-h-[3.75rem] sm:min-w-[11rem] sm:gap-3 sm:px-6 sm:py-4 sm:text-lg"
        aria-label={`Email ${SITE.candidateName} at ${SITE.contactEmail}`}
      >
        <MailIcon />
        <span>Talk to Don</span>
      </MailtoLink>
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 sm:h-[1.375rem] sm:w-[1.375rem]"
    >
      <path
        d="M4 7.5 12 13l8-5.5M5 18h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
