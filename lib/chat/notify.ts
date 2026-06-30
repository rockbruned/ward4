import { SITE } from "@/lib/config";

export type ChatNotification = {
  message: string;
  name?: string;
  email?: string;
  referrer?: string;
  timestamp: string;
};

function buildEmailBody(payload: ChatNotification): string {
  const identified = Boolean(payload.name && payload.email);
  const lines = [
    "A visitor submitted a question on the Ward 4 campaign site.",
    "",
    `Time: ${payload.timestamp}`,
    `Follow-up expected: ${identified ? "Yes (name and email provided)" : "No (anonymous — bot explained no personal response)"}`,
    `Message:\n${payload.message}`,
  ];

  if (payload.name) {
    lines.push("", `Name: ${payload.name}`);
  } else {
    lines.push("", "Name: (not provided)");
  }
  if (payload.email) {
    lines.push(`Email: ${payload.email}`);
  } else {
    lines.push("Email: (not provided)");
  }
  if (payload.referrer) {
    lines.push(`Page: ${payload.referrer}`);
  }

  return lines.join("\n");
}

export async function sendChatNotification(
  payload: ChatNotification,
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to =
    process.env.CHAT_NOTIFY_EMAIL?.trim() ||
    process.env.CONTACT_EMAIL?.trim() ||
    SITE.contactEmail;

  const body = buildEmailBody(payload);

  if (!apiKey || !from) {
    console.info("[chat] email not configured — message logged server-side:", {
      to,
      message: payload.message,
      name: payload.name,
      email: payload.email,
      referrer: payload.referrer,
      timestamp: payload.timestamp,
    });
    return { sent: false, error: "email_not_configured" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: "New question from Ward 4 campaign site",
      text: body,
    });

    if (error) {
      console.error("[chat] Resend error:", error);
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[chat] notification failed:", message);
    return { sent: false, error: message };
  }
}
