import { SectionHeader } from "@/components/SectionHeader";

export function GratitudeSection() {
  return (
    <section
      id="gratitude"
      className="scroll-mt-20 bg-section-glow bg-warm-cream"
      aria-labelledby="gratitude-heading"
    >
      <div className="section-wrap">
        <SectionHeader
          id="gratitude-heading"
          eyebrow="Gratitude"
          title="Land Acknowledgment"
          description="We honour the land and the people who make this community strong."
        />

        <div className="mt-10 max-w-3xl space-y-5 m-text-lg text-lg leading-relaxed text-stone-700">
          <p>
            We acknowledge that Oshawa sits on the traditional territory of the Mississaugas of
            Scugog Island First Nation, within the Williams Treaties (1923). We honour the enduring
            presence of Indigenous peoples on this land and their stewardship long before this city
            was built.
          </p>
          <p>
            We are also grateful to the volunteers, neighbours, and community members who give their
            time and voice to this campaign — and to everyone working to build a better Oshawa
            together.
          </p>
        </div>
      </div>
    </section>
  );
}
