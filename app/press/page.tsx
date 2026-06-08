import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ADDRESS } from "@/lib/brands";

const HERO = "/real-photos/storefront-signage.webp";

interface Clip {
  outlet: string;
  outletShort: string;
  badgeBg: string;
  badgeFg: string;
  date: string;
  headline: string;
  blurb: string;
  href: string;
  type: "Print" | "Television" | "Radio" | "Magazine" | "Online";
}

// Every clip below comes from the project Source of Truth (docs/SOURCE_OF_TRUTH.md).
// Do not add fabricated press coverage.
const CLIPS: Clip[] = [
  {
    outlet: "WSAW NewsChannel 7",
    outletShort: "7",
    badgeBg: "bg-[#c92027]",
    badgeFg: "text-white",
    date: "Dec 11, 2025",
    headline: "Wausau business transforms shop into Santa's workshop",
    blurb:
      "WSAW covered the second annual Santa's Workshop at the Builders Corner showroom. Jamus Baumgardt on the kids: \"The kids loved it. To see the look on their faces and have the parents ask, 'Hey, are you going to do this again?'\"",
    href: "https://www.wsaw.com/2025/12/11/wausau-business-transforms-shop-into-santas-workshop/",
    type: "Television",
  },
  {
    outlet: "WSAW NewsChannel 7",
    outletShort: "7",
    badgeBg: "bg-[#c92027]",
    badgeFg: "text-white",
    date: "Apr 12, 2025",
    headline: "Easter bunny visits local Wausau business",
    blurb:
      "WSAW covered the first Easter Bunny visit at Price-Less. Josh Nickel on the day: \"It's pure joy. It's not a staged smile. It's 'Wow, I get to see Santa Claus,' or 'I get to see the Easter Bunny.'\"",
    href: "https://www.wsaw.com/2025/04/13/easter-bunny-visits-local-wausau-business/",
    type: "Television",
  },
  {
    outlet: "WSAW NewsChannel 7",
    outletShort: "7",
    badgeBg: "bg-[#c92027]",
    badgeFg: "text-white",
    date: "Dec 8, 2024",
    headline: "Local business brings Santa and the North Pole to Wausau",
    blurb:
      "WSAW covered the first Santa's Workshop at the Builders Corner showroom, after a customer dressed as Santa came in for a front door. Jamus Baumgardt on 125 hours of decorating: \"Growing up, we had the Wausau Center Mall… We feel like we kind of hit it here.\"",
    href: "https://www.wsaw.com/2024/12/09/local-business-brings-santa-north-pole-wausau/",
    type: "Television",
  },
  {
    outlet: "WSAW NewsChannel 7",
    outletShort: "7",
    badgeBg: "bg-[#c92027]",
    badgeFg: "text-white",
    date: "Jun 17, 2023",
    headline: "New mural coming to downtown Wausau",
    blurb:
      "WSAW covered the Build Your Future mural going up on the warehouse wall, painted by 50+ community volunteers under artist Stephanie Kohli. Josh Nickel: \"Trades is a dying breed. So we want to do something that represents what us hard-working guys do.\"",
    href: "https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/",
    type: "Television",
  },
  {
    outlet: "The Business News",
    outletShort: "BN",
    badgeBg: "bg-[#0b3a67]",
    badgeFg: "text-white",
    date: "May 3, 2021",
    headline: "They're building something",
    blurb:
      "The Business News (North Central WI) profiled the 2019 acquisition of Price-Less by Jamus Baumgardt, Josh Nickel and Justin Jolin, and reported roughly 40% sales growth through 2020.",
    href: "https://www.readthebusinessnews.com/features/growth_strategies/they-re-building-something/article_70b4788e-a8e3-11eb-ba26-e3a990b7c281.html",
    type: "Print",
  },
];

function Badge({ short, bg, fg }: { short: string; bg: string; fg: string }) {
  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-xl tracking-tight ${bg} ${fg}`}
      aria-hidden
    >
      {short}
    </div>
  );
}

export const metadata = {
  title: "Press · Price-Less Building Center",
  description:
    "Press coverage of Price-Less Building Center in Wausau, WI. WSAW NewsChannel 7 and The Business News features on the mural, holiday events, and the 2019 acquisition.",
};

export default function PressPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image src={HERO} alt="Storefront on Washington St" fill priority className="object-cover" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-white md:py-28">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
            Press &amp; media
          </div>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            IN THE NEWS.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
            Selected coverage of the warehouse and the cluster of brands at 825 Washington Street. Every link below is to the original article. For interview requests, warehouse tours, or photo permissions, see the contact at the bottom of this page.
          </p>
        </div>
      </section>

      {/* CLIPS */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="space-y-5">
          {CLIPS.map((c, i) => (
            <article
              key={i}
              className="group flex flex-col gap-5 rounded-2xl border bg-white p-6 shadow-card sm:flex-row sm:items-start sm:p-7"
            >
              <Badge short={c.outletShort} bg={c.badgeBg} fg={c.badgeFg} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--brand-priceless)]">{c.outlet}</span>
                  <span aria-hidden>·</span>
                  <span>{c.date}</span>
                  <span aria-hidden>·</span>
                  <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-semibold">
                    {c.type}
                  </span>
                </div>
                <h2 className="font-display mt-2 text-2xl leading-snug md:text-3xl">
                  {c.headline}
                </h2>
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">{c.blurb}</p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-priceless)] hover:underline"
                >
                  Read the original
                  <span aria-hidden>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PRESS CONTACT */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-6 rounded-2xl bg-[var(--brand-priceless)] p-10 text-white md:grid-cols-[2fr_1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Press contact
            </div>
            <h2 className="font-display mt-2 text-3xl md:text-4xl">
              Working on a story? We&apos;re happy to help.
            </h2>
            <p className="mt-3 text-white/85">
              Email the shop directly. The fastest window for a callback is mid-week during open hours (Monday through Saturday).
            </p>
            <p className="mt-4 text-sm text-white/85">
              {ADDRESS.street} · {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <a href="mailto:pricelessbuildingcenter@gmail.com" className="btn bg-white text-[var(--brand-priceless)]">
              pricelessbuildingcenter@gmail.com
            </a>
            <Link href="/about" className="btn btn-outline border-white/50 bg-transparent text-white">
              About the business
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
