import { NextResponse } from "next/server";
import { buildChatReply } from "@/lib/chat/answers";
import { containsHateOrAbuse } from "@/lib/chat/moderation";
import { sendChatNotification } from "@/lib/chat/notify";
import { HATE_REFUSAL_REPLY } from "@/lib/chat/policy";
import { checkRateLimit } from "@/lib/chat/rate-limit";

const MAX_MESSAGE_LENGTH = 1000;

type ChatRequest = {
  message?: string;
  name?: string;
  email?: string;
  referrer?: string;
};

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = body.message?.trim() ?? "";

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  if (!checkRateLimit(clientKey(request))) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  if (containsHateOrAbuse(message)) {
    return NextResponse.json(
      { error: HATE_REFUSAL_REPLY, reply: HATE_REFUSAL_REPLY, moderated: true },
      { status: 400 },
    );
  }

  const name = body.name?.trim() || undefined;
  const email = body.email?.trim() || undefined;
  const referrer =
    body.referrer?.trim() ||
    request.headers.get("referer") ||
    undefined;

  const timestamp = new Date().toISOString();
  const answer = buildChatReply(message, { name, email });

  const notification = await sendChatNotification({
    message,
    name,
    email,
    referrer,
    timestamp,
  });

  const isDev = process.env.NODE_ENV === "development";

  if (!notification.sent && isDev && notification.error === "email_not_configured") {
    return NextResponse.json({
      reply: answer,
      emailSent: false,
      devNote:
        "Email not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in .env to enable notifications.",
    });
  }

  return NextResponse.json({
    reply: answer,
    emailSent: notification.sent,
  });
}
