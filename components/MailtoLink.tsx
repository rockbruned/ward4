"use client";

import type { ComponentProps, MouseEvent } from "react";
import { getContactMailtoHref } from "@/lib/contact";

type MailtoLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href?: string;
};

/**
 * mailto anchor that also breaks out of embedded previews (IDE browser, iframes)
 * so the OS default mail client can handle the protocol.
 */
export function MailtoLink({
  href = getContactMailtoHref(),
  onClick,
  target = "_top",
  rel,
  ...props
}: MailtoLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    if (typeof window !== "undefined" && window.top && window.top !== window) {
      event.preventDefault();
      window.top.location.href = href;
    }
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      onClick={handleClick}
      {...props}
    />
  );
}
