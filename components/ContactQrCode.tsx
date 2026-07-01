import QRCode from "qrcode";
import { MailtoLink } from "@/components/MailtoLink";
import { getContactMailtoHref } from "@/lib/contact";
import { SITE } from "@/lib/config";

type ContactQrCodeProps = {
  size?: number;
  className?: string;
  showCaption?: boolean;
  variant?: "light" | "dark";
};

export async function ContactQrCode({
  size = 180,
  className = "",
  showCaption = true,
  variant = "light",
}: ContactQrCodeProps) {
  const mailto = getContactMailtoHref();
  const isDark = variant === "dark";
  const svg = await QRCode.toString(mailto, {
    type: "svg",
    margin: 1,
    width: size,
    color: {
      dark: isDark ? "#ffffff" : "#1a2e3b",
      light: isDark ? "#1e4d7b" : "#ffffff",
    },
  });

  const emailLabel = `Email ${SITE.contactEmail}`;

  return (
    <figure className={`text-center ${className}`}>
      <MailtoLink
        href={mailto}
        aria-label={emailLabel}
        className="focus-ring mx-auto inline-block rounded-xl transition hover:opacity-90"
      >
        <div
          className={`pointer-events-none rounded-xl border p-2 shadow-sm sm:p-3 ${
            isDark ? "border-white/20 bg-lake-900/60" : "border-stone-200 bg-white"
          }`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </MailtoLink>
      {showCaption && (
        <figcaption className={`mt-3 text-sm ${isDark ? "text-warm-cream/80" : "text-stone-600"}`}>
          Scan to email{" "}
          <MailtoLink
            href={mailto}
            className={
              isDark
                ? "link-accessible font-semibold text-warm-white"
                : "link-accessible font-semibold"
            }
          >
            {SITE.contactEmail}
          </MailtoLink>
        </figcaption>
      )}
    </figure>
  );
}
