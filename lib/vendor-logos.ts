/**
 * Curated vendor list for the "Brands we carry" wall.
 *
 * Seeded from the 97 brand signages read during the 2026-06-11 store
 * walkthrough, then cleaned by hand: OCR fragments dropped, duplicates
 * merged (e.g. "Bella/Bello Quartz", "Wolf / Wolf Artisan / Wolf Showers"),
 * and a domain attached to every brand we could confidently identify.
 *
 * Logos render via logo.dev when NEXT_PUBLIC_LOGODEV_TOKEN is set (see
 * `logoUrl`); brands with no domain — or whose logo fails to load — fall
 * back to a clean text chip. So this looks right with or without the token.
 */

export interface Vendor {
  name: string;
  domain?: string; // for logo.dev; omit for regional brands with no clean logo
}

// Confident national/regional building-industry brands. Domains hand-verified
// where known; a wrong/missing one simply falls back to a text chip.
export const VENDORS: Vendor[] = [
  // Windows & doors
  { name: "Andersen", domain: "andersenwindows.com" },
  { name: "Marvin", domain: "marvin.com" },
  { name: "JELD-WEN", domain: "jeld-wen.com" },
  { name: "Masonite", domain: "masonite.com" },
  { name: "Pella", domain: "pella.com" },
  { name: "Velux", domain: "velux.com" },
  { name: "Therma-Tru", domain: "thermatru.com" },
  { name: "Steves & Sons", domain: "stevesdoors.com" },
  { name: "Lynden Door", domain: "lyndendoor.com" },
  { name: "Norco", domain: "norcowindows.com" },
  { name: "Semco Windows", domain: "semcowindows.com" },
  { name: "Alcoa", domain: "alcoa.com" },
  { name: "Western Building Products", domain: "westernbp.com" },
  { name: "Premdor" },
  { name: "Vetter" },
  { name: "Magna-Frame" },
  { name: "Dura-Frame" },

  // Cabinets & countertops
  { name: "Wolf Home Products", domain: "wolfhomeproducts.com" },
  { name: "Showplace Cabinetry", domain: "showplacecabinetry.com" },
  { name: "Koch Cabinets", domain: "kochcabinets.com" },
  { name: "Viatera by LX Hausys", domain: "viaterausa.com" },
  { name: "Bella Quartz" },
  { name: "Countryside Cabinetry" },
  { name: "Cut in Stone" },

  // Hardware
  { name: "Schlage", domain: "schlage.com" },
  { name: "Kwikset", domain: "kwikset.com" },
  { name: "Weslock", domain: "weslock.com" },
  { name: "Amerock", domain: "amerock.com" },
  { name: "Blum", domain: "blum.com" },
  { name: "Stanley", domain: "stanleyhardware.com" },
  { name: "Irwin", domain: "irwin.com" },
  { name: "Simpson Strong-Tie", domain: "strongtie.com" },
  { name: "Leviton", domain: "leviton.com" },
  { name: "Loctite", domain: "loctite.com" },
  { name: "Grip-Rite", domain: "grip-rite.com" },
  { name: "Ingersoll-Rand", domain: "ingersollrand.com" },
  { name: "Chamberlain", domain: "chamberlain.com" },
  { name: "M-D Building Products", domain: "mdteam.com" },
  { name: "Soss", domain: "soss.com" },
  { name: "Johnson Hardware", domain: "johnsonhardware.com" },
  { name: "Titan" },
  { name: "AFCO", domain: "afcorailing.com" },
  { name: "Trex", domain: "trex.com" },

  // Plumbing & fixtures
  { name: "Kohler", domain: "kohler.com" },
  { name: "Delta", domain: "deltafaucet.com" },
  { name: "Newport Brass", domain: "newportbrass.com" },
  { name: "Duravit", domain: "duravit.com" },
  { name: "Samuel Heath", domain: "samuel-heath.com" },

  // Lighting
  { name: "Progress Lighting", domain: "progresslighting.com" },
  { name: "Patriot Lighting" },
  { name: "Home Decorators Collection" },

  // Building products
  { name: "Air Vent Inc.", domain: "airvent.com" },
  { name: "Gibraltar Building Products", domain: "gibraltarbuildingproducts.com" },
  { name: "Quikrete", domain: "quikrete.com" },
];

import { VENDOR_LOGOS } from "@/lib/vendor-logo-manifest";

/** URL-safe slug for a vendor name (matches the downloaded logo filenames). */
export function vendorSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Local logo path for a vendor, or null when we have no verified-correct
 * logo for it (those render as a clean text chip instead). Logos were
 * downloaded once into public/vendor-logos/ and hand-QA'd; no runtime token.
 */
export function vendorLogo(name: string): string | null {
  const slug = vendorSlug(name);
  return VENDOR_LOGOS.has(slug) ? `/vendor-logos/${slug}.png` : null;
}
