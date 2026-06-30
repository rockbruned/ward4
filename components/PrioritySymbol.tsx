import type { ReactNode } from "react";

type PrioritySymbolProps = {
  number: number;
  className?: string;
};

const stroke = "currentColor";
const sw = 1.75;

function SymbolSvg({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className="h-full w-full"
    >
      {children}
    </svg>
  );
}

const SYMBOLS: Record<number, ReactNode> = {
  1: (
    <SymbolSvg label="People first">
      <circle cx="32" cy="22" r="7" stroke={stroke} strokeWidth={sw} />
      <path d="M18 48c2-9 8-13 14-13s12 4 14 13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="48" cy="26" r="5" stroke={stroke} strokeWidth={sw} />
      <path d="M42 48c1.5-6 5-9 9-9" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="16" cy="26" r="5" stroke={stroke} strokeWidth={sw} />
      <path d="M13 48c1.5-6 5-9 9-9" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </SymbolSvg>
  ),
  2: (
    <SymbolSvg label="Transparency">
      <circle cx="28" cy="28" r="14" stroke={stroke} strokeWidth={sw} />
      <path d="M38 38l12 12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M22 28h12M28 22v12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="28" cy="28" r="4" stroke={stroke} strokeWidth={sw} />
    </SymbolSvg>
  ),
  3: (
    <SymbolSvg label="Modernize City Hall — digital services">
      <rect x="14" y="22" width="36" height="30" rx="2" stroke={stroke} strokeWidth={sw} />
      <path d="M22 22V16h20v6" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <rect x="24" y="28" width="16" height="12" rx="1" stroke={stroke} strokeWidth={sw} />
      <path d="M28 32h8M28 36h5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M20 52h24" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="48" cy="18" r="3" stroke={stroke} strokeWidth={sw} />
      <path d="M48 21v4M48 15v2M54 18h-2M42 18h-2M52 14l-1.5 1.5M44 14l1.5 1.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </SymbolSvg>
  ),
  4: (
    <SymbolSvg label="Measure results">
      <path d="M14 48V22" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M14 48h36" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <rect x="20" y="34" width="8" height="14" rx="1" stroke={stroke} strokeWidth={sw} />
      <rect x="32" y="26" width="8" height="22" rx="1" stroke={stroke} strokeWidth={sw} />
      <rect x="44" y="18" width="8" height="30" rx="1" stroke={stroke} strokeWidth={sw} />
      <path d="M24 30l6-6 6 4 10-12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </SymbolSvg>
  ),
  5: (
    <SymbolSvg label="Rebuild community">
      <circle cx="20" cy="24" r="6" stroke={stroke} strokeWidth={sw} />
      <circle cx="44" cy="24" r="6" stroke={stroke} strokeWidth={sw} />
      <circle cx="32" cy="44" r="6" stroke={stroke} strokeWidth={sw} />
      <path d="M25 28l5 10M39 28l-5 10M26 24h12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </SymbolSvg>
  ),
  6: (
    <SymbolSvg label="Civic awareness">
      <rect x="16" y="18" width="32" height="28" rx="2" stroke={stroke} strokeWidth={sw} />
      <path d="M22 26h20M22 32h16M22 38h12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M48 30h8l4 6v10H48V30z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M50 42h4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </SymbolSvg>
  ),
  7: (
    <SymbolSvg label="Celebrate identity">
      <path d="M32 14l4 10h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M18 50c4-6 8-8 14-8s10 2 14 8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="20" cy="38" r="3" stroke={stroke} strokeWidth={sw} />
      <circle cx="44" cy="38" r="3" stroke={stroke} strokeWidth={sw} />
    </SymbolSvg>
  ),
  8: (
    <SymbolSvg label="Better value">
      <path d="M20 18h24" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M32 18v28" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M24 46h16" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M26 28h12M26 34h8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="44" cy="44" r="10" stroke={stroke} strokeWidth={sw} />
      <path d="M40 44l3 3 6-7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </SymbolSvg>
  ),
  9: (
    <SymbolSvg label="Welcome new voices">
      <path
        d="M18 28c0-6 5-10 10-10h8c5 0 10 4 10 10v2H18v-2z"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path d="M24 40v4M40 40v4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path
        d="M14 36c-4 1-6 4-6 8h8"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 36c4 1 6 4 6 8h-8"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SymbolSvg>
  ),
  10: (
    <SymbolSvg label="Stewardship">
      <circle cx="32" cy="32" r="18" stroke={stroke} strokeWidth={sw} />
      <path d="M32 14v4M32 46v4M14 32h4M46 32h4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M32 22l8 16H24l8-16z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <circle cx="32" cy="32" r="3" fill="currentColor" />
    </SymbolSvg>
  ),
};

const SYMBOL_COLORS: Record<number, string> = {
  1: "text-lake-700 bg-lake-50 border-lake-200",
  2: "text-forest-700 bg-forest-50 border-forest-200",
  3: "text-lake-800 bg-warm-cream border-lake-200",
  4: "text-forest-800 bg-warm-cream border-forest-200",
  5: "text-lake-700 bg-lake-50 border-lake-200",
  6: "text-forest-700 bg-forest-50 border-forest-200",
  7: "text-lake-800 bg-warm-cream border-lake-200",
  8: "text-forest-800 bg-warm-cream border-forest-200",
  9: "text-lake-700 bg-lake-50 border-lake-200",
  10: "text-forest-700 bg-forest-50 border-forest-200",
};

export function PrioritySymbol({ number, className = "" }: PrioritySymbolProps) {
  const symbol = SYMBOLS[number];
  const colors = SYMBOL_COLORS[number] ?? "text-lake-700 bg-lake-50 border-lake-200";

  if (!symbol) return null;

  return (
    <div
      className={`priority-symbol flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 p-3 shadow-sm sm:h-24 sm:w-24 lg:h-28 lg:w-28 ${colors} ${className}`}
      aria-hidden="true"
    >
      {symbol}
    </div>
  );
}
