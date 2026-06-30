"use client";

import Link from "next/link";
import { headerNavLinks } from "@/lib/nav-links";

export function PrimaryNav() {
  return (
    <nav aria-label="Primary" className="flex flex-wrap justify-end gap-1 sm:gap-2">
      {headerNavLinks.map((link) => (
        <Link key={link.href} href={link.href} className="nav-link focus-ring">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
