import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const HERO = "/real-photos/community-county-fair.webp";

interface Review {
  name: string;
  source: "Google" | "Facebook" | "Yelp";
  stars: 4 | 5;
  body: string;
  date?: string;
  photo?: { src: string; alt: string };
}

// All reviews below are real, pulled from Google Business, Facebook, and Yelp.
// See docs/SOURCE_OF_TRUTH.md §4. Do not add fabricated reviews.
const REVIEWS: Review[] = [
  // GOOGLE
  {
    name: "Peggy L.",
    source: "Google",
    stars: 5,
    body: "Jamus takes pride in the work he does for his customers. I love the blue door he made for my home. Nice work Jamus!",
    date: "7 months ago",
    photo: {
      src: "/real-photos/install-blue-door-peggy.webp",
      alt: "The dark teal-blue front entry door Peggy bought, installed on her brick home",
    },
  },
  {
    name: "Pamela M.",
    source: "Google",
    stars: 5,
    body: "Contacted the staff to see if they had a countertop size we were having trouble finding. They searched for our measurements, sent us updates and went above and beyond to help. The best part? We found one in great condition for $25! Crazy good deal with the best customer service around.",
    date: "a year ago",
  },
  {
    name: "Ryan T.",
    source: "Google",
    stars: 5,
    body: "Great people to deal with! Josh installed our granite island and countertops with great detail and craftsmanship. Highly recommend.",
    date: "a year ago",
  },
  {
    name: "Gary G.",
    source: "Google",
    stars: 5,
    body: "My wife and I bought our quartz counter tops from Price-Less Building Center and couldn't be happier! From the expertise in the store to the installation, they were top notch! Thanks guys!",
    date: "a year ago",
  },
  {
    name: "Sarah S.",
    source: "Google",
    stars: 5,
    body: "Kind people here! Go here and dream it up. These people aim to please you. Lots to offer. Thank you.",
    date: "4 months ago",
  },
  {
    name: "Brady D.",
    source: "Google",
    stars: 5,
    body: "The best. The building was a bit creepy but the stuff inside it more than made up for it and the customer service was great!",
    date: "9 months ago",
  },
  {
    name: "Robin B.",
    source: "Google",
    stars: 5,
    body: "Great customer service and very helpful, knowing exactly what is available in inventory. Great products to choose from. I needed a new door. I got a new door and a new bathroom vanity!",
    date: "a year ago",
  },
  {
    name: "Jeff M.",
    source: "Google",
    stars: 4,
    body: "New in the box windows, great price. Exactly as listed.",
    date: "a year ago",
  },
  {
    name: "Damian B.",
    source: "Google",
    stars: 4,
    body: "Go and check out the products. Lots of items.",
    date: "5 months ago",
  },

  // FACEBOOK
  {
    name: "Facebook reviewer",
    source: "Facebook",
    stars: 5,
    body: "I just bought 6 doors and will be back for more because the quality and pricing is unmatched. Thanks for the great service Josh and Brian!",
  },
  {
    name: "Facebook reviewer",
    source: "Facebook",
    stars: 5,
    body: "Josh was awesome to work with and was very knowledgeable. The cabinets were exactly as advertised and very well built.",
  },
  {
    name: "Facebook reviewer",
    source: "Facebook",
    stars: 5,
    body: "Quality products and great people to work with. Won't disappoint. Come in and you'll see the selection and expertise.",
  },

  // YELP
  {
    name: "Yelp reviewer",
    source: "Yelp",
    stars: 5,
    body: "Friendly staff, great stock, great prices.",
  },
  {
    name: "Yelp reviewer",
    source: "Yelp",
    stars: 5,
    body: "This place was amazing! Beautiful butcher block countertops, vanities, windows, lights, and so much more. The best part was the people working there, so helpful and friendly and willing to spend the time to get exactly what you want.",
  },
];

const SOURCE_BADGE: Record<Review["source"], string> = {
  Google: "bg-[#4285F4]/10 text-[#1a73e8]",
  Facebook: "bg-[#1877F2]/10 text-[#1877F2]",
  Yelp: "bg-[#d32323]/10 text-[#d32323]",
};

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-base text-amber-500" aria-label={`${n} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < n ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const avg = (REVIEWS.reduce((s, r) => s + r.stars, 0) / REVIEWS.length).toFixed(1);

  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image src={HERO} alt="Customers at the shop counter" fill priority className="object-cover" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-white md:py-28">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
            What our customers say
          </div>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            REAL REVIEWS FROM REAL CUSTOMERS.
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/90">
            <div className="flex items-center gap-2 text-2xl">
              <span className="text-amber-400">★★★★★</span>
              <span className="font-display">{avg}/5</span>
            </div>
            <div>Google · Facebook · Yelp</div>
          </div>
          <p className="mt-5 max-w-xl text-sm text-white/80">
            Every review on this page is real, pulled from the public review platforms below with attribution. We do not publish testimonials we cannot point to.
          </p>
        </div>
      </section>

      {/* MASONRY GRID */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {REVIEWS.map((r, i) => (
            <article
              key={i}
              className="mb-5 inline-block w-full break-inside-avoid rounded-2xl border bg-white p-5 shadow-card"
            >
              <div className="flex items-center justify-between gap-3">
                <Stars n={r.stars} />
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider " +
                    SOURCE_BADGE[r.source]
                  }
                >
                  {r.source}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">&ldquo;{r.body}&rdquo;</p>
              {r.photo ? (
                <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-lg border border-[var(--border)]">
                  <Image src={r.photo.src} alt={r.photo.alt} fill className="object-cover" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
                </div>
              ) : null}
              <div className="mt-4 border-t pt-3">
                <div className="font-display text-base">{r.name}</div>
                {r.date ? (
                  <div className="text-xs text-[var(--muted-foreground)]">{r.date}</div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* LEAVE A REVIEW */}
      <section className="border-t bg-[var(--brand-priceless-dark)] py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Bought from us recently?
          </div>
          <h2 className="font-display mt-2 text-4xl md:text-5xl">Leave us a review.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            Word of mouth keeps the lights on. If we did right by you, a couple of sentences on any of the platforms below means the world to us.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.google.com/search?q=Price-Less+Building+Center+Wausau"
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-[var(--brand-priceless)]"
            >
              Review on Google
            </a>
            <a
              href="https://www.facebook.com/p/Price-Less-Building-Center-100057337665027/"
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-[var(--brand-priceless)]"
            >
              Review on Facebook
            </a>
            <a
              href="https://www.yelp.com/biz/price-less-building-center-wausau"
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-[var(--brand-priceless)]"
            >
              Review on Yelp
            </a>
          </div>
          <div className="mt-8">
            <Link href="/contact" className="text-sm underline">
              Or send us a private note →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
