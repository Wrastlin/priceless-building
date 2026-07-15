import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutCustomerAction } from "@/lib/actions/auth";
import { CustomerAuth } from "./customer-auth";

export const metadata = {
  title: "My account · Price-Less Building",
  description: "Sign in to your Price-Less Building customer account.",
  robots: { index: false, follow: false },
};

/**
 * Customer account area. Shows a sign-in / sign-up card when signed out,
 * and a simple account dashboard when signed in.
 *
 * This is the CUSTOMER gate, distinct from the staff /login + /admin.
 * Any signed-in Supabase user is a customer here; admin access is still
 * gated separately by the email allowlist.
 */
export default async function AccountPage() {
  let email: string | undefined;
  let name: string | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;
    email = claims?.email as string | undefined;
    name =
      (claims?.user_metadata as { full_name?: string; name?: string } | undefined)?.full_name ??
      (claims?.user_metadata as { name?: string } | undefined)?.name;
  } catch {
    // Auth not configured / not signed in — fall through to the sign-in card.
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[var(--brand-gold-deep)]">
        Price-Less Building · Customer account
      </div>

      {email ? (
        <section className="mt-6">
          <h1 className="font-display text-4xl">Welcome back{name ? `, ${name.split(" ")[0]}` : ""}.</h1>
          <p className="mt-3 text-[var(--muted-foreground)]">Signed in as {email}.</p>

          <div className="mt-8 grid gap-3">
            <AccountTile href="/shop" title="Keep shopping" desc="Browse doors, windows, cabinets, and more." />
            <AccountTile href="/track" title="Track an order" desc="See the status of a pickup or delivery." />
            <div className="rounded-md border border-dashed border-[var(--border)] p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-semibold">Payment methods</div>
                <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--brand-gold-deep)]">
                  Coming soon
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Securely save a card for faster checkout. Card details will be
                handled by our payment provider, never stored by Price-Less.
              </p>
            </div>
            <div className="rounded-md border border-dashed border-[var(--border)] p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-semibold">Order history</div>
                <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--brand-gold-deep)]">
                  Coming soon
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Past pickups and deliveries in one place. For now, call the floor
                with your order number.
              </p>
            </div>
          </div>

          <form action={signOutCustomerAction} className="mt-8">
            <button
              type="submit"
              className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] underline underline-offset-4 hover:text-[var(--foreground)]"
            >
              Sign out
            </button>
          </form>
        </section>
      ) : (
        <section className="mt-6">
          <h1 className="font-display text-4xl">
            Your <span className="text-[var(--brand-priceless)]">account.</span>
          </h1>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Create an account to save your details and track orders once online
            checkout is live. We use a secure provider for sign-in, so we never
            see your password.
          </p>
          <div className="mt-4 border border-dashed border-[var(--border)] bg-[var(--cream)] px-4 py-3">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--brand-gold-deep)]">
              Coming soon
            </p>
            <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
              Saved payment methods, order history, and one-tap checkout.
            </p>
          </div>
          <div className="mt-6">
            <CustomerAuth />
          </div>
          <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
            Price-Less staff? <Link href="/login" className="underline underline-offset-2">Employee sign in</Link>.
          </p>
        </section>
      )}
    </main>
  );
}

function AccountTile({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="rounded-md border border-[var(--border)] p-4 transition hover:border-[var(--brand-priceless)]"
    >
      <div className="font-semibold">{title}</div>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{desc}</p>
    </Link>
  );
}
