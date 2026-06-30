export const MOVEMENT = {
  headline: "Oshawa deserves better",
  subtitle: "A Quality of Life Movement",
  motto: "People First. Evidence Always. Better Together",
  intro: [
    "For too long, Oshawa has measured success by growth, reports, and ribbon cuttings.",
    "Residents measure success differently.",
  ],
  residentQuestions: [
    "Can I afford to live here?",
    "Do I feel safe walking my neighbourhood?",
    "Can my children thrive?",
    "Do I trust City Hall?",
  ],
  closing:
    "Our goal shouldn't simply be to build a bigger city. Our goal should be to build a better city — where every decision improves the quality of life of the people who call Oshawa home.",
} as const;

export type Priority = {
  number: number;
  title: string;
  summary: string;
  bullets?: readonly string[];
  metrics?: readonly string[];
};

export const PRIORITIES: readonly Priority[] = [
  {
    number: 1,
    title: "Put People First",
    summary:
      "Every decision should improve people's lives — not simply expand government or approve another project.",
    bullets: [
      "Housing",
      "Safety",
      "Recreation",
      "Transportation",
      "Arts",
      "Business",
      "Parks",
      "Mental health",
      "Community connection",
    ],
    metrics: ["A better quality of life."],
  },
  {
    number: 2,
    title: "Build Trust Through Transparency",
    summary: "Citizens shouldn't have to fight for information they've already paid for.",
    bullets: [
      "More open municipal data",
      "Fewer barriers to accessing public information",
      "Easy-to-understand budgets",
      "Public performance dashboards",
      "Clear reporting on where tax dollars go — and what residents receive in return",
    ],
    metrics: ["Transparency shouldn't be an exception. It should be the default."],
  },
  {
    number: 3,
    title: "Modernize City Hall",
    summary: "The technology already exists.",
    bullets: [
      "A modern, easy-to-use website",
      "One simple payment system across all departments",
      "Better online services",
      "A living digital map showing neighbourhood development, infrastructure, parks, recreation, emergency services, crime trends, and approved future projects",
    ],
    metrics: ["Residents deserve a city that works as efficiently as the people who pay for it."],
  },
  {
    number: 4,
    title: "Measure Results, Not Activity",
    summary: "Success isn't measured by meetings held or reports written. It's measured by outcomes.",
    bullets: [
      "Neighbourhood safety",
      "Housing affordability",
      "Recreation participation",
      "Youth opportunities",
      "Small business health",
      "Volunteer engagement",
      "Downtown vitality",
      "Community trust",
    ],
    metrics: ["If something isn't improving lives, we should have the courage to rethink it."],
  },
  {
    number: 5,
    title: "Rebuild Community",
    summary: "Strong cities are built on strong relationships.",
    bullets: [
      "Monthly rotating Town Halls in every ward",
      "Respectful face-to-face conversations",
      "Stronger neighbourhood associations",
      "More opportunities for residents to participate beyond social media",
    ],
    metrics: ["Communities grow stronger when neighbours know each other."],
  },
  {
    number: 6,
    title: "Strengthen Civic Awareness",
    summary: "An informed community is a stronger community.",
    bullets: [
      "Support credible local reporting",
      "Create opportunities for journalism students, local media, and community organizations",
      "Help residents understand what's happening in their city",
    ],
    metrics: [
      "Democracy works best when information is accessible, factual, and easy to understand.",
    ],
  },
  {
    number: 7,
    title: "Celebrate Our Identity",
    summary:
      "Arts, culture, history, recreation, and local businesses aren't extras. They're part of what makes Oshawa worth calling home.",
    bullets: [
      "Reduce duplication and better preserve our history",
      "Support our artists",
      "Strengthen recreation",
      "Create an environment where local businesses and community organizations can succeed",
    ],
    metrics: ["Civic pride grows when people see themselves reflected in their city."],
  },
  {
    number: 8,
    title: "Demand Better Value",
    summary: "Every public dollar should deliver measurable value.",
    bullets: [
      "Organizations receiving public support should demonstrate meaningful outcomes for residents",
      "Innovation should be encouraged",
      "Legacy alone shouldn't determine future investment",
    ],
    metrics: ["The goal isn't to spend more. The goal is to achieve better results."],
  },
  {
    number: 9,
    title: "Welcome New Voices",
    summary: "Healthy democracies welcome new perspectives.",
    bullets: [
      "Encourage more independent candidates",
      "Reduce unnecessary barriers to civic participation",
      "Foster respectful debate focused on solutions rather than political labels",
    ],
    metrics: ["The best ideas can come from anyone."],
  },
  {
    number: 10,
    title: "Lead with Stewardship",
    summary: "Municipal leadership is about stewardship.",
    bullets: [
      "A steward listens before speaking",
      "Measures before assuming",
      "Plans beyond the next election",
      "Protects what works",
      "Improves what doesn't",
      "Leaves the community stronger than they found it",
    ],
    metrics: ["That is the standard I will hold myself to."],
  },
];

export const PROMISE = {
  title: "My Promise is dignity for all",
  intro: "I won't promise perfection.",
  commitments: [
    "Openness",
    "Evidence",
    "Innovation",
    "Respect",
    "Empathy",
    "Accountability",
    "The willingness to challenge outdated thinking when better ideas exist",
  ],
  closingQuestion:
    "Because every policy, every budget, and every decision should answer one question: Did it improve the quality of life of the people of Oshawa?",
} as const;
