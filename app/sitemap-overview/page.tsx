import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Section = {
  title: string;
  blurb: string;
  tone: "warm" | "cool" | "neutral";
  links: { href: string; label: string; sub?: string }[];
};

const SECTIONS: Section[] = [
  {
    title: "Price-Less storefront",
    blurb: "Warehouse browsing for everyone. Search, shop, see the floor.",
    tone: "warm",
    links: [
      { href: "/", label: "Home", sub: "Hero, departments, featured, hours" },
      { href: "/shop", label: "Shop all" },
      { href: "/shop/doors", label: "Doors" },
      { href: "/shop/windows", label: "Windows" },
      { href: "/shop/cabinets", label: "Cabinets" },
      { href: "/shop/vanities", label: "Vanities" },
      { href: "/shop/countertops", label: "Countertops" },
      { href: "/shop/hardware", label: "Hardware" },
      { href: "/shop/lighting", label: "Lighting" },
      { href: "/shop/trim", label: "Trim & millwork" },
      { href: "/tour", label: "Virtual tour" },
      { href: "/aisle-map", label: "Aisle map" },
      { href: "/search", label: "Search" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact + hours" },
      { href: "/cart", label: "Cart" },
      { href: "/checkout", label: "Checkout" },
      { href: "/track", label: "Track an order" },
      { href: "/financing", label: "Financing" },
      { href: "/compare", label: "Compare vs. big box" },
      { href: "/contractors", label: "Contractor program" },
      { href: "/reviews", label: "Reviews" },
      { href: "/blog", label: "Blog" },
      { href: "/gift-cards", label: "Gift cards" },
    ],
  },
  {
    title: "Builders Corner studio",
    blurb: "Custom kitchen + bath design, in-house through install.",
    tone: "cool",
    links: [
      { href: "/builders-corner", label: "Home" },
      { href: "/builders-corner/kitchens", label: "Kitchens · real installs" },
      { href: "/builders-corner/baths", label: "Baths · real installs" },
      { href: "/builders-corner/gallery", label: "Real install gallery" },
      { href: "/builders-corner/process", label: "Our process" },
      { href: "/builders-corner/consultation", label: "Book a consultation" },
      { href: "/builders-corner/showroom", label: "Showroom walkthrough" },
      { href: "/builders-corner/door-styles", label: "Door styles" },
      { href: "/builders-corner/finishes", label: "Finishes & hardware" },
      { href: "/builders-corner/shop", label: "Showroom inventory" },
    ],
  },
  {
    title: "Operations dashboard",
    blurb: "Internal tools for the team: inventory, tagging, pricing, channels.",
    tone: "neutral",
    links: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/pos", label: "Register · POS" },
      { href: "/admin/schedule", label: "Schedule" },
      { href: "/admin/inventory", label: "Inventory list" },
      { href: "/admin/inventory/new", label: "Add item" },
      { href: "/admin/receiving", label: "Receiving" },
      { href: "/admin/tags", label: "Print tags" },
      { href: "/admin/pricing-rules", label: "Pricing rules" },
      { href: "/admin/returns", label: "Returns" },
      { href: "/admin/customers", label: "Customers" },
      { href: "/admin/suppliers", label: "Suppliers" },
      { href: "/admin/sales-channels", label: "Sales channels" },
      { href: "/admin/reports", label: "Reports" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

const TONE: Record<Section["tone"], { border: string; chip: string }> = {
  warm: { border: "border-[var(--brand-priceless)]", chip: "bg-[var(--brand-priceless)] text-white" },
  cool: { border: "border-[var(--brand-builders)]", chip: "bg-[var(--brand-builders)] text-white" },
  neutral: { border: "border-slate-700", chip: "bg-slate-800 text-white" },
};

export default function SitemapOverview() {
  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">Project tour</div>
        <h1 className="font-display mt-2 text-3xl md:text-4xl">Everything in this build, one page.</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted-foreground)]">
          Three connected surfaces (the warehouse storefront, the cabinetry studio, and the
          operations dashboard) all running on one inventory.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <div key={s.title} className={`overflow-hidden rounded-2xl border-2 bg-white shadow-card ${TONE[s.tone].border}`}>
              <div className={`px-5 py-4 ${TONE[s.tone].chip}`}>
                <div className="font-display text-lg">{s.title}</div>
                <div className="text-xs text-white/85">{s.blurb}</div>
              </div>
              <ul className="divide-y">
                {s.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block px-5 py-2.5 text-sm hover:bg-[var(--muted)]">
                      <span className="font-semibold">{l.label}</span>
                      {l.sub ? <span className="ml-2 text-xs text-[var(--muted-foreground)]">{l.sub}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-[var(--muted)] p-5 text-sm text-[var(--muted-foreground)]">
          <strong>Tally:</strong> {SECTIONS.reduce((s, x) => s + x.links.length, 0)} pages built across three surfaces, all wired to the
          same `lib/catalog.ts` inventory. Customer-facing routes use `next/image` + Unsplash
          imagery; admin routes are server components with client islands for interactive work
          (cart, POS, receiving, pricing toggles).
        </div>
      </section>
      <SiteFooter brand="priceless" />
    </>
  );
}
