export const SITE = {
  candidateName: "Don Rockbrune",
  name: "Don Rockbrune for Ward 4",
  shortName: "Don Rockbrune",
  tagline: "People First. Evidence Always. Better Together.",
  movementHeadline: "Oshawa deserves better",
  movementSubtitle: "A Quality of Life Movement",
  city: "Oshawa",
  ward: 4,
  wardDescription:
    "Bounded on the north by Rossland Rd., on the east by Wilson Rd., on the west by Thickson Rd (city border), on the south by Olive Ave. and Gibb St.",
  office: "City Councillor",
  electionYear: 2026,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://donrockbrune.com",
  contactEmail: (process.env.CONTACT_EMAIL ?? "Oshawa@INsportify.com")
    .trim()
    .replace(/^mailto:/i, ""),
  headshot: "/images/don-rockbrune.png",
  bioPhoto: "/images/don-rockbrune-bio.png",
  creekCollage: [
    {
      src: "/images/creek-historic.webp",
      alt: "Historic winter view of Oshawa Creek and the surrounding community",
    },
    {
      src: "/images/creek-bridge.webp",
      alt: "Oshawa Creek flowing under a pedestrian bridge in autumn",
    },
    {
      src: "/images/creek-stream.webp",
      alt: "Oshawa Creek winding through green space in Ward 4",
    },
  ],
  heroBackground: "/images/oshawa-creek.webp",
  heroBackgroundSoft: "/images/oshawa-creek-soft.webp",
  whyRunning:
    "After exploring, for years, as a parent, taxpayer, volunteer and business person, Don feels it is time to step up and run for councillor of Ward 4 and steward the experiences into solutions.",
  visionStatement:
    "Oshawa needs to be more than blind growth. We need positive outcomes because of growth. City of Oshawa needs to be the biggest cheerleader for our citizens and businesses.",
} as const;

/** Site-wide feature toggles (UI only — API routes stay active). */
export const FEATURES = {
  /** "Talk to Don" floating chat widget */
  chatEnabled: false,
} as const;

export const COLORS = {
  lake: "#1e4d7b",
  forest: "#2d5a3d",
  warm: "#faf8f5",
} as const;
