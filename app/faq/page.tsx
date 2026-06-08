import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ADDRESS } from "@/lib/brands";

const HERO = "/real-photos/building-exterior.webp";

interface QA {
  q: string;
  a: string;
}

interface Section {
  id: string;
  title: string;
  kicker: string;
  items: QA[];
}

const SECTIONS: Section[] = [
  {
    id: "shopping",
    kicker: "Section 01",
    title: "Shopping the warehouse",
    items: [
      {
        q: "Is everything new in crate?",
        a: "The vast majority of our inventory is brand-new, in original packaging. Most of it lands here because a contractor cancelled, a builder over-ordered, or a national distributor mis-shipped. Anything that is open-box, scratch-and-dent, or reclaimed is tagged that way on the price card. If it doesn't say otherwise, assume sealed crate.",
      },
      {
        q: "How is pricing decided?",
        a: "Every Tuesday morning, two of us pull up Home Depot, Lowe's, Menards and (when applicable) Amazon for the exact SKU on the floor. Our shelf tag shows our price next to the lowest published competitor price for that same SKU. The math is on the tag. No marketing tricks.",
      },
      {
        q: "Why don't I see prices on your Facebook listings?",
        a: "Facebook Marketplace requires us to message back-and-forth for pricing on certain categories, and honestly, half our Facebook posts are crew snapshots, not formal listings. Anything for sale has a live price tag on the warehouse floor. Call (715) 848-3855 and we'll read the tag to you.",
      },
      {
        q: "Do you accept trade-ins?",
        a: "Occasionally, yes. If you've got a sealed pallet of cabinets, an unopened crate of windows, or quality reclaimed material from a teardown, send photos to the counter and we'll take a look. We don't take used appliances, used flooring, or anything that's been installed.",
      },
      {
        q: "Can I see what's coming in next Wednesday?",
        a: "Our contractor account holders get the drop list every Tuesday afternoon by text. Walk-in customers see what's on the floor when they walk in. We don't publish a public drop calendar because half the inventory sells before it gets a shelf tag.",
      },
      {
        q: "Do you price match?",
        a: "We already publish the big-box price right on our tag, so the answer is usually no. We're almost always already lower. If you find an identical SKU cheaper somewhere else, bring us the listing and we'll take a look.",
      },
    ],
  },
  {
    id: "pickup",
    kicker: "Section 02",
    title: "Pickup & delivery",
    items: [
      {
        q: "Can I hold an item before driving in?",
        a: "Yes. Call the counter or send a message through the contact form. We hold paid items for 72 hours and unpaid will-call holds for 24 hours, no charge. After that we put it back on the floor.",
      },
      {
        q: "Do you ship outside Wisconsin?",
        a: "We don't ship directly. Most of our inventory is too heavy or oversized for parcel carriers to handle without doubling the price. Customers from Minnesota, Michigan UP, northern Illinois and Iowa regularly drive in. If you're more than 90 miles out, call ahead so we can confirm stock and reserve it.",
      },
      {
        q: "Do you deliver?",
        a: "Yes, inside a 60-mile radius of Wausau. Flatbed and box-truck delivery for contractors and homeowners. Same-day delivery if the order is placed before 11 AM. Delivery fee scales with distance and load size. Most local jobs are $75 to $185.",
      },
      {
        q: "Can I rent a truck from you?",
        a: "We don't operate a rental fleet, but the U-Haul dealer two blocks south on Washington Street has truck and trailer pickup options. We'll help you load whatever you rent.",
      },
      {
        q: "Will you help me load?",
        a: "Always. Two of us are on the floor at any time, plus a forklift on the back dock for anything heavy. If you need a tarp or strap, ask the counter and we'll find one.",
      },
    ],
  },
  {
    id: "returns",
    kicker: "Section 03",
    title: "Returns & warranty",
    items: [
      {
        q: "What's your return window?",
        a: "30 days on unopened, undamaged items with the original price tag attached. Custom cuts, ordered-in product, and reclaimed material are final sale. Full policy on our returns page.",
      },
      {
        q: "What if my door arrives damaged?",
        a: "Inspect every door, window and cabinet on the floor before you load. Once it leaves our dock, we can't take damage claims unless it's manufacturer defect (and most manufacturers warranty 1 to 10 years depending on product). We'll help you file the claim.",
      },
      {
        q: "Do your products carry a warranty?",
        a: "Most do. The same factory warranty that comes with the SKU at the big-box store. We're a discount channel, not a refurbisher. Bring us your receipt and we'll point you at the manufacturer's claim process.",
      },
      {
        q: "Can I return Builders Corner custom work?",
        a: "Custom kitchens, baths and cabinetry through Builders Corner are non-returnable once the design is approved and material is ordered. That's how all custom cabinet shops work. We do offer a complimentary revision round before fabrication starts.",
      },
    ],
  },
  {
    id: "contractor",
    kicker: "Section 04",
    title: "Contractor accounts",
    items: [
      {
        q: "How do I open a contractor account?",
        a: "Submit the form on the contractors page. We verify your trade license and one reference, then open the account, usually same day. No fees, no annual dues.",
      },
      {
        q: "What does net-30 actually mean?",
        a: "Everything you charge in a calendar month rolls onto a single invoice. We email it on the 1st, payment is due by the 30th. Pay by check, ACH or card. No surcharges on ACH.",
      },
      {
        q: "Can my crew charge to my account?",
        a: "Yes. You can authorize up to five named individuals on your account. We check ID at the counter against the authorized list, then it bills to you.",
      },
      {
        q: "Do you offer volume discounts?",
        a: "Our floor pricing is already 40–60% below the big-box, so we don't layer additional volume discounts on top. What contractors get is priority access: Tuesday drop lists, will-call lockers, after-hours load-out, and 60-mile delivery.",
      },
      {
        q: "Can I get a copy of an old invoice?",
        a: "All invoices are stored in your account portal indefinitely. Need one from before 2022? Call the counter, we'll dig it out of the file cabinet.",
      },
    ],
  },
];

