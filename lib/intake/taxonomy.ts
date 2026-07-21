/**
 * Taxonomy: the departments, their subcategories, and the specs each tracks.
 *
 * This module is CLIENT-SAFE (no server-only imports). It holds the DEFAULT
 * taxonomy and PURE helpers. Every helper takes the taxonomy as an optional
 * argument, defaulting to the defaults, so:
 *   - server code passes the live (editable) taxonomy from lib/taxonomy-server
 *   - client code passes the taxonomy it fetched from /api/taxonomy
 * and both share the exact same lookup logic.
 *
 * The 13 departments (ids, prefixes, icons) are fixed; each department's
 * subcategories and specs are what staff can edit and persist.
 */
import type { CategoryId } from "./types";

export interface Subcategory {
  id: string;
  label: string;
  prefix: string;
}

export interface SpecDef {
  key: string;
  label: string;
  hint?: string;
  /** Preset values staff can tap to fill this spec instead of typing.
   *  Editable per department; empty/undefined = free text only. */
  options?: string[];
}

export interface Category {
  id: CategoryId;
  label: string;
  prefix: string;
  /** Lucide icon name, rendered in the picker. */
  icon: string;
  subcategories: Subcategory[];
  specs: SpecDef[];
  /** Uploaded photo filename for this department's tile (overrides stock). */
  thumbnail?: string;
  /** True for a staff-added department (deletable); absent for built-ins. */
  custom?: boolean;
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "doors", label: "Doors", prefix: "DR", icon: "DoorOpen",
    subcategories: [
      { id: "exterior", label: "Exterior", prefix: "EXT" },
      { id: "interior", label: "Interior", prefix: "INT" },
      { id: "prehung", label: "Pre-Hung", prefix: "PRE" },
      { id: "slab", label: "Slab", prefix: "SLB" },
      { id: "patio", label: "Patio / Sliding", prefix: "PAT" },
      { id: "storm", label: "Storm / Screen", prefix: "STM" },
      { id: "barn", label: "Barn", prefix: "BRN" },
    ],
    specs: [
      { key: "width", label: "Width", hint: '30", 32", 36"', options: ['24"', '28"', '30"', '32"', '36"'] },
      { key: "height", label: "Height", hint: '80", 96"', options: ['80"', '84"', '96"'] },
      { key: "thickness", label: "Thickness", hint: '1-3/8", 1-3/4"', options: ['1-3/8"', '1-3/4"'] },
      { key: "handing", label: "Handing", hint: "Left, Right, Reversible", options: ["Left", "Right", "Reversible"] },
      { key: "material", label: "Material", hint: "Steel, Fiberglass, Wood, MDF", options: ["Steel", "Fiberglass", "Wood", "MDF", "Composite"] },
      { key: "glass", label: "Glass / Lite", hint: "4-lite, Half, Full, None", options: ["None", "Half", "Full", "4-Lite", "6-Lite", "15-Lite"] },
    ],
  },
  {
    id: "windows", label: "Windows", prefix: "WN", icon: "AppWindow",
    subcategories: [
      { id: "double-hung", label: "Double-Hung", prefix: "DH" },
      { id: "casement", label: "Casement", prefix: "CAS" },
      { id: "picture", label: "Picture / Fixed", prefix: "PIC" },
      { id: "slider", label: "Slider", prefix: "SLD" },
      { id: "awning", label: "Awning", prefix: "AWN" },
      { id: "specialty", label: "Specialty", prefix: "SPC" },
    ],
    specs: [
      { key: "width", label: "Width", hint: '24", 36"' },
      { key: "height", label: "Height", hint: '36", 48"' },
      { key: "frame", label: "Frame Material", hint: "Vinyl, Wood, Aluminum", options: ["Vinyl", "Wood", "Aluminum", "Fiberglass", "Composite"] },
      { key: "glazing", label: "Glazing", hint: "Double-pane, Triple-pane", options: ["Single-pane", "Double-pane", "Triple-pane"] },
      { key: "color", label: "Color", hint: "White, Black, Tan", options: ["White", "Black", "Tan", "Almond", "Bronze"] },
    ],
  },
  {
    id: "cabinets", label: "Cabinets", prefix: "CB", icon: "Package",
    subcategories: [
      { id: "wall", label: "Wall", prefix: "WAL" },
      { id: "base", label: "Base", prefix: "BAS" },
      { id: "tall", label: "Tall / Pantry", prefix: "TAL" },
      { id: "vanity-cab", label: "Vanity Cabinet", prefix: "VAN" },
      { id: "island", label: "Island", prefix: "ISL" },
      { id: "accent", label: "Accent / Over-Toilet", prefix: "ACC" },
    ],
    specs: [
      { key: "width", label: "Width", hint: '12", 24", 36"' },
      { key: "height", label: "Height", hint: '30", 36"' },
      { key: "depth", label: "Depth", hint: '12" upper, 24" lower', options: ['12"', '24"'] },
      { key: "doorStyle", label: "Door Style", hint: "Shaker, Raised Panel, Flat", options: ["Shaker", "Raised Panel", "Flat / Slab", "Beadboard", "Glass"] },
      { key: "finish", label: "Finish / Color", hint: "White, Gray, Espresso", options: ["White", "Gray", "Espresso", "Natural Oak", "Cherry", "Maple", "Painted"] },
    ],
  },
  {
    id: "vanities", label: "Vanities & Tops", prefix: "VT", icon: "Bath",
    subcategories: [
      { id: "vanity", label: "Vanity", prefix: "VAN" },
      { id: "vanity-top", label: "Vanity Top", prefix: "TOP" },
      { id: "combo", label: "Vanity + Top Combo", prefix: "CMB" },
    ],
    specs: [
      { key: "width", label: "Width", hint: '24" to 72"' },
      { key: "depth", label: "Depth", hint: '21" typical, 18"', options: ['21"', '18"', '24"'] },
      { key: "topMaterial", label: "Top Material", hint: "Quartz, Cultured Marble, None" },
      { key: "sink", label: "Sink", hint: "Single, Double, No sink" },
      { key: "faucetHoles", label: "Faucet Holes", hint: "1-hole, 3-hole (8in spread)" },
    ],
  },
  {
    id: "countertops", label: "Countertops", prefix: "CT", icon: "Layers",
    subcategories: [
      { id: "butcher-block", label: "Butcher Block", prefix: "BLK" },
      { id: "quartz", label: "Quartz", prefix: "QTZ" },
      { id: "granite", label: "Granite", prefix: "GRN" },
      { id: "laminate", label: "Laminate", prefix: "LAM" },
      { id: "remnant", label: "Remnant", prefix: "RMN" },
    ],
    specs: [
      { key: "length", label: "Length", hint: '25", 8 ft' },
      { key: "width", label: "Width", hint: '22", 25"' },
      { key: "thickness", label: "Thickness", hint: '3/4", 1-1/2"' },
      { key: "edge", label: "Edge Profile", hint: "Square, Bullnose, Ogee" },
      { key: "color", label: "Color / Pattern", hint: "White, Oak, Speckled" },
    ],
  },
  {
    id: "sinks", label: "Sinks", prefix: "SK", icon: "Droplets",
    subcategories: [
      { id: "vessel", label: "Vessel", prefix: "VES" },
      { id: "drop-in", label: "Drop-In", prefix: "DRP" },
      { id: "undermount", label: "Undermount", prefix: "UND" },
      { id: "farmhouse", label: "Farmhouse / Apron", prefix: "FRM" },
      { id: "kitchen", label: "Kitchen", prefix: "KIT" },
      { id: "utility", label: "Utility / Salvage", prefix: "UTL" },
    ],
    specs: [
      { key: "mount", label: "Mount", hint: "Vessel, Drop-in, Undermount, Farmhouse" },
      { key: "dimensions", label: "Dimensions", hint: "L x W, or diameter" },
      { key: "material", label: "Material", hint: "Vitreous China, Stainless, Cast Iron" },
      { key: "bowls", label: "Bowls", hint: "Single, Double" },
      { key: "color", label: "Color", hint: "White, Cream, Black" },
    ],
  },
  {
    id: "faucets", label: "Faucets", prefix: "FC", icon: "ShowerHead",
    subcategories: [
      { id: "bathroom", label: "Bathroom", prefix: "BTH" },
      { id: "kitchen", label: "Kitchen", prefix: "KIT" },
      { id: "vessel-faucet", label: "Vessel / Tall", prefix: "VES" },
      { id: "widespread", label: "Widespread", prefix: "WSP" },
      { id: "shower", label: "Shower / Tub", prefix: "SHW" },
    ],
    specs: [
      { key: "finish", label: "Finish", hint: "Chrome, Brushed Nickel, Matte Black", options: ["Chrome", "Brushed Nickel", "Matte Black", "Brushed Gold", "Oil-Rubbed Bronze", "Polished Brass"] },
      { key: "handles", label: "Handles", hint: "Single, Double", options: ["Single", "Double"] },
      { key: "mount", label: "Mount", hint: "Deck, Wall, Widespread", options: ["Deck", "Wall", "Widespread", "Centerset"] },
      { key: "holes", label: "Holes Required", hint: "1, 3", options: ["1", "3"] },
    ],
  },
  {
    id: "plumbing", label: "Plumbing", prefix: "PL", icon: "Wrench",
    subcategories: [
      { id: "toilet", label: "Toilet", prefix: "TLT" },
      { id: "tub", label: "Tub", prefix: "TUB" },
      { id: "shower-base", label: "Shower Base / Surround", prefix: "SHB" },
      { id: "fittings", label: "Fittings / Valves", prefix: "FIT" },
    ],
    specs: [
      { key: "dimensions", label: "Dimensions", hint: "H x W x D" },
      { key: "color", label: "Color", hint: "White, Biscuit, Bone" },
      { key: "roughIn", label: "Rough-In", hint: '12" (toilets)' },
    ],
  },
  {
    id: "lighting", label: "Lighting", prefix: "LT", icon: "Lightbulb",
    subcategories: [
      { id: "chandelier", label: "Chandelier", prefix: "CHN" },
      { id: "pendant", label: "Pendant", prefix: "PND" },
      { id: "vanity-bar", label: "Vanity Bar", prefix: "VBR" },
      { id: "sconce", label: "Sconce", prefix: "SCN" },
      { id: "flush-mount", label: "Flush / Semi-Flush", prefix: "FLM" },
      { id: "recessed", label: "Recessed / Can", prefix: "RCN" },
      { id: "ceiling-fan", label: "Ceiling Fan", prefix: "FAN" },
    ],
    specs: [
      { key: "lights", label: "Number of Lights", hint: "1, 5, 6" },
      { key: "diameter", label: "Width / Diameter", hint: '24", 30"' },
      { key: "finish", label: "Finish", hint: "Nickel, Bronze, Black, Brass" },
      { key: "bulb", label: "Bulb / Base", hint: "E12 candelabra, E26, LED" },
      { key: "mount", label: "Mount", hint: "Hanging, Flush, Recessed" },
    ],
  },
  {
    id: "hardware", label: "Hardware", prefix: "HW", icon: "Bolt",
    subcategories: [
      { id: "pulls", label: "Pulls / Knobs", prefix: "PUL" },
      { id: "hinges", label: "Hinges", prefix: "HNG" },
      { id: "locksets", label: "Locksets / Handles", prefix: "LCK" },
      { id: "brackets", label: "Brackets / Slides", prefix: "BKT" },
      { id: "fasteners", label: "Fasteners", prefix: "FST" },
    ],
    specs: [
      { key: "finish", label: "Finish", hint: "Brass, Nickel, Black, Chrome" },
      { key: "size", label: "Size", hint: '3" center-to-center, 1-1/4" knob' },
      { key: "material", label: "Material", hint: "Zinc, Steel, Solid Brass" },
      { key: "packQty", label: "Pack Qty", hint: "Each, 10-pack, 25-pack" },
    ],
  },
  {
    id: "trim", label: "Trim & Millwork", prefix: "TM", icon: "Ruler",
    subcategories: [
      { id: "casing", label: "Casing", prefix: "CAS" },
      { id: "base", label: "Base", prefix: "BAS" },
      { id: "crown", label: "Crown", prefix: "CRN" },
      { id: "moulding", label: "Moulding", prefix: "MLD" },
      { id: "columns", label: "Columns / Posts", prefix: "COL" },
    ],
    specs: [
      { key: "profile", label: "Profile", hint: "Colonial, Craftsman, Clamshell" },
      { key: "dimensions", label: "Dimensions", hint: '3/4" x 3-1/2"' },
      { key: "length", label: "Length", hint: '8 ft, 16 ft' },
      { key: "material", label: "Material", hint: "MDF, Pine, Oak, PVC" },
      { key: "finish", label: "Finish", hint: "Primed, Bare, Stained" },
    ],
  },
  {
    id: "paint", label: "Paint & Finishes", prefix: "PT", icon: "PaintBucket",
    subcategories: [
      { id: "interior-paint", label: "Interior Paint", prefix: "INT" },
      { id: "exterior-paint", label: "Exterior Paint", prefix: "EXT" },
      { id: "stain", label: "Stain / Sealer", prefix: "STN" },
      { id: "primer", label: "Primer", prefix: "PRM" },
      { id: "supplies", label: "Supplies", prefix: "SUP" },
    ],
    specs: [
      { key: "color", label: "Color", hint: "Name / code on can" },
      { key: "sheen", label: "Sheen", hint: "Flat, Eggshell, Satin, Semi-Gloss", options: ["Flat / Matte", "Eggshell", "Satin", "Semi-Gloss", "Gloss"] },
      { key: "size", label: "Size", hint: "Quart, Gallon, 5-Gallon", options: ["Sample", "Quart", "Gallon", "5-Gallon"] },
      { key: "base", label: "Base / Type", hint: "Latex, Oil, Primer", options: ["Latex", "Oil", "Primer", "Acrylic"] },
    ],
  },
  {
    id: "other", label: "Other / Misc", prefix: "MS", icon: "Boxes",
    subcategories: [{ id: "misc", label: "Miscellaneous", prefix: "GEN" }],
    specs: [],
  },
];

/* ---- pure helpers (take the taxonomy; default to DEFAULT_CATEGORIES) ---- */

export function getCategory(id: string, cats: Category[] = DEFAULT_CATEGORIES): Category | undefined {
  return cats.find((c) => c.id === id);
}

export function getSubcategory(
  categoryId: string,
  subId: string | undefined,
  cats: Category[] = DEFAULT_CATEGORIES,
): Subcategory | undefined {
  if (!subId) return undefined;
  return getCategory(categoryId, cats)?.subcategories.find((s) => s.id === subId);
}

export function categoryLabel(id: string, cats: Category[] = DEFAULT_CATEGORIES): string {
  return getCategory(id, cats)?.label ?? id;
}

export function subcategoryLabel(
  categoryId: string,
  subId: string | undefined,
  cats: Category[] = DEFAULT_CATEGORIES,
): string | undefined {
  return getSubcategory(categoryId, subId, cats)?.label;
}

export function getSpecs(categoryId: string, cats: Category[] = DEFAULT_CATEGORIES): SpecDef[] {
  return getCategory(categoryId, cats)?.specs ?? [];
}
