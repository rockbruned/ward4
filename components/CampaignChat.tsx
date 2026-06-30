"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { SITE } from "@/lib/config";
import { CHAT_POLICY } from "@/lib/chat/policy";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
};

const WELCOME =
  `Hi! I'm here to help with questions about ${SITE.candidateName}, Ward ${SITE.ward}, and the campaign.\n\n` +
  `• ${CHAT_POLICY.hateSpeech}\n` +
  `• ${CHAT_POLICY.privacy}\n` +
  `• ${CHAT_POLICY.identity}\n\n` +
  `What would you like to know?`;

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function CampaignChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "bot", text: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const panelId = useId();
  const titleId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      const timer = window.setTimeout(() => inputRef.current?.focus(), 100);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open, messages, scrollToBottom]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmed || sending) return;

    if (!trimmedName) {
      setError("Please enter your name so the campaign can respond to you.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email so the campaign can follow up.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setSending(true);
    setInput("");

    const userMessage: ChatMessage = { id: createId(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          name: trimmedName,
          email: trimmedEmail,
          referrer: typeof document !== "undefined" ? document.referrer || window.location.href : undefined,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        error?: string;
        moderated?: boolean;
      };

      if (!response.ok) {
        if (data.reply) {
          setMessages((prev) => [...prev, { id: createId(), role: "bot", text: data.reply! }]);
          return;
        }
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      const replyText = data.reply ?? "Thanks for your question — Don's team has been notified and will follow up.";
      setMessages((prev) => [...prev, { id: createId(), role: "bot", text: replyText }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send your message.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "bot",
          text: "Sorry, we couldn't send that right now. Please email us directly or try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-lake-200/80 bg-warm-white shadow-panel animate-fade-up sm:w-[24rem]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-lake-100 bg-gradient-to-r from-lake-800 to-lake-700 px-4 py-3 text-white">
            <div>
              <p id={titleId} className="font-serif text-lg font-bold leading-tight">
                Ask Don&apos;s team
              </p>
              <p className="text-xs text-lake-100/90">Ward {SITE.ward} · {SITE.city}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              className="focus-ring rounded-full p-2 text-white/90 transition hover:bg-white/15 hover:text-white"
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </header>

          <div
            className="flex max-h-[min(50vh,20rem)] flex-col gap-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-lake-700 text-white"
                      : "rounded-bl-md border border-stone-200/80 bg-white text-stone-800 shadow-sm"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
            {sending && (
              <p className="text-sm text-stone-500" aria-busy="true">
                Thinking…
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-stone-200/80 bg-white px-4 py-3">
            <div className="mb-3 grid gap-2">
              <p className="text-xs font-semibold text-lake-800">Your contact info (required for a response)</p>
              <label className="block">
                <span className="sr-only">Your name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (required)"
                  autoComplete="name"
                  required
                  maxLength={120}
                  className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="sr-only">Your email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (required)"
                  autoComplete="email"
                  required
                  maxLength={200}
                  className="focus-ring w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                />
              </label>
              <p className="text-[0.65rem] leading-snug text-stone-500">{CHAT_POLICY.privacy}</p>
            </div>

            {error && (
              <p className="mb-2 text-xs text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="flex items-end gap-2">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Your question</span>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleSubmit(e);
                    }
                  }}
                  placeholder="Ask about Don, Ward 4, volunteering…"
                  rows={2}
                  maxLength={1000}
                  disabled={sending}
                  className="focus-ring w-full resize-none rounded-xl border border-stone-200 px-3 py-2 text-sm leading-snug disabled:opacity-60"
                />
              </label>
              <button
                type="submit"
                disabled={sending || !input.trim() || !name.trim() || !email.trim()}
                className="focus-ring shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-lake-950 shadow-md transition hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-[0.65rem] leading-snug text-stone-500">
              {CHAT_POLICY.hateSpeech} Messages are sent to the campaign team.
            </p>
          </form>
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="focus-ring flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-lake-700 to-lake-800 text-white shadow-panel ring-2 ring-accent/40 transition hover:from-lake-600 hover:to-lake-700 hover:ring-accent/60 sm:h-16 sm:w-16"
        aria-label={open ? "Close campaign chat" : "Open campaign chat — ask Don's team a question"}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 8h10M7 12h6m-9 8 2.5-3H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
