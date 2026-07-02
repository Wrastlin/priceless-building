"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { type StoreNotice, upcomingNotices, noticeDateLabel } from "@/lib/announcements";

/**
 * The holiday-closures list, rendered as a client island so it drops itself
 * the moment a closure is over.
 *
 * Why client-side: the home page is statically prerendered, so a server-only
 * date filter would freeze at build time and keep a finished closure on the
 * page until the next deploy. `initial` is the server/build-time filtered list
 * (so the notice still appears in the static HTML and without JS); on mount we
 * re-run the same filter against the visitor's real clock, which removes any
 * closure whose last day has passed.
 */
export function ClosureNotices({ initial }: { initial: StoreNotice[] }) {
  const [notices, setNotices] = useState<StoreNotice[]>(initial);

  useEffect(() => {
    setNotices(upcomingNotices());
    // Re-check at the next local midnight so a page left open overnight drops
    // the closure on time too.
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    const t = setTimeout(() => setNotices(upcomingNotices()), nextMidnight.getTime() - now.getTime());
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
        {notices.length ? "Upcoming closures & holiday hours" : "Hours"}
      </div>

      {notices.length ? (
        <ul className="mt-4 divide-y divide-[var(--border)]">
          {notices.map((n) => (
            <li key={n.date} className="flex items-center gap-4 py-3">
              {n.image ? (
                <span className="relative block size-14 shrink-0 overflow-hidden rounded-md bg-[var(--muted)]">
                  <Image
                    src={n.image}
                    alt={n.imageAlt ?? `${n.title} — ${n.status}`}
                    fill
                    sizes="56px"
                    quality={70}
                    className="object-cover"
                  />
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[var(--foreground)]">{n.title}</div>
                <div className="text-sm text-[var(--muted-foreground)]">{noticeDateLabel(n)}</div>
              </div>
              <span
                className={
                  /closed/i.test(n.status)
                    ? "font-mono shrink-0 text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-priceless)]"
                    : "font-mono shrink-0 text-right text-xs uppercase tracking-[0.1em] text-[var(--foreground)]"
                }
              >
                {n.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-base leading-relaxed text-[var(--foreground)]">
          Open regular hours — no holiday closures scheduled. When a holiday changes our
          hours, it shows up here and on our Facebook page.
        </p>
      )}
    </>
  );
}
