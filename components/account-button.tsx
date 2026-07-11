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
      className="inline-flex h-9 items-center gap-2 border border-[var(--line)] bg-white px-2.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--ink)] transition hover:border-[var(--ink)] hover:bg-[var(--cream)]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span className="hidden sm:inline">Account</span>
    </Link>
  );
}
