import Link from "next/link";
import { PrioritySymbol } from "@/components/PrioritySymbol";
import { SectionHeader } from "@/components/SectionHeader";
import { MOVEMENT, PRIORITIES, PROMISE, type Priority } from "@/lib/data/platform";
import { SITE } from "@/lib/config";

function PriorityCard({ priority }: { priority: Priority }) {
  return (
    <article
      className="priority-card"
      aria-labelledby={`priority-${priority.number}`}
    >
      <div className="relative flex items-start justify-between gap-5 sm:gap-8">
        <div className="min-w-0 flex-1">
          <p className="inline-flex rounded-full bg-lake-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lake-800">
            Priority {priority.number}
          </p>
          <h2
            id={`priority-${priority.number}`}
            className="mt-3 font-serif m-text-2xl text-2xl font-bold tracking-tight text-lake-900 sm:text-3xl"
          >
            {priority.title}
          </h2>
          <p className="mt-4 m-text-base text-base leading-relaxed text-stone-700">{priority.summary}</p>
          {priority.bullets && (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {priority.bullets.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-stone-700 before:mt-1.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-accent"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
          {priority.metrics?.map((line) => (
            <p
              key={line}
              className="mt-6 rounded-xl border border-lake-100 bg-lake-50/60 px-4 py-3 font-semibold text-lake-900"
            >
              {line}
            </p>
          ))}
        </div>
        <PrioritySymbol number={priority.number} className="relative z-10 mt-1" />
      </div>
    </article>
  );
}

export function MovementIntro({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={
        compact
          ? "section-wrap !pb-0 !pt-14"
          : "relative overflow-hidden bg-section-glow bg-warm-cream"
      }
      aria-labelledby={compact ? "movement-heading-compact" : "movement-heading"}
    >
      <div className={compact ? "" : "section-wrap"}>
        <SectionHeader
          id={compact ? "movement-heading-compact" : "movement-heading"}
          eyebrow="The standard that guides every decision"
          title={MOVEMENT.subtitle}
          description={MOVEMENT.motto}
        />
        <p className="mt-3 font-serif m-text-2xl text-2xl font-bold text-lake-900 sm:text-3xl">
          Every policy should improve <span className="qol-highlight">quality of life</span> for
          Oshawa residents.
        </p>
        <h3 className="mt-6 font-serif m-text-2xl text-2xl font-bold text-lake-800 sm:text-3xl">
          {MOVEMENT.headline}
        </h3>

        <div className="mt-10 w-full max-w-none space-y-5 m-text-lg text-lg leading-relaxed text-stone-700 sm:max-w-3xl">
          {MOVEMENT.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {MOVEMENT.residentQuestions.map((question) => (
            <li key={question} className="question-card">
              {question}
            </li>
          ))}
        </ul>

        {!compact && (
          <p className="mt-10 w-full max-w-none border-l-2 border-accent pl-4 font-serif m-text-xl text-xl leading-relaxed text-lake-900 sm:max-w-3xl sm:pl-6">
            {MOVEMENT.closing}
          </p>
        )}
      </div>
    </section>
  );
}

export function PlatformPriorities({ limit }: { limit?: number }) {
  const items = limit ? PRIORITIES.slice(0, limit) : PRIORITIES;

  return (
    <section className="section-wrap" aria-labelledby="priorities-heading">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          id="priorities-heading"
          eyebrow="Platform"
          title="My Priorities"
          description={`${SITE.candidateName}'s plan for a better Oshawa — starting in Ward ${SITE.ward}.`}
        />
        {limit && (
          <Link href="/#priorities" className="btn-secondary focus-ring shrink-0 self-start sm:self-auto">
            Read full platform
          </Link>
        )}
      </div>
      <div className="mt-12 space-y-8">
        {items.map((priority) => (
          <PriorityCard key={priority.number} priority={priority} />
        ))}
      </div>
    </section>
  );
}

export function PlatformPromise() {
  return (
    <section
      className="relative overflow-hidden bg-lake-950 text-warm-white"
      aria-labelledby="promise-heading"
    >
      <div className="absolute inset-0 bg-hero-mesh opacity-60" aria-hidden="true" />
      <div className="section-wrap relative">
        <SectionHeader
          id="promise-heading"
          eyebrow="Commitment"
          title={PROMISE.title}
          description={PROMISE.intro}
          light
        />
        <p className="mt-8 font-semibold text-accent-light">I will promise:</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROMISE.commitments.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-relaxed text-warm-cream backdrop-blur-sm"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-3xl border-l-2 border-accent pl-6 font-serif text-xl leading-relaxed text-warm-white sm:text-2xl">
          {PROMISE.closingQuestion}
        </p>
      </div>
    </section>
  );
}

export function PlatformPageContent() {
  return (
    <>
      <MovementIntro compact />
      <PlatformPriorities />
      <PlatformPromise />
    </>
  );
}
