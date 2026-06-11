import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in · Price-Less Admin",
  robots: { index: false, follow: false },
};

const BACKDROP = "/real-photos/business/warehouse-cabinet-display.jpg";

/**
 * Staff sign-in screen.
 *
 * Mirrors the 404 page's anchored full-bleed treatment so admin entry
 * feels like its own space rather than a tacked-on form sitting under
 * the public storefront chrome. The Price-Less logo sits at the top
 * left as the only piece of nav; everything else is a single centered
 * sign-in card.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0b] text-white">
      <div className="absolute inset-0">
        <Image
          src={BACKDROP}
          alt=""
          fill
          priority
          className="object-cover opacity-50"
          quality={70}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/85" />
      </div>

      {/* Logo strip */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Price-Less Building Center home">
          <Image
            src="/real-photos/logo-priceless-clean.webp"
            alt=""
            width={960}
            height={960}
            className="h-11 w-auto object-contain drop-shadow"
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-base tracking-tight text-white">
              Price-<span className="text-[#ff8b85]">Less</span> Admin
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
              Staff portal · Wausau, WI
            </span>
          </span>
        </Link>
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.14em] text-white/70 underline decoration-white/20 underline-offset-4 transition hover:text-white"
        >
          Back to storefront →
        </Link>
      </header>

      {/* Centered sign-in card */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-160px)] max-w-md flex-col items-stretch justify-center px-6 pb-16">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] backdrop-blur">
          <span className="inline-block size-1.5 rounded-full bg-[#ff8b85]" />
          Staff only
        </div>
        <h1 className="font-display mt-5 text-5xl leading-[1.02] md:text-6xl">
          Sign in to <span className="text-[#ff8b85]">admin.</span>
        </h1>
        <p className="mt-4 text-base text-white/75">
          Document items, approve drafts, generate marketing. Access is restricted to
          invited Price-Less team members.
        </p>

        <div className="mt-8 rounded-md border border-white/15 bg-white/[0.06] p-6 backdrop-blur">
          <LoginForm initialError={sp.error} next={sp.next} />
        </div>

        <p className="mt-6 text-xs text-white/60">
          Not staff? The public storefront is at{" "}
          <Link href="/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
            pricelessbuilding.com
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
