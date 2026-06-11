// AUTO-GENERATED from the 2026-06-11 store walkthrough catalog.
// Source: tools/x5-frames/emit_inventory_ts.py — do not hand-edit.
// Prices are real values read off in-store tags; ranges skip messy
// multi-price boards. 'selection' is a breadth signal, not a unit count.

export interface InventoryType {
  name: string;
  priceLow: number | null;
  priceHigh: number | null;
  seenPrices: string[];
  selection: "extensive" | "good" | "limited" | "few";
  brands: string[];
}
export interface DepartmentInventory {
  types: InventoryType[];
  brands: string[];
}

export const WALKTHROUGH_INVENTORY: Record<string, DepartmentInventory> = {
  doors: {
    types: [
      {"name": "Glass-panel door", "priceLow": 140, "priceHigh": 425, "seenPrices": ["$140.00", "$425.00"], "selection": "extensive", "brands": ["Badger"]},
      {"name": "Door frame / jamb", "priceLow": 90, "priceHigh": 425, "seenPrices": ["$100.00", "$120.00", "$425", "$90.00"], "selection": "extensive", "brands": ["Dura-Frame", "Western", "Western Building Products"]},
      {"name": "Interior door", "priceLow": 25, "priceHigh": 182, "seenPrices": ["$165.00", "$182.00", "$25.00", "$40.00", "$42.00", "$59.00"], "selection": "extensive", "brands": ["Badger", "Masonite", "Premdor"]},
      {"name": "Door slab (unfinished)", "priceLow": 25, "priceHigh": 130, "seenPrices": ["$105.00", "$130.00", "$25.00", "$28.00", "$40.00", "$53.00"], "selection": "extensive", "brands": ["Badger", "Global Point", "Integra", "Premdor", "Western"]},
      {"name": "Bifold door", "priceLow": 40, "priceHigh": 42, "seenPrices": ["$40.00", "$42.00"], "selection": "extensive", "brands": ["Lynden Door", "Maywood", "Premdor", "Steves"]},
      {"name": "Exterior door", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": ["Badger", "Dura-Frame", "Manion'S"]},
      {"name": "Prehung door", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": ["Badger", "Dura-Frame", "Global Point", "Masonite", "Shuster'S", "Western"]},
      {"name": "Patio / sliding door", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": ["Andersen", "Jeld-Wen"]},
    ],
    brands: ["Andersen", "Badger", "Dura-Frame", "Global Point", "Integra", "Jeld-Wen", "Lynden Door", "Manion'S", "Masonite", "Maywood", "Premdor", "Shuster'S", "Steves", "Western", "Western Building Products"],
  },
  windows: {
    types: [
      {"name": "Window unit", "priceLow": 99, "priceHigh": 1412, "seenPrices": ["$1,412", "$1412", "$400", "$590", "$99", "300"], "selection": "extensive", "brands": ["Alcoa", "Alliance", "Andersen", "Classic", "Frontline", "Jeld-Wen", "Polaris", "Semco", "Shrink-It", "Velux"]},
      {"name": "Casement / vinyl window", "priceLow": 129, "priceHigh": 590, "seenPrices": ["$129", "$300", "$590"], "selection": "extensive", "brands": ["Alcoa", "Jeld-Wen", "Thermo-Tech", "Velux"]},
      {"name": "Arched / round window", "priceLow": 500, "priceHigh": 500, "seenPrices": ["500"], "selection": "extensive", "brands": ["Jeld-Wen", "Magna-Frame", "Vetter"]},
      {"name": "Wood-framed window", "priceLow": 129, "priceHigh": 150, "seenPrices": ["$129", "$139", "$150"], "selection": "good", "brands": ["Norco"]},
      {"name": "Double-hung window", "priceLow": 79, "priceHigh": 139, "seenPrices": ["$139", "$79.00"], "selection": "extensive", "brands": ["Alcoa", "Andersen", "Badger", "Jeld-Wen", "Polaris"]},
      {"name": "Window (wrapped/new)", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": ["Jeld-Wen"]},
    ],
    brands: ["Alcoa", "Alliance", "Andersen", "Badger", "Classic", "Frontline", "Jeld-Wen", "Magna-Frame", "Norco", "Polaris", "Semco", "Shrink-It", "Thermo-Tech", "Velux", "Vetter"],
  },
  cabinets: {
    types: [
      {"name": "Cabinet (assorted)", "priceLow": 30, "priceHigh": 1842, "seenPrices": ["$135", "$1842", "30"], "selection": "extensive", "brands": ["Countryside Cabinetry", "Countryside Cabinets", "Wolf"]},
      {"name": "Pantry / tall cabinet", "priceLow": 1842, "priceHigh": 1842, "seenPrices": ["$1842"], "selection": "extensive", "brands": []},
      {"name": "Wall cabinet", "priceLow": 75, "priceHigh": 135, "seenPrices": ["$135", "$75.00"], "selection": "extensive", "brands": []},
      {"name": "Cabinet door / part", "priceLow": 99, "priceHigh": 129, "seenPrices": ["$129", "$99.00"], "selection": "extensive", "brands": ["Koch Cabinets", "Showplace", "Wolf", "Wolf Artisan"]},
      {"name": "Base cabinet", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": ["Bella Quartz"]},
    ],
    brands: ["Bella Quartz", "Countryside Cabinetry", "Countryside Cabinets", "Koch Cabinets", "Showplace", "Wolf", "Wolf Artisan"],
  },
  vanities: {
    types: [
      {"name": "Vanity top w/ sink", "priceLow": 149, "priceHigh": 149, "seenPrices": ["$149.00"], "selection": "extensive", "brands": []},
      {"name": "Vanity base cabinet", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": []},
    ],
    brands: [],
  },
  countertops: {
    types: [
      {"name": "Granite / stone countertop", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": ["Cut In Stone", "Cut In Stone Llc"]},
      {"name": "Laminate countertop", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "good", "brands": []},
      {"name": "Quartz countertop / sample", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "good", "brands": ["Bella Quartz", "Bello Quartz", "Viatera", "Viatera By Lx Hausys"]},
      {"name": "Countertop (assorted)", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "good", "brands": ["Curated By Carstin"]},
      {"name": "Butcher block / wood top", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "good", "brands": []},
    ],
    brands: ["Bella Quartz", "Bello Quartz", "Curated By Carstin", "Cut In Stone", "Cut In Stone Llc", "Viatera", "Viatera By Lx Hausys"],
  },
  hardware: {
    types: [
      {"name": "Hardware (assorted)", "priceLow": 18, "priceHigh": 99, "seenPrices": ["$1.00/ea", "$17.99", "25\u00a2 Each", "50\u00a2", "50\u00a2 EACH", "75\u00a2"], "selection": "extensive", "brands": ["Blum", "Cox", "Dor-O-Matic", "Irwin", "Ives", "Johnson", "Johnson Hardware", "Lawrence", "Soss", "Ultra"]},
      {"name": "Garage door parts", "priceLow": 75, "priceHigh": 75, "seenPrices": [".75", ".75 ea", ".75/EA", ".75\u00a2/EA", ".75\u00a2/Ea", "75\u00a2/ea"], "selection": "good", "brands": []},
      {"name": "Lockset / door hardware", "priceLow": 2, "priceHigh": 69, "seenPrices": ["$1.00 ea / 6 for $5.00", "$1.50 EA", "$12.00", "$12.99", "$14.99", "$15.00"], "selection": "extensive", "brands": ["Amerock", "Design House", "Home Collection", "Ideal", "Ideal Security", "Kwikset", "Lockset", "Schlage", "Titan", "Viking", "Weiser Lock", "Weser Lock", "Weslock"]},
      {"name": "Electrical box / parts", "priceLow": 2, "priceHigh": 50, "seenPrices": ["$1.99", "$10.00", "$12.50", "$12.95", "$14.40", "$15.00"], "selection": "extensive", "brands": ["Air Vent Inc.", "Andersen", "Chamberlain", "Dor-O-Matic", "Dynaflex", "Gibraltar", "Gibraltar Industries", "Grip-Rite", "Grk", "Ingersoll-Rand", "Interchange", "Irwin", "Ives", "Kwikset", "Lawrence", "Lawrence Brothers Inc.", "Leviton", "Loctite", "Slater", "Soss", "Stanley", "The Anchor Center", "Titan", "Triangle Mfg. Co.", "Viking", "We Build America", "Wisconsin Screw Products"]},
      {"name": "Railing / handrail", "priceLow": 1, "priceHigh": 50, "seenPrices": ["$1.00", "$1.50 ea", "$4.00 EA", "50\u00a2", "BALUSTER PRICE $"], "selection": "extensive", "brands": ["Afco", "Chamberlain", "Trex Signature"]},
      {"name": "Cabinet pulls / knobs", "priceLow": 1, "priceHigh": 50, "seenPrices": ["$1.00 Pair", "$2.00 Each", "$2.50", "39\u00a2 each", "50\u00a2", "50\u00a2 Each"], "selection": "good", "brands": ["Amerock"]},
    ],
    brands: ["Afco", "Air Vent Inc.", "Amerock", "Andersen", "Blum", "Chamberlain", "Cox", "Design House", "Dor-O-Matic", "Dynaflex", "Gibraltar", "Gibraltar Industries", "Grip-Rite", "Grk", "Home Collection", "Ideal", "Ideal Security", "Ingersoll-Rand", "Interchange", "Irwin", "Ives", "Johnson", "Johnson Hardware", "Kwikset", "Lawrence", "Lawrence Brothers Inc.", "Leviton", "Lockset", "Loctite", "Schlage", "Slater", "Soss", "Stanley", "The Anchor Center", "Titan", "Trex Signature", "Triangle Mfg. Co.", "Ultra", "Viking", "We Build America", "Weiser Lock", "Weser Lock", "Weslock", "Wisconsin Screw Products"],
  },
  lighting: {
    types: [
      {"name": "Chandelier", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": []},
      {"name": "Light fixture (assorted)", "priceLow": null, "priceHigh": null, "seenPrices": ["$2.75 EACH", "$2.75 each"], "selection": "extensive", "brands": ["Design Classics", "Patriot Lighting", "Progress Lighting", "Thomas", "Utilitech"]},
      {"name": "Pendant light", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": ["Home Decorators Collection", "Patriot Lighting"]},
      {"name": "Ceiling fan", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": []},
      {"name": "Vanity / bath light", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "good", "brands": ["Patriot Lighting"]},
      {"name": "Ceiling / hanging fixture", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "good", "brands": []},
    ],
    brands: ["Design Classics", "Home Decorators Collection", "Patriot Lighting", "Progress Lighting", "Thomas", "Utilitech"],
  },
  trim: {
    types: [
      {"name": "Trim / molding profile", "priceLow": 4, "priceHigh": 79, "seenPrices": ["$15/each", "$18/each", "$3.00/ft", "$30/each", "$79", "32\u00a2/ft"], "selection": "extensive", "brands": ["Asd", "Badger", "Frontline Bldg. Products Inc.", "The Temple Company"]},
      {"name": "Baluster / spindle", "priceLow": 5, "priceHigh": 39, "seenPrices": ["$35", "$39", "$5.00 EACH HEAVY METAL DECORATIVE, $3.00 EACH LIGHT WEIGHT HOLLOW", "1.00 each", "4.89"], "selection": "extensive", "brands": []},
      {"name": "Newel post", "priceLow": 39, "priceHigh": 39, "seenPrices": ["$39", "$39.00"], "selection": "extensive", "brands": []},
      {"name": "Molding (assorted)", "priceLow": null, "priceHigh": null, "seenPrices": ["$0.88/ft"], "selection": "extensive", "brands": []},
      {"name": "Crown / profile molding", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "extensive", "brands": []},
      {"name": "Base shoe molding", "priceLow": null, "priceHigh": null, "seenPrices": ["$1.49 each", "25\u00a2 FT", "29\u00a2/ft", "3/4 x 3/4 15\u00a2, 1/2 x 1/2 25\u00a2", "32\u00a2 FT", "94\u00a2/ft"], "selection": "limited", "brands": []},
      {"name": "Edge banding / veneer", "priceLow": null, "priceHigh": null, "seenPrices": [], "selection": "good", "brands": []},
    ],
    brands: ["Asd", "Badger", "Frontline Bldg. Products Inc.", "The Temple Company"],
  },
};

// Every vendor/brand whose signage or packaging we could read in-store.
export const VERIFIED_VENDORS: string[] = [
"Afco",
"Air Vent Inc.",
"Alcoa",
"Alliance",
"Amerock",
"Andersen",
"Asd",
"Badger",
"Bella Quartz",
"Bello Quartz",
"Blum",
"Chamberlain",
"Classic",
"Countryside Cabinetry",
"Countryside Cabinets",
"Cox",
"Curated By Carstin",
"Cut In Stone",
"Cut In Stone Llc",
"Delta",
"Design Classics",
"Design House",
"Dor-O-Matic",
"Dura-Frame",
"Duravit",
"Dynaflex",
"Frontline",
"Frontline Bldg. Products Inc.",
"Gibraltar",
"Gibraltar Industries",
"Global Point",
"Grip-Rite",
"Grk",
"Home Collection",
"Home Decorators Collection",
"Ideal",
"Ideal Security",
"Ingersoll-Rand",
"Integra",
"Interchange",
"Irwin",
"Ives",
"Jeld-Wen",
"Johnson",
"Johnson Hardware",
"Koch Cabinets",
"Kohler",
"Kwikset",
"Lawrence",
"Lawrence Brothers Inc.",
"Leviton",
"Lockset",
"Loctite",
"Lynden Door",
"Magna-Frame",
"Manion'S",
"Masonite",
"Maywood",
"Newport Brass",
"Norco",
"Patriot Lighting",
"Polaris",
"Premdor",
"Progress Lighting",
"Samuel Heath",
"Schlage",
"Semco",
"Showplace",
"Shrink-It",
"Shuster'S",
"Slater",
"Soss",
"Stanley",
"Steves",
"The Anchor Center",
"The Temple Company",
"Thermo-Tech",
"Thomas",
"Titan",
"Trex Signature",
"Triangle Mfg. Co.",
"Ultra",
"Utilitech",
"Velux",
"Vetter",
"Viatera",
"Viatera By Lx Hausys",
"Viking",
"We Build America",
"Weiser Lock",
"Weser Lock",
"Weslock",
"Western",
"Western Building Products",
"Wisconsin Screw Products",
"Wolf",
"Wolf Artisan"
];
