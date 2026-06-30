const HATE_KEYWORDS = [
  "kill yourself",
  "kys",
  "go die",
  "piece of shit",
  "fuck you",
  "fuck off",
  "retard",
  "nigger",
  "nigga",
  "faggot",
  "fag",
  "tranny",
  "chink",
  "spic",
  "kike",
  "wetback",
  "raghead",
  "terrorist scum",
  "subhuman",
  "vermin",
] as const;

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function containsHateOrAbuse(message: string): boolean {
  const normalized = normalize(message);

  return HATE_KEYWORDS.some((term) => {
    if (term.includes(" ")) {
      return normalized.includes(term);
    }
    const pattern = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    return pattern.test(normalized);
  });
}
