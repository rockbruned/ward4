import Image from "next/image";
import { SITE } from "@/lib/config";

type CreekCollageProps = {
  className?: string;
  showCaption?: boolean;
  priority?: boolean;
};

export function CreekCollage({
  className = "",
  showCaption = false,
  priority = false,
}: CreekCollageProps) {
  return (
    <figure className={`hero-creek-frame creek-collage relative ${className}`}>
      <div className="creek-collage-row">
        {SITE.creekCollage.map((image, index) => (
          <div key={image.src} className="creek-collage-cell relative overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority && index === 0}
              quality={95}
              unoptimized
              sizes="(max-width: 640px) 18vw, (max-width: 1024px) 22vw, 320px"
              className={`hero-scenery object-cover ${index === 0 ? "creek-photo-historic" : ""}`}
            />
          </div>
        ))}
      </div>

      {showCaption && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-lake-950/90 to-transparent p-2 sm:p-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-accent-light sm:text-xs">
            Ward {SITE.ward}
          </p>
          <p className="mt-0.5 font-serif text-xs text-warm-white sm:text-sm">
            Community rooted in Oshawa
          </p>
        </div>
      )}

      <figcaption className="sr-only">
        Collage of Oshawa Creek through the seasons and generations in Ward {SITE.ward}
      </figcaption>
    </figure>
  );
}
