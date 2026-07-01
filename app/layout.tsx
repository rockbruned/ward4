import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { CampaignChat } from "@/components/CampaignChat";
import { ContactFloatingButton } from "@/components/ContactFloatingButton";
import { MailtoIframeBreakout } from "@/components/MailtoIframeBreakout";
import { SkipLink } from "@/components/SkipLink";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { FEATURES, SITE } from "@/lib/config";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.candidateName} for Ward 4 — ${SITE.city}`,
    template: `%s — ${SITE.candidateName}`,
  },
  description: `${SITE.movementHeadline} — ${SITE.candidateName} for Oshawa Ward ${SITE.ward}. ${SITE.tagline}`,
};

export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body className={`${playfair.variable} ${sourceSans.variable} font-sans antialiased`}>
        <MailtoIframeBreakout />
        <Analytics />
        <SkipLink />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        {FEATURES.chatEnabled ? <CampaignChat /> : <ContactFloatingButton />}
      </body>
    </html>
  );
}
