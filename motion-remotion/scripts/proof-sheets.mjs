// Placement proof sheets: render each placement preset across many real shots
// as stills, then montage one labeled proof sheet per placement + a master
// matrix. Isolates PLACEMENT (type style held constant, neutral copy).
// Usage: node scripts/proof-sheets.mjs
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const MR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(MR, "out", "text-presets", "proofs");
fs.mkdirSync(OUT, { recursive: true });

// Distinct PLACEMENT zones (motion variants B/D/F excluded — those are style).
const PLACEMENTS = [
  ["A", "CENTER"],
  ["G", "TOP ANCHOR"],
  ["H", "BOTTOM BAR"],
  ["C", "RAIL LOWER-THIRD"],
  ["I", "LEFT COLUMN"],
  ["J", "CORNER TAG"],
  ["E", "SPLIT FLANK"],
];

// Diverse real shots: bright/dark, busy/clean, subject high/low.
const SHOTS = [
  "placements/globe-placement.png",
  "one-roof/v3-a/floor-door-aisle-light-and-dark.jpg",
  "one-roof/v3-a/floor-vanity-row-mirrors-lights.jpg",
  "one-roof/v3-a/floor-barn-door-diamond-glass.jpg",
  "one-roof/v3-a/warehouse-lighting-inventory.jpg",
  "one-roof/v3-a/kohler-vessel-sink-gold-faucet.jpg",
];

// Neutral copy so placement (not chandelier-specific words) is the variable.
const COPY = {
  kicker: "Now at Price-Less",
  hero: "For Less",
  descriptor: "Real floor finds",
  brand: "Price-Less · Wausau",
};

const FRAME = 80; // settled
const FONT = "/System/Library/Fonts/Supplemental/Georgia.ttf";

// Only bundle if some cell is still missing (re-runs just re-montage).
const allCellsExist = PLACEMENTS.every(([p]) =>
  SHOTS.every((_, i) => fs.existsSync(path.join(OUT, `cell-${p}-${i}.png`)))
);
let serveUrl = null;
if (!allCellsExist) {
  console.log("bundling…");
  serveUrl = await bundle({ entryPoint: path.join(MR, "src", "index.ts") });
  console.log("bundled.");
}

const sheets = [];
for (const [preset, label] of PLACEMENTS) {
  const cells = [];
  for (let i = 0; i < SHOTS.length; i++) {
    const still = path.join(OUT, `cell-${preset}-${i}.png`);
    if (!fs.existsSync(still)) {
      const inputProps = { preset, src: SHOTS[i], copy: COPY };
      const comp = await selectComposition({ serveUrl, id: "PL-text-preset", inputProps });
      await renderStill({ composition: comp, serveUrl, output: still, inputProps, frame: FRAME });
      // downscale cell for a lighter contact sheet
      execFileSync("magick", [still, "-resize", "540x960", still]);
    }
    cells.push(still);
    process.stdout.write(`  ${preset}·${i} `);
  }
  const sheet = path.join(OUT, `PROOF-${preset}-${label.replace(/\s+/g, "-").toLowerCase()}.png`);
  execFileSync("magick", [
    "montage", ...cells,
    "-tile", "3x2", "-geometry", "+10+10", "-background", "#141414",
    "-font", FONT, "-title", `PLACEMENT ${preset}  —  ${label}`,
    "-fill", "#f7f5f1", "-pointsize", "34",
    sheet,
  ]);
  sheets.push(sheet);
  console.log(`\n-> ${path.basename(sheet)}`);
}

// Master matrix: one representative shot per placement, all placements together.
const heroCells = PLACEMENTS.map(([p]) => path.join(OUT, `cell-${p}-0.png`));
const master = path.join(OUT, "PROOF-MASTER-placement-matrix.png");
execFileSync("magick", [
  "montage", ...heroCells,
  "-tile", `${PLACEMENTS.length}x1`, "-geometry", "+8+8", "-background", "#141414",
  "-font", FONT, "-title", "PLACEMENT LIBRARY  —  same shot, seven zones",
  "-fill", "#f7f5f1", "-pointsize", "30",
  master,
]);
console.log(`-> ${path.basename(master)}`);
console.log("PROOF SHEETS COMPLETE");
