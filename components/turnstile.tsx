"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile bot-protection widget for the customer account forms.
 *
 * This is a HOOK, not a hard dependency: it only renders when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. Without the key the component
 * renders nothing and `turnstileEnabled` is false, so sign-up / sign-in /
 * password-reset all work normally in local dev. To actually turn on
 * bot protection you ALSO have to enable CAPTCHA in the Supabase dashboard
 * (Auth → Settings → Bot & Abuse Protection → Turnstile) and paste the
 * matching SECRET key there — Supabase verifies the token server-side, so
 * the secret never touches the browser.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** True when a Turnstile site key is configured. */
export const turnstileEnabled = Boolean(SITE_KEY);

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
    },
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function Turnstile({ onToken }: { onToken: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  // Capture the latest callback in a ref so the render effect runs exactly
  // once (mount) instead of re-rendering the widget on every parent update.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
          theme: "light",
        });
      })
      .catch(() => onTokenRef.current(null));
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          // Widget already gone — nothing to clean up.
        }
      }
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className="mt-1" />;
}
