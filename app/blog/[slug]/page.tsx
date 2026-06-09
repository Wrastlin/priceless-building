import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { findItem } from "@/lib/catalog";

interface Post {
  slug: string;
  title: string;
  category: "Tips" | "Reclaimed Finds" | "Behind the Counter";
  cover: string;
  author: string;
  authorBio: string;
  date: string;
  readTime: string;
  shopSkus: string[];
  paragraphs: string[];
}

const POSTS: Record<string, Post> = {
  "buying-surplus-doors": {
    slug: "buying-surplus-doors",
    title: "What to look for when buying a surplus door",
    category: "Tips",
    cover: "/test-images/01-interior-door-shaker.jpg",
    author: "The Price-Less team",
    authorBio:
      "Written by the team at Price-Less Building Center in Wausau, Wisconsin.",
    date: "May 28, 2026",
    readTime: "6 min read",
    shopSkus: ["PL-000101", "PL-000110", "PL-000104"],
    paragraphs: [
      "Surplus doors are one of the best deals in the warehouse. They&apos;re new, they&apos;re in the original crate, and they got here because somebody else cancelled an order or ordered the wrong swing. That&apos;s it. They&apos;re not seconds, they&apos;re not damaged. They&apos;re overstock. And the price reflects somebody else&apos;s mistake, not yours.",
      "But surplus is a different animal than off-the-shelf inventory. Sizing isn&apos;t guaranteed to match what you find at the orange or blue store, and you have to be the one to confirm a few details before you load it into the truck. Here&apos;s our short list, the same one we walk every customer through when they ask.",
      "First: confirm rough-opening dimensions. The label on the crate will tell you slab size, but you want to think in terms of the opening you&apos;re framing into. A 32×80 pre-hung needs a rough opening of about 34×82-1/2. Bring a tape and check our cardboard cutout before you decide. We keep templates of every common size leaning against the door aisle for exactly this reason.",
      "Second: figure out the swing. Right-hand vs. left-hand is the source of about 90% of return trips. Stand on the side the door opens toward you. If the knob is on your right, it&apos;s a right-hand. If you&apos;re replacing an existing door, take a phone photo of the current swing before you leave the house. We can&apos;t flip swing on a pre-hung, so you want this right the first time.",
      "Third: inspect the casing and the bottom of the jamb. Surplus crates spend time in trucks and warehouses, and the most common cosmetic issue is a dent at the bottom of the jamb where it sat on a pallet. We mark anything visible with a yellow tag and discount it further. If you don&apos;t see a yellow tag, you can assume the door is cosmetically clean, but it&apos;s still worth a 30-second walk-around.",
      "Fourth: check the hinge prep and the knob bore. Pre-hungs come bored for a standard 2-3/8\" backset and prepped for three hinges. If you&apos;re reusing existing hinges or hardware, bring one piece with you. We&apos;ve got loaner Allen keys and screwdrivers at the counter for the parking-lot trial fit.",
      "Last: ask about the maker. Roughly 80% of our surplus doors come from Masonite, Jeld-Wen and Therma-Tru, the same brands you&apos;ll see at the big-box. We can usually pull a spec sheet. If you&apos;re matching an existing door, knowing the manufacturer is the fastest way to get the next one to fit the original casing.",
    ],
  },
  "how-we-price": {
    slug: "how-we-price",
    title: "How we price every item against the big box",
    category: "Behind the Counter",
    cover: "/real-photos/paint-day-flyer.webp",
    author: "The Price-Less team",
    authorBio:
      "Written by the team at Price-Less Building Center in Wausau, Wisconsin.",
    date: "May 21, 2026",
    readTime: "8 min read",
    shopSkus: ["PL-000201", "PL-000301", "PL-000501"],
    paragraphs: [
      "When customers walk in and see our tags, the first question is always some version of: are these prices real? Yes. The second is: how do you know what to charge? That part takes a little more explaining. So here it is. The actual process we run every week to set every tag on the floor.",
      "Every Tuesday morning, two of us sit down at the back office with three browser tabs open: HomeDepot.com, Menards.com, Lowes.com. Plus Amazon for hardware and lighting where it competes. We work down a spreadsheet of every active SKU we have on the floor, look up the equivalent at each retailer, and write down the price. That&apos;s it. No fancy software, no third-party pricing tool.",
      "The rule we set ourselves in 2002 (and we still hold to) is that the Price-Less tag has to be at least 20% under the lowest of those four numbers. Most of the time we&apos;re closer to 50% under, because the items came in as surplus and we already bought them at a discount. The 20% floor exists for the unusual cases where we paid more than expected or had to ship something special.",
      "What we don&apos;t do: chase the bottom of the market. eBay listings, Mercari, thrift, Craigslist. None of that goes into the benchmark. We price against retail, because that&apos;s what the customer is actually choosing between when they decide where to spend. Comparing to a used Mercari listing would make our prices look worse than they are.",
      "We also don&apos;t advertise sale prices that we can&apos;t hold. If we&apos;ve only got two of something on the floor and it&apos;s priced at $99, the tag stays at $99 until both are gone. We&apos;re not interested in bait-and-switch. That&apos;s how big-box stores end up with class actions, and we&apos;d like to keep our reputation.",
      "Occasionally we get a SKU we can&apos;t cleanly compare to a big-box item. Reclaimed doors are a good example. They&apos;re one-of-one. For those, we look at architectural-salvage listings out of Milwaukee and Minneapolis, take the median, and discount about 30%. Our pricing on reclaimed is published right on the floor next to the item, no haggling.",
      "Finally: the tag itself. Every Price-Less tag prints with three numbers: our price, the lowest big-box price we found, and the dollar savings. We started doing that in 2014 and it&apos;s the single thing customers say they wish other stores did. It&apos;s a little more work for us, but it&apos;s the right thing.",
    ],
  },
  "reclaimed-windows": {
    slug: "reclaimed-windows",
    title: "Three reclaimed window styles trending in central WI",
    category: "Reclaimed Finds",
    cover: "/test-images/12-black-casement-window.jpg",
    author: "The Price-Less team",
    authorBio:
      "Written by the team at Price-Less Building Center in Wausau, Wisconsin.",
    date: "May 14, 2026",
    readTime: "5 min read",
    shopSkus: ["PL-000201", "PL-000208", "PL-000601"],
    paragraphs: [
      "Reclaimed windows have been hovering around the edges of the central-Wisconsin design scene for about five years, but in the last twelve months something shifted. They&apos;re mainstream now. Remodelers in Wausau, Marathon and Stevens Point are calling us before the truck unloads, and three styles in particular keep selling out the same week they hit the floor.",
      "The first is the divided-light double-hung. These are the classic six-over-six and nine-over-nine wood sash windows out of 1920s and 30s farmhouses across the county. They&apos;re heavy, the glass is wavy and old, and they have a presence that vinyl simply cannot fake. We&apos;ve been pulling these out of teardowns in Athens, Edgar and Marathon. They show up on the floor for around $80 to $140 per sash depending on size and condition.",
      "The second is the steel-frame casement. Mid-century commercial buildings and the occasional Frank Lloyd Wright-influenced ranch home used these. Black steel frame, single-pane glass, often with a quarter-light operable. Designers are repurposing them as interior partition walls: bathroom glass, sunroom dividers, even kitchen pass-throughs. We had a pallet of fourteen come in from a Marshfield warehouse demo last month. They were gone in nine days.",
      "The third (and the one we get the most calls about) is the leaded-glass transom. These came out of doors and tall double-hung stacks in Victorian-era homes. The lead came is the patterned strip holding the small panes together, and original leaded glass simply cannot be reproduced affordably new. People are using these as fixed accents above modern doors and over kitchen sinks. We see one or two a month at most.",
      "If you&apos;re considering reclaimed, the math you have to do is restoration cost vs. a new equivalent. A wood-sash double-hung at $120 might need $200 in stripping, glazing compound, sash cord and paint to be re-installable. That puts you at $320 all in. The new equivalent isn&apos;t actually a new equivalent. Vinyl doesn&apos;t look like that. So you&apos;re comparing $320 to whatever you&apos;d spend chasing the look in a custom shop, which is usually four figures.",
      "We hold reclaimed inventory in the Reclaim Loft above the door aisle. If you&apos;re driving in from out of town, text us a photo of what you&apos;re looking for and we&apos;ll tell you what&apos;s on hand before you get in the truck.",
    ],
  },
  "cabinet-boxes-revealed": {
    slug: "cabinet-boxes-revealed",
    title: "Why our cabinet boxes come from the same factories as the big-box brands",
    category: "Behind the Counter",
    cover: "/test-images/03-base-cabinet-white-shaker.jpg",
    author: "The Price-Less team",
    authorBio:
      "Written by the team at Price-Less Building Center in Wausau, Wisconsin.",
    date: "May 7, 2026",
    readTime: "7 min read",
    shopSkus: ["PL-000301", "PL-000305", "PL-000401"],
    paragraphs: [
      "Customers ask us all the time how a $189 base cabinet at Price-Less can be the same quality as a $419 base cabinet at Lowe&apos;s. The short answer is that the cabinet box itself (the part that does the work) comes from the same factories. The longer answer is more interesting and worth explaining, because it changes how you should think about cabinet shopping in general.",
      "There are maybe a dozen serious cabinet box manufacturers in North America. Conestoga, Wolf, Showplace, Bertch, Kountry Kraft, and a handful of others, most of them sitting in eastern Pennsylvania, Indiana, or northern Wisconsin. These shops have CNC machines, finishing lines, and quality control teams. They build to spec for whoever&apos;s buying, including the big-box brands.",
      "A &lsquo;brand&rsquo; like Hampton Bay or Diamond is mostly a paint scheme and a marketing budget. The underlying box is usually a Conestoga or a Wolf, configured to the brand&apos;s spec sheet. When Home Depot buys 10,000 white shaker base cabinets for a season, they&apos;re ordering them from one of those same factories. The factory builds them, ships them to Home Depot DCs, and the Hampton Bay sticker goes on.",
      "Where we come in: those same factories run overstock. They&apos;ll build to a 10,000-unit order, end up with 11,200, and need to clear the extras. Some get re-routed to wholesale liquidators. We buy from the wholesale liquidators. The cabinet that arrives at our dock has the same box, the same face frame, the same soft-close hinges. It&apos;s just missing the Hampton Bay sticker.",
      "What changes is the warranty channel and the support. Hampton Bay has a customer service line, a returns policy, and they&apos;ll send a replacement door if yours arrives chipped. We don&apos;t have that. If you buy a $189 base cabinet from us and the door is damaged in transit, you&apos;re calling the counter and somebody walks out to the floor to swap it from another unit. That works because we&apos;re a small store. It wouldn&apos;t work for an online retailer.",
      "What doesn&apos;t change is the box quality. The plywood is the same plywood. The face frame is the same maple. The soft-close hinges are Blum or Salice depending on the year. You&apos;re paying for the box, and you&apos;re getting the box.",
      "One genuine difference: the big-box brands typically offer more SKUs in matched sets. If you want to build a full kitchen out of one finish, the big-box has 30 SKUs in that finish and we have 8. That&apos;s why we partner with Builders Corner next door. If you need a full coordinated run, walk through the connecting door and they&apos;ll build it custom. If you just need three bases and a wall, we&apos;ve probably got what you need on the floor right now for half the price.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

const CAT_COLORS = {
  Tips: "bg-amber-100 text-amber-900",
  "Reclaimed Finds": "bg-emerald-100 text-emerald-900",
  "Behind the Counter": "bg-[var(--brand-priceless)]/10 text-[var(--brand-priceless)]",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const shopItems = post.shopSkus
    .map((sku) => findItem(sku))
    .filter((it): it is NonNullable<ReturnType<typeof findItem>> => Boolean(it));

  const otherPosts = Object.values(POSTS).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image src={post.cover} alt={post.title} fill priority className="object-cover" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/40" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-white md:py-32">
          <Link href="/blog" className="text-xs uppercase tracking-wider text-white/80 hover:text-white">
            ← The Price-Less Journal
          </Link>
          <span
            className={
              "mt-5 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider " +
              CAT_COLORS[post.category]
            }
          >
            {post.category}
          </span>
          <h1
            className="font-display mt-4 text-4xl leading-tight md:text-6xl"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <div className="mt-6 flex items-center gap-3 text-sm text-white/85">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-priceless)] font-display text-sm text-white">
              {post.author.split(" ").map((p) => p[0]).join("")}
            </div>
            <div>
              <div className="font-semibold">{post.author}</div>
              <div className="text-xs text-white/70">
                {post.date} · {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <article className="mx-auto max-w-3xl px-6 py-16">
        {post.paragraphs.map((para, i) => (
          <p
            key={i}
            className="mt-6 text-[17px] leading-[1.75] text-[var(--foreground)] first:mt-0"
            dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}
      </article>

      {/* SHOP THE ARTICLE */}
      {shopItems.length > 0 ? (
        <section className="border-y bg-[var(--muted)] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
              Shop the article
            </div>
            <h2 className="font-display mt-2 text-3xl">From the floor right now.</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shopItems.map((it) => (
                <ProductCard key={it.id} item={it} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* AUTHOR */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center gap-5 rounded-2xl border bg-white p-6 shadow-card">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[var(--brand-priceless)] font-display text-2xl text-white">
            {post.author.split(" ").map((p) => p[0]).join("")}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              About the author
            </div>
            <div className="font-display mt-1 text-xl">{post.author}</div>
            <p
              className="mt-1 text-sm text-[var(--muted-foreground)]"
              dangerouslySetInnerHTML={{ __html: post.authorBio }}
            />
          </div>
        </div>
      </section>

      {/* MORE POSTS */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
          Keep reading
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {otherPosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition hover:-translate-y-0.5"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image src={p.cover} alt={p.title} fill className="object-cover transition group-hover:scale-[1.02]" sizes="33vw" />
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
                  {p.category}
                </div>
                <div
                  className="font-display mt-1 text-lg leading-snug"
                  dangerouslySetInnerHTML={{ __html: p.title }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
