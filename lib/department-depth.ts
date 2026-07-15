/**
 * Conservative floor-depth headlines for each shop department.
 *
 * Numbers come from `STORE_SHOWCASE` (walkthrough emit — de-overlapped and
 * rounded down). These advertise real warehouse depth, not fake SKU counts.
 * Selection is approximate: surplus moves weekly.
 */
import { STORE_SHOWCASE, type Collection } from "@/lib/store-showcase";
import type { Category } from "@/lib/items/types";

export type DepartmentDepth = {
  /** Short punchy line for mosaic tiles / heroes — e.g. "800+ doors" */
  headline: string;
  /** Longer supporting line under the headline */
  detail: string;
  /** Sum of showcase approx integers for this department, or null */
  approxTotal: number | null;
};

/** Map shop category keys → STORE_SHOWCASE department names. */
const SHOWCASE_KEYS: Record<Category, string[]> = {
  doors: ["Doors"],
  windows: ["Windows"],
  cabinets: ["Cabinets"],
  vanities: ["Vanities"],
  countertops: ["Countertops"],
  hardware: ["Hardware"],
  lighting: ["Lighting"],
  // Stair parts live under Railing in the showcase; shop folds them into trim.
  trim: ["Trim & Molding", "Railing"],
};

function parseApprox(approx: string): number {
  const m = approx.replace(/,/g, "").match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

function collectionsFor(category: Category): Collection[] {
  return SHOWCASE_KEYS[category].flatMap((k) => STORE_SHOWCASE[k] ?? []);
}

function sumApprox(cols: Collection[]): number {
  return cols.reduce((n, c) => n + parseApprox(c.approx), 0);
}

function formatCount(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 100) * 100}+`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (n >= 100) return `${Math.floor(n / 50) * 50}+`;
  if (n >= 20) return `${Math.floor(n / 10) * 10}+`;
  return n > 0 ? `${n}+` : "";
}

/** Curated marketing nouns that read well after a count. */
const NOUN: Record<Category, string> = {
  doors: "doors",
  windows: "windows",
  cabinets: "cabinets",
  vanities: "vanities",
  countertops: "slabs",
  hardware: "hardware pieces",
  lighting: "fixtures",
  trim: "trim & millwork pieces",
};

const DETAIL: Record<Category, string> = {
  doors:
    "Nearly a thousand on the floor — interior slabs from about $25–$50, pre-hungs, exterior & patio, bifolds, and premium one-of-a-kind glass finds.",
  windows:
    "Casement, double-hung, wood-framed & specialty shapes — new-in-box JELD-WEN, Andersen, Thermo-Tech and more.",
  cabinets:
    "12\" uppers, 24\" bases, pantry & door parts — surplus stock through Builders Corner custom kitchen runs.",
  vanities:
    "18\" and 21\" baths up through 72\" doubles — floor models, cultured-marble tops, and vessel sinks ready to install.",
  countertops:
    "Butcher block by the stack, laminate remnants, quartz and granite — the deals shoppers rave about.",
  hardware:
    "Hundreds of locksets, pulls, hinges, and fasteners — Schlage, Kwikset, Amerock, GRK, new-in-box overstock.",
  lighting:
    "Chandeliers, pendants, vanity bars, and ceiling fans hanging across the warehouse — statement pieces to workhorse fixtures.",
  trim:
    "Casing, base, crown, dowels, newels & balusters — thousands of feet and pieces, primed and ready.",
};

function buildDepth(category: Category): DepartmentDepth {
  const cols = collectionsFor(category);
  const total = sumApprox(cols);
  const count = formatCount(total);
  // Curated punch lines where the walkthrough math supports big depth claims.
  const curated: Partial<Record<Category, string>> = {
    doors: "Nearly 1,000 doors",
    windows: "600+ windows",
    trim: "2,000+ trim & millwork pieces",
    hardware: "800+ hardware pieces",
  };
  return {
    headline: curated[category] ?? (count ? `${count} ${NOUN[category]}` : CATEGORY_FALLBACK[category]),
    detail: DETAIL[category],
    approxTotal: total > 0 ? total : null,
  };
}

const CATEGORY_FALLBACK: Record<Category, string> = {
  doors: "Doors on the floor",
  windows: "Windows on the floor",
  cabinets: "Cabinets on the floor",
  vanities: "Vanities on the floor",
  countertops: "Countertops on the floor",
  hardware: "Hardware on the floor",
  lighting: "Lighting on the floor",
  trim: "Trim on the floor",
};

export const DEPARTMENT_DEPTH: Record<Category, DepartmentDepth> = {
  doors: buildDepth("doors"),
  windows: buildDepth("windows"),
  cabinets: buildDepth("cabinets"),
  vanities: buildDepth("vanities"),
  countertops: buildDepth("countertops"),
  hardware: buildDepth("hardware"),
  lighting: buildDepth("lighting"),
  trim: buildDepth("trim"),
};

/** Showcase collections for a shop category (for type-level depth chips). */
export function depthCollections(category: Category): Collection[] {
  return collectionsFor(category);
}
