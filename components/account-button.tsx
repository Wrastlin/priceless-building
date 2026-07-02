"use client";

import Link from "next/link";

/**
 * Customer account button. Sits next to the cart in the universal header
 * so creating an account / signing in is always one tap away — the same
 * weight and treatment as the cart, never buried in the footer.
 *
 * Links to /account, which shows the sign-in / create-account card when
 * signed out and the account dashboard when signed in. (Staff /login is
 * separate and lives in the footer.)
 */
export function AccountButton() {
  return (
    <Link
      href="/account"
      aria-label="Your account — sign in or create an account"
      className="inline-flex h-11 items-center gap-2.5 rounded-md border border-[var(--border)] bg-white px-3.5 text-base font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)]/30 hover:bg-[var(--muted)]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span className="hidden sm:inline">Account</span>
    </Link>
  );
}
