import type { ComponentProps } from "react";
import { getContactMailtoHref } from "@/lib/contact";

type MailtoLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href?: string;
};

/** Native mailto anchor — iframe breakout is handled by MailtoIframeBreakout in layout. */
export function MailtoLink({
  href = getContactMailtoHref(),
  ...props
}: MailtoLinkProps) {
  return <a href={href} {...props} />;
}
