import Image from "next/image";
import { SITE } from "@/lib/config";

type CandidateHeadshotProps = {
  size?: "hero" | "corner" | "compact";
  variant?: "nav" | "bio";
  className?: string;
  priority?: boolean;
};

export function CandidateHeadshot({
  size = "hero",
  variant = "nav",
  className = "",
  priority = false,
}: CandidateHeadshotProps) {
  const src = variant === "bio" ? SITE.bioPhoto : SITE.headshot;
  const photoClass = variant === "bio" ? "headshot-photo-bio" : "headshot-photo";
  const dimensions =
    size === "hero"
      ? "h-64 w-64 sm:h-80 sm:w-80 lg:h-[22rem] lg:w-[22rem]"
      : size === "corner"
        ? "h-32 w-32 sm:h-60 sm:w-60 lg:h-72 lg:w-72"
        : "h-20 w-20 sm:h-24 sm:w-24";

  const sizes =
    size === "hero"
      ? "(max-width: 1024px) 320px, 352px"
      : size === "corner"
        ? "(max-width: 640px) 128px, (max-width: 1024px) 240px, 288px"
        : "96px";

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className={`absolute inset-2 rounded-full bg-accent/25 blur-2xl ${dimensions}`}
        aria-hidden="true"
      />
      <div
        className={`relative overflow-hidden rounded-full ring-4 ring-white/50 shadow-panel ${dimensions}`}
      >
        <Image
          src={src}
          alt={`Portrait of ${SITE.candidateName}, candidate for Oshawa Ward ${SITE.ward} ${SITE.office}`}
          fill
          priority={priority}
          sizes={sizes}
          className={`${photoClass} object-cover`}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lake-950/50 via-transparent to-white/10"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
