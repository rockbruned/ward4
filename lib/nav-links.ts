export const headerNavLinks = [
  { href: "/#priorities", label: "Priorities" },
  { href: "/#ward-4", label: "Ward 4" },
  { href: "/#volunteer", label: "Volunteer" },
] as const;

export const footerNavLinks = [
  { href: "/#home", label: "Home" },
  ...headerNavLinks,
  { href: "/#gratitude", label: "Gratitude" },
] as const;
