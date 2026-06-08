import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in · Price-Less Building",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="mx-auto max-w-md px-6 py-20">
        <h1 className="font-display text-4xl leading-tight md:text-5xl">Sign in</h1>
        <p className="mt-3 text-base text-[var(--muted-foreground)]">
          Staff only. The public storefront is at <Link href="/" className="underline">/</Link>.
        </p>
        <LoginForm initialError={sp.error} next={sp.next} />
      </section>
    </>
  );
}
