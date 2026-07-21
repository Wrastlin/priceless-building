"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

type Turn = { role: "user" | "assistant"; content: string; at: string };

/**
 * Chat-to-adjust AI catalog copy — same idea as messaging Cursor.
 */
export function ItemAiChat({
  sku,
  initialThread,
  description,
}: {
  sku: string;
  initialThread?: Turn[];
  description?: string;
}) {
  const router = useRouter();
  const [thread, setThread] = useState<Turn[]>(initialThread ?? []);
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = message.trim();
    if (!text || pending) return;
    const optimistic: Turn = { role: "user", content: text, at: new Date().toISOString() };
    setThread((t) => [...t, optimistic]);
    setMessage("");
    start(async () => {
      try {
        const res = await fetch(`/api/admin/items/${encodeURIComponent(sku)}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Chat failed");
        setThread((t) => [
          ...t,
          { role: "assistant", content: String(json.reply ?? "Done."), at: new Date().toISOString() },
        ]);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Chat failed");
      }
    });
  }

  return (
    <div className="space-y-3">
      {description ? (
        <div className="rounded-[12px] bg-[var(--surface)] px-3 py-2.5 text-[14px] leading-relaxed">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Description
          </p>
          <p>{description}</p>
        </div>
      ) : (
        <p className="text-[13px] text-[var(--muted-foreground)]">
          No description yet — it fills in after save, or ask below.
        </p>
      )}

      {thread.length > 0 ? (
        <ul className="max-h-56 space-y-2 overflow-y-auto rounded-[12px] border border-[var(--border)] p-3">
          {thread.map((t, i) => (
            <li
              key={`${t.at}-${i}`}
              className={
                "rounded-lg px-2.5 py-2 text-[13px] " +
                (t.role === "user" ? "bg-[var(--brand-navy)]/10 ml-4" : "bg-[var(--surface)] mr-4")
              }
            >
              <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                {t.role === "user" ? "You" : "AI"}
              </span>
              {t.content}
            </li>
          ))}
        </ul>
      ) : null}

      <form onSubmit={send} className="flex gap-2">
        <input
          className="inv-input flex-1 text-[15px]"
          placeholder='e.g. “wrong color — use the tag photo”'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={pending}
        />
        <button type="submit" className="inv-btn inv-btn-primary px-3" disabled={pending || !message.trim()}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
      <p className="text-[11px] text-[var(--muted-foreground)]">
        Tell the AI what to fix. It updates title, description, measurements, or category.
      </p>
    </div>
  );
}
