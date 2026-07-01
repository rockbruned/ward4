export const CHAT_POLICY = {
  hateSpeech:
    "This chat does not tolerate hate speech or negative or abusive commentary. Such messages may be ignored.",
  privacy:
    "Your name and email will not be published on this site. Messages are stored securely for campaign follow-up only.",
  identity:
    "To receive a personal response, please provide your name and email. Anonymous messages may be sent, but the campaign will not follow up without your contact details.",
} as const;

export const HATE_REFUSAL_REPLY =
  "We're not able to engage with hate speech or abusive comments. Please keep the conversation respectful. If you have a genuine question about the campaign, you're welcome to try again.";

export const ANONYMOUS_FOLLOWUP_REPLY =
  "Thanks for your message. Because we don't have your name and email, we can't provide a personal follow-up. Please share both if you'd like someone from Don's team to get back to you. Your contact information will not be published on this site.";

export const IDENTIFIED_FALLBACK_REPLY =
  "Thanks for your question — Don's team has been notified and will follow up with you.";

export function isIdentified(name?: string, email?: string): boolean {
  return Boolean(name?.trim() && email?.trim());
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
