import { SITE } from "@/lib/config";
import { MOVEMENT, PRIORITIES, PROMISE } from "@/lib/data/platform";
import {
  ANONYMOUS_FOLLOWUP_REPLY,
  IDENTIFIED_FALLBACK_REPLY,
  isIdentified,
} from "@/lib/chat/policy";

const FALLBACK_REPLY = IDENTIFIED_FALLBACK_REPLY;

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function matchesAny(text: string, terms: readonly string[]): boolean {
  return terms.some((term) => text.includes(term));
}

export function getChatAnswer(message: string): string | null {
  const q = normalize(message);

  if (matchesAny(q, ["ward 4", "ward four", "boundar", "where is ward", "ward map", "neighbourhood"])) {
    return `Ward ${SITE.ward} in ${SITE.city} is ${SITE.wardDescription} You can also view the ward map on this site.`;
  }

  if (matchesAny(q, ["volunteer", "get involved", "lawn sign", "canvass", "help the campaign", "join"])) {
    return `We'd love your help! Volunteers can support lawn signs, canvassing, events, and more. Email ${SITE.contactEmail} or visit the Get Involved section on this site.`;
  }

  if (matchesAny(q, ["contact", "email", "reach", "phone", "get in touch"])) {
    return `You can reach Don's campaign at ${SITE.contactEmail}.`;
  }

  if (matchesAny(q, ["who is don", "about don", "tell me about don", "who's don"])) {
    return `${SITE.candidateName} is running for Ward ${SITE.ward} ${SITE.office} in ${SITE.city}. ${SITE.whyRunning}`;
  }

  if (matchesAny(q, ["why running", "why is don running", "why run"])) {
    return SITE.whyRunning;
  }

  if (matchesAny(q, ["vision", "why oshawa"])) {
    return SITE.visionStatement;
  }

  if (matchesAny(q, ["motto", "tagline", "slogan", "people first"])) {
    return `${SITE.tagline} — ${MOVEMENT.motto}.`;
  }

  if (matchesAny(q, ["election", "vote", "when is the election", "2026"])) {
    return `Don is running for Ward ${SITE.ward} ${SITE.office} in the ${SITE.electionYear} municipal election in ${SITE.city}.`;
  }

  if (matchesAny(q, ["platform", "priorit", "policy", "stand for", "issues"])) {
    const list = PRIORITIES.map((p) => `${p.number}. ${p.title}`).join("\n");
    return `Don's platform centres on quality of life for Oshawa residents. The ten priorities are:\n\n${list}\n\nVisit the Platform section on this site for full details.`;
  }

  if (matchesAny(q, ["promise", "commitment"])) {
    return `${PROMISE.title}: ${PROMISE.intro} Don commits to ${PROMISE.commitments.join(", ")}.`;
  }

  if (matchesAny(q, ["transparen", "trust", "open data"])) {
    const p = PRIORITIES[1];
    return `${p.title}: ${p.summary}`;
  }

  if (matchesAny(q, ["modernize", "city hall", "website", "digital"])) {
    const p = PRIORITIES[2];
    return `${p.title}: ${p.summary}`;
  }

  if (matchesAny(q, ["town hall", "community", "neighbour"])) {
    const p = PRIORITIES[4];
    return `${p.title}: ${p.summary}`;
  }

  for (const priority of PRIORITIES) {
    const titleWords = priority.title.toLowerCase().split(/\s+/);
    if (titleWords.some((word) => word.length > 4 && q.includes(word))) {
      return `${priority.title}: ${priority.summary}`;
    }
  }

  return null;
}

export function buildChatReply(
  message: string,
  identity: { name?: string; email?: string },
): string {
  const answer = getChatAnswer(message);
  if (answer) {
    return answer;
  }

  if (isIdentified(identity.name, identity.email)) {
    return IDENTIFIED_FALLBACK_REPLY;
  }

  return ANONYMOUS_FOLLOWUP_REPLY;
}

export { FALLBACK_REPLY };
