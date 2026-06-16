import Image from "next/image";
import { ADDRESS } from "@/lib/brands";

// Clean static hero for 4 Squared: the real logo on a single tasteful
// backdrop. The crew's actual project photos live in the Facebook embed
// further down the page, not in a wall of generic install shots up here.
const POSTER = "/real-photos/business/white-kitchen-marble-island.jpg";
const PHONE = ADDRESS.phone;
const PHONE_TEL = `tel:${PHONE.replace(/[^0-9+]/g, "")}`;
const EMAIL_MAILTO = "mailto:pricelessbuildingcenter@gmail.com?subject=4%20Squared%20estimate%20request";

export function FourSquaredHero() {
  return (
    <section className="relative border-b">
      <div className="relative min-h-[80svh] w-full overflow-hidden bg-[#0a0e14]">
        <Image
          src={POSTER}
          alt="A finished kitchen remodel by the 4 Squared crew: white cabinetry and a marble-top island."
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,14,20,0.94) 0%, rgba(10,14,20,0.6) 50%, rgba(10,14,20,0.3) 78%, rgba(10,14,20,0.55) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-center px-6 py-20">
          <div className="inline-flex w-fit items-center rounded-xl bg-white px-5 py-3 shadow-lg ring-1 ring-black/5">
            <Image
              src="/real-photos/logo-4squared.jpg"
              alt="4 Squared — New Construction · Restoration · Remodeling"
              width={320}
              height={320}
              priority
              className="h-20 w-auto object-contain md:h-24"
            />
          </div>
          <div className="font-mono mt-7 text-xs uppercase tracking-[0.14em] text-emerald-300">
            The install side of 825 Washington Street
          </div>
          <h1 className="font-display mt-3 text-[clamp(2.75rem,1.8rem+6vw,7rem)] uppercase leading-[0.92] text-white">
            The install crew that{" "}
            <span className="text-emerald-400">finishes the job.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            4 Squared handles the work. Kitchens, baths, doors, finish carpentry. We install cabinets from Builders Corner, materials from the Price-Less floor, or anything you bring on your own. One crew lead from demo through the final walkthrough.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={EMAIL_MAILTO}
              className="font-mono inline-flex items-center bg-emerald-600 px-7 py-4 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-emerald-700"
            >
              Get a free estimate →
            </a>
            <a
              href={PHONE_TEL}
              className="font-mono text-sm uppercase tracking-[0.14em] text-white underline decoration-emerald-400/60 underline-offset-[6px] hover:decoration-emerald-400"
            >
              Or call {PHONE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
