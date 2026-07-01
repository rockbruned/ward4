import { SITE } from "@/lib/config";

/** Normalize CONTACT_EMAIL / SITE.contactEmail for mailto links and QR payloads. */
export function getContactMailtoHref(email: string = SITE.contactEmail): string {
  const normalized = email.trim().replace(/^mailto:/i, "");
  return `mailto:${normalized}`;
}
