"use client";

import { useEffect } from "react";

/**
 * In embedded previews (IDE browser, iframes), mailto: links are blocked unless
 * navigation targets the top frame. Real browsers use native anchors with no handler.
 */
export function MailtoIframeBreakout() {
  useEffect(() => {
    if (window.self === window.top) return;

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.(
        'a[href^="mailto:"]',
      );
      if (!(anchor instanceof HTMLAnchorElement)) return;

      event.preventDefault();
      window.top!.location.href = anchor.href;
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
