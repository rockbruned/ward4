import { GetInvolvedSection } from "@/components/GetInvolvedSection";
import { GratitudeSection } from "@/components/GratitudeSection";
import { Hero } from "@/components/HomeSections";
import {
  MovementIntro,
  PlatformPriorities,
  PlatformPromise,
} from "@/components/PlatformSections";
import { WardMap } from "@/components/WardMap";

export default function HomePage() {
  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <MovementIntro />
      <div id="priorities" className="scroll-mt-20">
        <PlatformPriorities />
        <PlatformPromise />
      </div>
      <div id="ward-4" className="scroll-mt-20">
        <WardMap />
      </div>
      <GetInvolvedSection />
      <GratitudeSection />
    </>
  );
}
