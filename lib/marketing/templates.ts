/**
 * Deterministic marketing-copy templates. Generate platform-ready text
 * straight from CatalogItem fields, no AI required. AI rewriting is a
 * later layer that takes these as the baseline.
 *
 * Channels:
 *   - facebook  → Marketplace listing (title + 1500-char body)
 *   - instagram → square-post caption + hashtag stack
 *   - flyer     → printable A6 flyer text (5×7 thermal or 4×6 quarter
 *                  sheet), short headline + bullets + call-to-action
 *   - craigslist → plain-text listing (title + body)
 */
import type { CatalogItem } from "@/lib/items/types";

const CITY = "Wausau, WI";
const STORE = "Price-Less Building Center";
const ADDRESS = "825 Washington St, Wausau, WI";
const PHONE = "(715) 848-3855";

function savings(item: CatalogItem) {
  if (!item.msrp || item.msrp <= item.price) return null;
  const pct = Math.round((1 - item.price / item.msrp) * 100);
  return { msrp: item.msrp, pct };
}

function priceTag(price: number) {
  return price.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
}

function categoryNoun(cat: CatalogItem["category"]) {
  // Singular for headlines.
  return {
    doors: "door",
    windows: "window",
    cabinets: "cabinet",
    vanities: "vanity",
    countertops: "countertop",
    hardware: "hardware",
    lighting: "light fixture",
    trim: "trim run",
  }[cat];
}

export function facebookPost(item: CatalogItem) {
  const s = savings(item);
  const title = `${item.title} – ${priceTag(item.price)}${s ? ` (${s.pct}% off retail)` : ""}`;

  const priceLine = s
    ? `We've got it tagged at ${priceTag(item.price)} — a good bit under the ${priceTag(s.msrp)} you'd pay${item.comparable?.retailer ? ` at ${item.comparable.retailer}` : " new at retail"}, so you're saving right around ${s.pct}%.`
    : `Tagged at ${priceTag(item.price)}.`;

  const specs = [
    item.dimensions ? `Size: ${item.dimensions}` : null,
    item.manufacturer ? `Made by ${item.manufacturer}` : null,
    item.inStock && item.inStock > 1 ? `We have ${item.inStock} of these right now.` : null,
  ].filter(Boolean);

  const paragraphs = [
    item.subtitle || null,
    `This just came in — brand-new surplus from a cancelled contractor order. Still in the box with the full manufacturer warranty.`,
    [priceLine, ...specs].join("\n"),
    `Come take a look. We're at ${ADDRESS}, open Monday through Saturday. Give us a call at ${PHONE} and we'll set one aside for you. (Ask for SKU ${item.sku}.)`,
  ].filter(Boolean);

  return { title, body: paragraphs.join("\n\n") };
}

export function instagramCaption(item: CatalogItem) {
  const s = savings(item);
  const noun = categoryNoun(item.category);
  const hook = s
    ? `${s.pct}% off retail on this ${noun} 👀`
    : `Just hit the floor — ${item.title}.`;

  const paragraphs = [
    hook,
    item.subtitle || null,
    `Brand-new, still in the box, from a cancelled contractor order. ${priceTag(item.price)} on our tag${s ? ` (retails around ${priceTag(s.msrp)})` : ""}.${item.dimensions ? ` ${item.dimensions}.` : ""}`,
    `Come walk it — we're at ${ADDRESS}. DM us or call ${PHONE} and we'll hold it. Mention ${item.sku}.`,
    "#wausau #wausauwi #centralwisconsin #buildingsupplies #surplus #discountbuilding #pricelessbuilding #homerenovation #remodel #budgetrenovation",
  ].filter(Boolean);

  return paragraphs.join("\n\n");
}

export function flyerCopy(item: CatalogItem) {
  const s = savings(item);
  const lines = [
    item.title.toUpperCase(),
    item.subtitle,
    "",
    `${priceTag(item.price)}`,
    s ? `Retail ${priceTag(s.msrp)} · save ${s.pct}%` : null,
    "",
    item.dimensions ?? "",
    item.location ? `Find it: ${item.location}` : "",
    "",
    `Ask any staff member or call ${PHONE}.`,
    `SKU ${item.sku}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export function ebayPost(item: CatalogItem) {
  const s = savings(item);
  // eBay caps listing titles at 80 characters and rewards keyword-rich,
  // no-fluff titles. Lead with manufacturer + title + key spec, then
  // trim to the limit.
  const rawTitle = [item.manufacturer, item.title, item.dimensions]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const title = rawTitle.length > 80 ? `${rawTitle.slice(0, 79).trimEnd()}…` : rawTitle;

  const body = [
    item.title,
    item.subtitle,
    "",
    "Condition: brand-new surplus from a cancelled contractor order — new in the box, with the full manufacturer warranty unless noted.",
    "",
    item.manufacturer ? `Manufacturer: ${item.manufacturer}` : null,
    item.dimensions ? `Dimensions: ${item.dimensions}` : null,
    item.inStock ? `Quantity available: ${item.inStock}` : null,
    `Price: ${priceTag(item.price)}`,
    s ? `Comparable retail: ${priceTag(s.msrp)} (save ${s.pct}%)` : null,
    "",
    `SHIPPING & PICKUP: Local pickup at ${STORE}, ${ADDRESS}. Message us before buying for freight/shipping options on large items.`,
    "",
    `Questions? Call ${PHONE} and reference SKU ${item.sku}.`,
  ]
    .filter(Boolean)
    .join("\n");
  return { title, body };
}

export function craigslistPost(item: CatalogItem) {
  const s = savings(item);
  const title = `${item.title} – ${priceTag(item.price)} (${CITY})`;

  const specLine = [
    `Priced at ${priceTag(item.price)}${s ? ` — these retail around ${priceTag(s.msrp)} new, so that's about ${s.pct}% off.` : "."}`,
    item.dimensions ? `Dimensions: ${item.dimensions}` : null,
    item.manufacturer ? `Manufacturer: ${item.manufacturer}` : null,
  ].filter(Boolean).join("\n");

  const paragraphs = [
    item.subtitle || null,
    `Brand-new and still in the box — surplus from a cancelled contractor order, with the full manufacturer warranty.`,
    specLine,
    `Pickup at our store: ${STORE}, ${ADDRESS}. We're open Monday through Saturday — call ${PHONE} with any questions.`,
    `Listing ref: ${item.sku}`,
  ].filter(Boolean);

  return { title, body: paragraphs.join("\n\n") };
}
