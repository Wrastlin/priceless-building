import { UpdatePasswordForm } from "./update-password-form";

export const metadata = {
  title: "Set a new password · Price-Less Building",
  robots: { index: false, follow: false },
};

/**
 * Password-reset landing page. The link in the reset email points at
 * /auth/callback?next=/account/update-password, which exchanges the code
 * for a short-lived recovery session and forwards here. The form then lets
 * the customer set a new password via Supabase. If there's no valid
 * recovery session (expired or reused link), the form says so.
 */
export default function UpdatePasswordPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
        Price-Less Building · Customer account
      </div>
      <h1 className="font-display mt-6 text-4xl">
        Set a new <span className="text-[var(--brand-priceless)]">password.</span>
      </h1>
      <p className="mt-3 text-[var(--muted-foreground)]">
        Choose a new password for your account. Your password is hashed and stored by our
        secure sign-in provider — Price-Less never sees it.
      </p>
      <div className="mt-6">
        <UpdatePasswordForm />
      </div>
    </main>
  );
}