export const metadata = {
  title: "FAQ · Price-Less Building Center",
  description:
    "Answers to the questions we hear most often at the counter: shopping, pickup, returns, warranty and contractor accounts.",
};

export default function FAQPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image src={HERO} alt="Warehouse aisle on a Wednesday morning" fill priority className="object-cover" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/35" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-white md:py-28">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
            The counter answers
          </div>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            FREQUENTLY ASKED.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
            Twenty-something questions we hear every week at the counter. If yours isn't here, call
            us at {ADDRESS.phone}. Somebody who can actually answer it will pick up.
          </p>
        </div>
      </section>

      {/* JUMP NAV */}
      <section className="border-b bg-[var(--muted)]">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-6 py-5 text-sm">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border bg-white px-4 py-2 font-medium text-[var(--brand-priceless)] hover:bg-[var(--brand-priceless)] hover:text-white"
            >
              {s.title}
            </a>
          ))}
        </div>
      </section>

      {/* SECTIONS */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        {SECTIONS.map((s) => (
          <div key={s.id} id={s.id} className="scroll-mt-24 pb-14">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
              {s.kicker}
            </div>
            <h2 className="font-display mt-2 text-3xl md:text-4xl">{s.title}</h2>
            <div className="mt-8 divide-y rounded-2xl border bg-white shadow-card">
              {s.items.map((qa, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-5 hover:bg-[var(--muted)]/40">
                    <span className="font-display text-lg leading-snug">{qa.q}</span>
                    <span
                      className="mt-1 shrink-0 text-[var(--brand-priceless)] transition group-open:rotate-180"
                      aria-hidden
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {qa.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* STILL STUCK */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid items-center gap-6 rounded-2xl bg-[var(--brand-priceless)] p-10 text-white md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Didn't see your question?</h2>
            <p className="mt-2 text-white/85">
              Call the counter or stop by. {ADDRESS.street}, {ADDRESS.city}. We're here Wed–Sat.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <a href="tel:+17158483855" className="btn bg-white text-[var(--brand-priceless)]">
              Call {ADDRESS.phone}
            </a>
            <Link href="/contact" className="btn btn-outline border-white/50 bg-transparent text-white">
              Send a message
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
