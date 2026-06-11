import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const HERO = "/real-photos/storefront-signage.webp";
const SITE_URL = "https://pricelessbuilding.com";

export const metadata: Metadata = {
  title: "Building Guides + Behind the Counter · Price-Less Building Center Wausau, WI",
  description:
    "Practical guides on buying surplus building materials, reclaimed finds in central Wisconsin, and stories from the counter at Price-Less Building Center in Wausau, WI.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    title: "Building Guides + Behind the Counter · Price-Less Building Center",
    description:
      "Surplus building materials, reclaimed finds, and stories from Price-Less Building Center in Wausau, WI.",
    url: `${SITE_URL}/blog`,
    images: [{ url: "/og-mural.jpg", width: 1200, height: 512 }],
  },
};

type Category = "Tips" | "Reclaimed Finds" | "Behind the Counter";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  cover: string;
  author: string;
  date: string;
  readTime: string;
}

export const POSTS: Post[] = [
  {
    slug: "buying-surplus-doors",
    title: "What to look for when buying a surplus door",
    excerpt:
      "Surplus doors are one of the best deals in the warehouse, but you have to know what to inspect before you load it in the truck.",
    category: "Tips",
    cover: "/test-images/01-interior-door-shaker.jpg",
    author: "The Price-Less team",
    date: "May 28, 2026",
    readTime: "6 min read",
  },
  {
    slug: "how-we-price",
    title: "How we price every item against the big box",
    excerpt:
      "Every Tuesday, two of us spend the morning on Home Depot, Menards, Lowe&apos;s and Amazon. Here&apos;s exactly what that looks like.",
    category: "Behind the Counter",
    cover: "/real-photos/paint-day-flyer.webp",
    author: "The Price-Less team",
    date: "May 21, 2026",
    readTime: "8 min read",
  },
  {
    slug: "reclaimed-windows",
    title: "Three reclaimed window styles trending in central WI",
    excerpt:
      "Pulled from teardowns in Wausau, Marshfield and Antigo. The old glass is back, and remodelers are paying attention.",
    category: "Reclaimed Finds",
    cover: "/test-images/12-black-casement-window.jpg",
    author: "The Price-Less team",
    date: "May 14, 2026",
    readTime: "5 min read",
  },
  {
    slug: "cabinet-boxes-revealed",
    title: "Why our cabinet boxes come from the same factories as the big-box brands",
    excerpt:
      "A short tour of how Conestoga, Wolf and a handful of other Pennsylvania shops supply both us and the orange store.",
    category: "Behind the Counter",
    cover: "/test-images/03-base-cabinet-white-shaker.jpg",
    author: "The Price-Less team",
    date: "May 7, 2026",
    readTime: "7 min read",
  },
  {
    slug: "vanity-buying-guide",
    title: "Picking a vanity that won&apos;t look dated in five years",
    excerpt:
      "The styling trends that age fast vs. the door profiles, finishes and pulls that hold up. With three picks from our showroom.",
    category: "Tips",
    cover: "/test-images/14-white-vanity-quartz.jpg",
    author: "The Price-Less team",
    date: "Apr 30, 2026",
    readTime: "6 min read",
  },
  {
    slug: "trim-package-math",
    title: "Trim math: how much primed base does a 1,400 sq ft house actually need?",
    excerpt:
      "A worksheet we hand to first-time DIYers at the counter. Includes corner waste, doorways, and what to do with leftovers.",
    category: "Tips",
    cover: "/test-images/08-painted-trim-stack.jpg",
    author: "The Price-Less team",
    date: "Apr 23, 2026",
    readTime: "4 min read",
  },
  {
    slug: "wednesday-drop",
    title: "Inside a Wednesday inventory drop",
    excerpt:
      "Three hundred SKUs hit the floor every week. Here&apos;s what shows up, where it comes from, and how to shop the drop right.",
    category: "Behind the Counter",
    cover: "/real-photos/building-exterior.webp",
    author: "The Price-Less team",
    date: "Apr 16, 2026",
    readTime: "5 min read",
  },
  {
    slug: "1920s-farmhouse-doors",
    title: "A truckload of 1920s farmhouse doors just landed",
    excerpt:
      "Eighteen solid-pine 5-panel doors out of a Marathon County teardown. Half are sold before they hit the floor. Here&apos;s how to grab one.",
    category: "Reclaimed Finds",
    cover: "/test-images/11-reclaimed-pine-door.jpg",
    author: "The Price-Less team",
    date: "Apr 9, 2026",
    readTime: "4 min read",
  },
];

const CAT_COLORS: Record<Category, string> = {
  Tips: "bg-amber-100 text-amber-900",
  "Reclaimed Finds": "bg-emerald-100 text-emerald-900",
  "Behind the Counter": "bg-[var(--brand-priceless)]/10 text-[var(--brand-priceless)]",
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image src={HERO} alt="Family-owned shop counter" fill priority className="object-cover" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/35" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-white md:py-28">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
            The Price-Less Journal
          </div>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            STORIES FROM THE WAREHOUSE.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
            Buying guides, reclaimed-material drops, and the behind-the-scenes math of how we price every
            tag. Written by the same people who run the counter.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition hover:-translate-y-0.5"
            >
              <div className="relative aspect-[16/10] w-full bg-[var(--muted)]">
                <Image
                  src={p.cover}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition group-hover:scale-[1.02]"
                  quality={75}
                />
                <span
                  className={
                    "absolute left-4 top-4 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider " +
                    CAT_COLORS[p.category]
                  }
                >
                  {p.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3
                  className="font-display text-xl leading-snug"
                  dangerouslySetInnerHTML={{ __html: p.title }}
                />
                <p
                  className="mt-2 text-sm text-[var(--muted-foreground)]"
                  dangerouslySetInnerHTML={{ __html: p.excerpt }}
                />
                <div className="mt-auto pt-5 text-xs text-[var(--muted-foreground)]">
                  {p.author} · {p.date} · {p.readTime}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
