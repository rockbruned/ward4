type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  light?: boolean;
};

export function SectionHeader({ eyebrow, title, description, id, light = false }: SectionHeaderProps) {
  return (
    <div className="w-full max-w-none sm:max-w-3xl">
      <p
        className={`section-eyebrow ${light ? "text-warm-cream/80 before:bg-accent" : "text-forest-700"}`}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-3 font-serif m-text-3xl text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? "text-warm-white" : "text-lake-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 m-text-lg text-lg leading-relaxed ${light ? "text-warm-cream/90" : "text-stone-600"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
