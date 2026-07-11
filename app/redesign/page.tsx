import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

/**
 * PREVIEW ROUTE — /redesign  (WIP, non-destructive)
 * Fonts + color MATCHED to rejuvenation.com (real Gotham + Utopia Std Display).
 * Sections adapted from remodelingjourney.com (Detail-Oriented service cards,
 * before/after descriptions, brand-logo + trust rows) + the wide mural wall.
 * NOTE: Gotham (Hoefler) + Utopia (Adobe) are licensed; fine for this match/comp,
 * production needs licenses or licensed equivalents.
 */

const gotham = localFont({
  src: [
    { path: "../fonts/gotham/Gotham-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/gotham/Gotham-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../fonts/gotham/Gotham-Book.otf", weight: "400", style: "normal" },
    { path: "../fonts/gotham/Gotham-BookItalic.otf", weight: "400", style: "italic" },
    { path: "../fonts/gotham/Gotham-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/gotham/Gotham-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../fonts/gotham/Gotham-Bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/gotham/Gotham-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-gotham",
  display: "swap",
});
const utopia = localFont({
  src: [
    { path: "../fonts/utopia/Utopia-n4.woff2", weight: "400", style: "normal" },
    { path: "../fonts/utopia/Utopia-i4.woff2", weight: "400", style: "italic" },
    { path: "../fonts/utopia/Utopia-n6.woff2", weight: "600", style: "normal" },
    { path: "../fonts/utopia/Utopia-n7.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-utopia",
  display: "swap",
});

const INK = "#1a1818";
const SOFT = "#57534f";
const RUST = "#D04727";
const SLATE = "#4b4e59";
const LINE = "#e6e2dc";
const CREAM = "#f7f5f1";
const TAUPE = "#e7e0d4"; // rejuvenation's warm guide-band neutral

const P = "/real-photos";
const B = "/real-photos/business";

const SERVICES = [
  { name: "Price-Less", body: "Discount and surplus doors, windows, cabinets, and lighting — tagged and ready to take home.", cta: "Shop the warehouse", img: `${B}/warehouse-assorted-windows.jpg` },
  { name: "Builders Corner", body: "Custom cabinetry and full kitchen & bath design, built in our own Wausau shop.", cta: "Design a kitchen", img: `${B}/white-shaker-kitchen-cabinets.jpg` },
  { name: "4 Squared", body: "Our own crew handles the whole remodel — from demo to the final walkthrough.", cta: "Start a remodel", img: `${B}/dark-cabinet-kitchen-install.jpg` },
];

// Placeholder review copy for the comp (first two mirror real Google reviews;
// swap all three for live Google review data when wired).
const REVIEWS = [
  { q: "Contacted the staff to see if they had a countertop size we were having trouble finding, and they went out of their way to help. Great prices too.", n: "Pamela M.", d: "Google · a year ago" },
  { q: "Great customer service and helpful staff. Found exactly what we needed for our remodel at a fraction of big-box pricing.", n: "Gary O.", d: "Google · 5 months ago" },
  { q: "We furnished a whole kitchen here for a fraction of retail. Solid wood cabinets, in stock, and the crew installed them. Couldn't be happier.", n: "Robin S.", d: "Google · 3 months ago" },
];

const BEFORE_AFTER = [
  { label: "Kitchen remodel", img: `${B}/kitchen-remodel-before-after.jpg`, body: "Dated oak galley to a bright white-cabinet kitchen with stone counters — designed, supplied, and installed under one roof." },
  { label: "Kitchen & bath", img: `${B}/kitchen-and-bath-remodel-split.jpg`, body: "A whole-home refresh: cabinetry from Builders Corner, fixtures off the Price-Less floor, installed by the 4 Squared crew." },
];

const BRANDS = ["Andersen", "Marvin", "JELD-WEN", "Masonite", "Pella", "Kohler", "Delta", "Schlage", "Kwikset", "Therma-Tru", "Cambria", "Blum"];

// Condensed local-press strip. First links to the real WSAW mural story; the
// other two are placeholders pending real article URLs from Aaron.
const NEWS = [
  { source: "WSAW NewsChannel 7", date: "June 2023", title: "A “Build Your Future” community mural comes to downtown Wausau.", url: "https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/" },
  { source: "Wausau Business News", date: "2019", title: "Josh Nickel takes the reins at Price-Less and Builders Corner.", url: "#" },
  { source: "WSAW NewsChannel 7", date: "2025", title: "Community day and Easter event draws families to the storefront.", url: "#" },
];

// Recent social posts for the Facebook band.
const FB_PHOTOS = [`${P}/paint-day-rainbow.webp`, `${P}/anniversary-6-year.webp`, `${P}/santa-at-storefront.webp`, `${P}/school-food-drive.webp`];
const FB_URL = "https://www.facebook.com/pricelessbuildingcenter";
const IG_URL = "https://www.instagram.com/pricelessbuildingcenter";

const GALLERY = [
  `${B}/white-kitchen-wood-island.jpg`, `${B}/kohler-vessel-sink-gold-faucet.jpg`,
  `${B}/dark-double-vanity-bathroom-install.jpg`, `${B}/crystal-ceiling-fan-warehouse.jpg`,
  `${B}/white-shaker-kitchen-cabinets.jpg`, `${B}/reclaimed-wood-framed-mirror.jpg`,
];

/* --- tiny building blocks --- */
function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em]" style={{ color: onDark ? "#e6b8a6" : RUST }}>{children}</p>;
}
function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 style={{ fontFamily: "var(--font-utopia)" }} className={`font-semibold leading-[1.05] text-[clamp(2rem,1rem+2.9vw,3.3rem)] ${className}`}>{children}</h2>;
}

export default function RedesignPreview() {
  return (
    <div className={`${gotham.variable} ${utopia.variable} min-h-dvh bg-white`} style={{ color: INK, fontFamily: "var(--font-gotham)", fontWeight: 300 }}>
      {/* ============================ HEADER ============================ */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28" style={{ background: "linear-gradient(to bottom, rgba(20,20,20,0.5), transparent)" }} />
        <div className="relative mx-auto flex max-w-[1360px] items-center px-8 py-7 text-white">
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
            <span className="block text-[1.5rem] font-medium tracking-[0.36em] leading-none">PRICE-LESS</span>
            <span className="mt-[7px] block text-[0.58rem] font-medium tracking-[0.44em] text-white/70">WAUSAU · EST. 1978</span>
          </Link>
          <nav className="hidden items-center gap-7 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white/90 lg:flex">
            <span>Shop</span><span>Cabinetry</span><span>Remodels</span>
          </nav>
          <div className="ml-auto flex items-center gap-7 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white/90">
            <span className="hidden md:inline">Search</span>
            <span className="hidden md:inline">(715) 848-3855</span>
          </div>
        </div>
      </header>

      {/* ============================= HERO ============================= */}
      <section className="relative min-h-[92svh] w-full overflow-hidden" style={{ background: INK }}>
        <Image src={`${B}/dark-base-cabinets-warehouse-row.jpg`} alt="A long row of black surplus kitchen cabinets down an aisle of the Price-Less warehouse in Wausau." fill priority sizes="100vw" quality={82} className="object-cover object-[60%_center]" />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(80deg, rgba(26,24,24,0.90) 0%, rgba(26,24,24,0.60) 36%, rgba(26,24,24,0.16) 64%, transparent 88%)" }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, rgba(26,24,24,0.75), transparent)" }} />
        <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-[1360px] flex-col justify-end px-8 pb-24 pt-40 text-white">
          <div className="mb-7 flex items-center gap-3">
            <span style={{ color: RUST }} className="tracking-[0.2em] text-sm" aria-hidden>★★★★★</span>
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-white/85">4.8 on Google · Family-run in Wausau since 1978</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-utopia)" }} className="text-white leading-[1.0] tracking-[0.002em] text-[clamp(3rem,1rem+7vw,7rem)]">
            <span className="font-semibold">The whole home,</span>
            <span className="block italic font-normal">priced for less.</span>
          </h1>
          <p className="mt-8 max-w-[46ch] text-[1.02rem] font-light leading-[1.7] tracking-[0.01em] text-white/85">
            Discount and surplus doors, windows, cabinets and vanities — plus custom cabinetry and a full install crew. One Wausau yard, from a bin find to a finished kitchen.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
            <Link href="/shop" data-ink className="border border-white/80 px-9 py-4 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white" style={{ ["--h" as string]: INK }}>Shop the warehouse ›</Link>
            <Link href="/contact" className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/90 underline-offset-[6px] hover:underline">Plan a remodel ›</Link>
          </div>
        </div>
      </section>

      {/* ---- slate promo strip ---- */}
      <div style={{ background: SLATE }} className="text-white">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 divide-white/15 px-8 py-4 text-center md:grid-cols-3 md:divide-x">
          {[["New tags every Wednesday", "Fresh surplus hits the floor weekly ›"], ["Everything under one roof", "Shop · design · install ›"], ["4.8★ on Google", "Family-run since 1978 ›"]].map(([a, b]) => (
            <div key={a} className="px-4 py-1">
              <div className="text-[0.8rem] font-medium uppercase tracking-[0.12em]">{a}</div>
              <div className="mt-0.5 text-[0.72rem] font-light tracking-[0.03em] text-white/75">{b}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- INTRO ---- */}
      <section className="mx-auto max-w-[900px] px-8 py-24 text-center">
        <Eyebrow>One yard, three ways to build</Eyebrow>
        <H2 className="mx-auto mt-4 max-w-[20ch]">From a bin find to a finished kitchen.</H2>
        <p className="mx-auto mt-6 max-w-[62ch] text-[1.05rem] font-light leading-[1.75]" style={{ color: SOFT }}>
          Price-Less began in 1978 as Wausau&rsquo;s discount and surplus building yard. Today the same lot holds three businesses — shop the floor, design with our cabinet team, and remodel with our own crew, all under one roof.
        </p>
      </section>

      {/* ---- MURAL WALL (wide, full-bleed) ---- */}
      <figure className="relative">
        <div className="relative w-full overflow-hidden" style={{ background: CREAM }}>
          <Image src={`${P}/mural-wide.webp`} alt="The 'Build Your Future' community mural on the side of the Price-Less Building Center, painted by fifty Wausau volunteers in June 2023." width={2400} height={750} sizes="100vw" className="block h-auto w-full" />
        </div>
        <figcaption className="mx-auto flex max-w-[1360px] flex-wrap items-baseline justify-between gap-3 px-8 py-4 text-[0.8rem]" style={{ color: SOFT }}>
          <span>&ldquo;Build Your Future&rdquo; mural · designed by Stephanie Kohli · painted by fifty Wausau volunteers · June 2023</span>
          <a href="https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/" target="_blank" rel="noreferrer" className="font-medium uppercase tracking-[0.16em]" style={{ color: RUST }}>WSAW story ›</a>
        </figcaption>
      </figure>

      {/* ---- THREE BUSINESSES — rejuvenation 3-up guide-card row on a warm taupe band ---- */}
      <section style={{ background: TAUPE }}>
        <div className="mx-auto max-w-[1240px] px-8 py-24 text-center">
          <Eyebrow>One yard · three ways to build</Eyebrow>
          <H2 className="mx-auto mt-4 max-w-[22ch]">Shop it, design it, <span className="italic font-normal">build it.</span></H2>
          <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.name} className="flex flex-col items-center">
                <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ background: "#d8cfc0" }}>
                  <Image src={s.img} alt={s.name} fill sizes="(max-width:768px) 90vw, 30vw" className="object-cover" />
                </div>
                <h3 style={{ fontFamily: "var(--font-utopia)" }} className="mt-7 text-[1.5rem] font-semibold leading-tight">{s.name}</h3>
                <p className="mx-auto mt-3 max-w-[32ch] text-[0.92rem] font-light leading-[1.65]" style={{ color: SOFT }}>{s.body}</p>
                <Link href="/shop" className="mt-5 inline-block text-[0.72rem] font-medium uppercase tracking-[0.2em] underline-offset-[6px] transition hover:underline" style={{ color: INK }}>{s.cta} ›</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- BEFORE / AFTER ---- */}
      <section className="mx-auto max-w-[1360px] px-8 py-24">
        <div className="max-w-[46ch]">
          <Eyebrow>The remodeling journey</Eyebrow>
          <H2 className="mt-4">Before, and <span className="italic font-normal">after.</span></H2>
          <p className="mt-5 text-[1rem] font-light leading-[1.7]" style={{ color: SOFT }}>Real rooms the in-house crew has finished — shopped, designed, and installed without leaving the lot.</p>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {BEFORE_AFTER.map((ba) => (
            <figure key={ba.label}>
              <div className="relative aspect-[16/10] w-full overflow-hidden" style={{ background: "#e9e5df" }}>
                <Image src={ba.img} alt={ba.label} fill sizes="(max-width:768px) 90vw, 45vw" className="object-cover" />
              </div>
              <figcaption className="mt-5">
                <h3 style={{ fontFamily: "var(--font-utopia)" }} className="text-[1.4rem] font-semibold">{ba.label}</h3>
                <p className="mt-2 text-[0.95rem] font-light leading-[1.7]" style={{ color: SOFT }}>{ba.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---- BRANDS ON THE FLOOR ---- */}
      <section style={{ background: INK }} className="text-white">
        <div className="mx-auto max-w-[1360px] px-8 py-20 text-center">
          <Eyebrow onDark>Read straight off the boxes in our aisles</Eyebrow>
          <H2 className="mt-4 text-white">Brands on the floor.</H2>
          <div className="mx-auto mt-12 flex max-w-[1100px] flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {BRANDS.map((b) => (
              <span key={b} className="text-[1.15rem] font-medium uppercase tracking-[0.18em] text-white/70">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- REVIEWS — centered heading + rating + 3-up cards (remodelingjourney testimonial structure) ---- */}
      <section className="mx-auto max-w-[1240px] px-8 py-24 text-center">
        <Eyebrow>Since 1978</Eyebrow>
        <H2 className="mx-auto mt-4 max-w-[24ch]">Trusted across <span className="italic font-normal">central Wisconsin.</span></H2>
        <div className="mt-5 flex items-center justify-center gap-3">
          <span style={{ color: RUST }} className="text-sm tracking-[0.2em]" aria-hidden>★★★★★</span>
          <span className="text-[0.76rem] font-medium uppercase tracking-[0.18em]" style={{ color: SOFT }}>4.8 on Google · Family-run since 1978</span>
        </div>
        <div className="mt-16 grid gap-8 text-left md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.n} className="flex flex-col border p-8" style={{ borderColor: LINE }}>
              <div style={{ color: RUST }} className="text-sm tracking-[0.2em]" aria-hidden>★★★★★</div>
              <blockquote style={{ fontFamily: "var(--font-utopia)" }} className="mt-5 flex-1 text-[1.12rem] font-normal italic leading-[1.55]">&ldquo;{r.q}&rdquo;</blockquote>
              <figcaption className="mt-6 text-[0.74rem] font-medium uppercase tracking-[0.12em]" style={{ color: SOFT }}>{r.n} · {r.d}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---- GALLERY ---- */}
      <section style={{ background: CREAM }} className="border-t" >
        <div className="mx-auto max-w-[1360px] px-8 py-24" style={{ borderColor: LINE }}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Around the yard</Eyebrow>
              <H2 className="mt-4">A slice of the floor.</H2>
            </div>
            <Link href="/shop" className="hidden border-b pb-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] sm:inline-block" style={{ borderColor: INK }}>See the full gallery ›</Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALLERY.map((src, i) => (
              <div key={i} className={`relative overflow-hidden ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-[16/10] md:aspect-auto" : "aspect-square"}`} style={{ background: "#e9e5df" }}>
                <Image src={src} alt="" fill sizes="(max-width:768px) 45vw, 30vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CONDENSED NEWS / PRESS ---- */}
      <section className="mx-auto max-w-[1240px] px-8 py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>In the local news</Eyebrow>
            <H2 className="mt-4">Wausau keeps <span className="italic font-normal">talking.</span></H2>
          </div>
          <a href={FB_URL} target="_blank" rel="noreferrer" className="hidden shrink-0 text-[0.72rem] font-medium uppercase tracking-[0.18em] underline-offset-[6px] hover:underline sm:inline-block">All press ›</a>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {NEWS.map((n) => (
            <a key={n.title} href={n.url} target="_blank" rel="noreferrer" className="group block border-t pt-6" style={{ borderColor: INK }}>
              <div className="flex items-baseline justify-between text-[0.7rem] font-medium uppercase tracking-[0.14em]" style={{ color: SOFT }}>
                <span>{n.source}</span><span>{n.date}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-utopia)" }} className="mt-4 text-[1.25rem] font-semibold leading-[1.3] transition group-hover:opacity-70">{n.title}</h3>
              <span className="mt-5 inline-block text-[0.7rem] font-medium uppercase tracking-[0.18em]" style={{ color: RUST }}>Read the story ›</span>
            </a>
          ))}
        </div>
      </section>

      {/* ---- FACEBOOK ---- */}
      <section style={{ background: CREAM }} className="border-t" >
        <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-8 py-24 md:grid-cols-2" style={{ borderColor: LINE }}>
          <div>
            <Eyebrow>Around the store lately</Eyebrow>
            <H2 className="mt-4">Follow along on <span className="italic font-normal">Facebook.</span></H2>
            <p className="mt-5 max-w-[46ch] text-[1rem] font-light leading-[1.75]" style={{ color: SOFT }}>
              New stock, holiday hours, paint days, and community events — we post a few times a week. It&rsquo;s the most current look at what&rsquo;s on the floor between visits.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={FB_URL} target="_blank" rel="noreferrer" className="border px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-[#1a1818] transition hover:bg-[#1a1818] hover:text-white" style={{ borderColor: INK }}>Follow on Facebook ›</a>
              <a href={IG_URL} target="_blank" rel="noreferrer" className="text-[0.72rem] font-medium uppercase tracking-[0.2em] underline-offset-[6px] hover:underline">Instagram ›</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FB_PHOTOS.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden" style={{ background: "#e4ddd0" }}>
                <Image src={src} alt="A recent Price-Less Building Center Facebook post." fill sizes="(max-width:768px) 45vw, 22vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CLOSING CTA ---- */}
      <section style={{ background: INK }} className="text-white">
        <div className="mx-auto max-w-[820px] px-8 py-28 text-center">
          <H2 className="text-white">Come see it. You&rsquo;ll want to <span className="italic font-normal">build here.</span></H2>
          <p className="mx-auto mt-6 max-w-[54ch] text-[1rem] font-light leading-[1.7] text-white/75">825 Washington Street, Wausau · Open Monday through Saturday. Same-day floor photos on Facebook.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/shop" data-ink className="border border-white/80 px-9 py-4 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white" style={{ ["--h" as string]: INK }}>Shop the warehouse ›</Link>
            <Link href="/contact" className="px-9 py-4 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/85 underline-offset-[6px] hover:underline">Hours &amp; directions ›</Link>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="border-t" style={{ borderColor: LINE }}>
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-4 px-8 py-10 text-[0.78rem] sm:flex-row" style={{ color: SOFT }}>
          <span className="text-[1rem] font-medium tracking-[0.28em]">PRICE-LESS</span>
          <span className="tracking-[0.04em]">825 Washington St · Wausau, WI · (715) 848-3855</span>
          <span className="font-medium uppercase tracking-[0.14em]">Price-Less · Builders Corner · 4 Squared</span>
        </div>
      </footer>

      <style>{`[data-ink]:hover{color:var(--h)!important;}`}</style>
    </div>
  );
}
