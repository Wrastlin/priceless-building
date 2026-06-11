/**
 * Marketing-variant prompt builder, tuned for **indistinguishable-from-
 * reality** output. Most AI image generation produces output that looks
 * "too clean": symmetrical lighting, perfect compositions, magazine
 * staging. That triggers the "this is AI" reflex in viewers.
 *
 * The fix is to deliberately ask for the imperfections of a real phone
 * photo: handheld angles, mixed light temperatures, household clutter,
 * everyday wear on surrounding surfaces, subtle motion blur, casual
 * framing. Each variant rolls a small set of imperfection tags so
 * batches of variants don't all share the same "tell."
 *
 * Truth-in-advertising still rules: the PRODUCT itself is preserved
 * pixel-faithful from the source photo. Only the surroundings change.
 */
import type { CatalogItem } from "@/lib/items/types";

export type SceneKey =
  | "home-interior"
  | "home-exterior"
  | "kitchen"
  | "bathroom"
  | "office"
  | "small-business"
  | "front-entry"
  | "back-patio"
  | "showroom-hero";

export const SCENES: { key: SceneKey; label: string; sub: string; environment: string }[] = [
  {
    key: "kitchen",
    label: "Kitchen",
    sub: "Installed or staged in a real customer kitchen.",
    environment:
      "an everyday Wisconsin family kitchen — slightly worn hardwood floor, a Keurig on the counter, a paper-towel roll, a stack of mail, a kid's drawing stuck to the fridge with a magnet just barely visible at the edge of frame, mismatched cabinet pulls from a prior remodel, mid-afternoon daylight through a window with thin curtains, a single overhead LED that's slightly cooler than the daylight",
  },
  {
    key: "bathroom",
    label: "Bathroom",
    sub: "Installed or staged in a real customer bathroom.",
    environment:
      "a small Wisconsin family bathroom — beige tile, a slightly rumpled hand towel on a bar, a half-used soap bottle on the counter, a toothbrush in a cup, a tiny water spot on the mirror, a strip of natural daylight through frosted glass mixed with a single warm vanity bulb above",
  },
  {
    key: "home-interior",
    label: "Home interior",
    sub: "Hallway, living room, mudroom, or general interior.",
    environment:
      "the inside of a real Wisconsin home — scuffed baseboards, a coat draped on a chair just visible at the edge, neutral painted walls with a hairline crack near a corner, hardwood that has years of light wear, daylight from a single off-camera window that isn't perfectly diffused, a faint sock on the floor or a slipper near a doorway",
  },
  {
    key: "front-entry",
    label: "Front entry",
    sub: "Real curb-appeal shot.",
    environment:
      "the front entry of a modest Wisconsin home — slightly faded painted siding, a worn welcome mat, a stack of folded delivery boxes leaning by the wall, a hose coiled imperfectly, late-afternoon golden-hour light coming in at a low angle creating long shadows, a hint of grass that needs mowing in the foreground",
  },
  {
    key: "back-patio",
    label: "Back patio",
    sub: "Real outdoor residential setting.",
    environment:
      "the back patio of a real Wisconsin home — weathered wood deck or paver patio with grass growing between cracks, a folding camp chair leaning against a wall, a half-empty bag of charcoal nearby, a kid's plastic toy left out, partly cloudy daylight with patchy shadows, soft breeze barely tilting a wind chime in the corner",
  },
  {
    key: "home-exterior",
    label: "Home exterior",
    sub: "Mounted/installed on the outside of a home.",
    environment:
      "the side wall of a Wisconsin home — siding with realistic weather and dirt streaks at the corners, a downspout, a small dent in the siding from a snowblower, dappled afternoon daylight through a maple tree casting shifting shadows, gravel or unkempt mulch at the base",
  },
  {
    key: "office",
    label: "Office",
    sub: "Real small-business office interior.",
    environment:
      "a small contractor's office in central Wisconsin — desk in the background with coffee rings, a stack of invoices, a wall calendar a month out of date, fluorescent overhead lighting mixed with a single warm desk lamp, dust on the venetian blinds, a CRT clock on the wall reading mid-afternoon",
  },
  {
    key: "small-business",
    label: "Small business",
    sub: "Real retail or storefront interior.",
    environment:
      "the interior of a Wisconsin family-run hardware store or contractor showroom — concrete floor with paint marks, mismatched display lighting, a handwritten price sign on packing paper, a roll of bubble wrap on a counter behind, mid-morning fluorescent light overlaid with a slice of daylight from a high window",
  },
  {
    key: "showroom-hero",
    label: "Showroom hero",
    sub: "Clean storefront shot — minimal staging, still real.",
    environment:
      "the interior of the Builders Corner showroom on Washington Street — light wood floor, a soft-gray accent wall, a couple of fabric samples leaning against a baseboard, a tape measure left on the floor, a single off-camera window letting in pale Midwest daylight with no fill light",
  },
];

export function findScene(key: string): (typeof SCENES)[number] | undefined {
  return SCENES.find((s) => s.key === key);
}

const CATEGORY_CONTEXT: Record<string, string> = {
  doors:
    "The item is the door visible in the source photo. Show it hung in a properly framed opening (hinges, jamb, casing). Hardware exactly as shown in source. Door may sit slightly open or closed.",
  windows:
    "The item is the window visible in the source photo. Show it installed in a real wall opening with realistic trim and wall finish. Glass reflects the room's actual ambient light, sometimes with subtle smudges or a faint dust line at the bottom edge of the pane.",
  cabinets:
    "The item is the cabinet visible in the source photo. Show it installed against a wall or as part of a partial run. Surrounding countertops, floor, and walls show realistic wear from daily use.",
  vanities:
    "The item is the vanity visible in the source photo. Show it installed against a bathroom wall with plumbing fixtures connected and a mirror nearby. Faucet and basin exactly as shown in source.",
  countertops:
    "The item is the countertop visible in the source photo. Show it installed atop an actual run of base cabinetry in a kitchen or bath. A small everyday object (coffee mug, hand towel, soap dish) sits on the surface to convey scale.",
  hardware:
    "The item is the hardware piece visible in the source photo. Show it mounted on a relevant cabinet, drawer, or door — possibly with one neighbor knob or pull for context.",
  lighting:
    "The item is the light fixture visible in the source photo. Show it mounted to the ceiling, wall, or vanity in a real room, switched on, casting realistic shadows on nearby surfaces.",
  trim:
    "The item is the trim/millwork visible in the source photo. Show it installed as baseboard, casing, or crown in a real finished room, possibly with a paint line slightly imperfect at a corner.",
};

// Camera DNA: a real iPhone shot, not a studio set. Hand-held, not
// tripod. Slight handheld imperfection. Mixed lighting. No retouch.
const CAMERA_SPEC = [
  "Captured on a recent-model iPhone in standard Photo mode (no Portrait mode, no HDR-overcooked look, no Pro RAW grading).",
  "Handheld at approximately 35mm equivalent. Composition is casual — not perfectly centered, not perfectly level. Eye-level or chest-level, not tripod-perfect.",
  "Lighting is whatever the room actually has: mixed warm tungsten + cool daylight is fine, single overhead source is fine, gentle uneven shadows are fine. No softbox, no studio strobes, no rim light, no fill card.",
  "Exposure is realistic, not magazine-perfect. Highlights can roll slightly. Shadows can be a little muddy in places. Some surfaces may catch a hint of overhead bounce. White balance is approximately correct but not laboratory-calibrated.",
  "Depth of field is whatever an iPhone produces at that focal length — generally everything in reasonable focus from about 3 feet onward, with subtle natural fall-off in the deep background, NOT bokeh-heavy DSLR isolation.",
  "Subtle imperfections that real phone photos have: a hint of compression in flat color areas, faint chromatic aberration at high-contrast edges, very slight grain in shadow regions, a barely-noticeable hand-motion smear (1-2 pixels) on a fine edge. Do NOT exaggerate any of these — keep them at the threshold of perception.",
  "No vignette, no film simulation, no Instagram preset, no faux-film grain overlay, no AI-photography polish.",
].join(" ");

const RULES = [
  "The PRODUCT in the new image must be the EXACT same product as the source: same model, same color, same finish, same hardware, same dimensions, same condition. Do not invent features.",
  "Preserve all visible wear, scratches, dents, dings, fading, mismatched finishes, or damage on the product itself. Do NOT repair or visually improve the product.",
  "Do not add or remove parts. Do not swap colors. Do not change handle, knob, or hinge style. Do not change panel count or pane configuration.",
  "Photorealistic only. No illustration, no painterly look, no cartoon, no clay render, no 3D-render giveaway. The output must be indistinguishable from a casual phone photo a homeowner took.",
  "Avoid the AI-photo 'tells': overly symmetrical lighting, magazine-perfect staging, repeating wallpaper patterns, melted hands, signage with garbled text, identical objects mirrored, supernatural cleanliness. If a surface, prop, or room detail would normally show wear, show it.",
  "If asked to include text on a sign, label, calendar, paper, or screen, leave it BLANK or render only an unreadable blur — do NOT attempt legible text (typography is a giveaway).",
  "Single image, landscape or square aspect, no text overlays, no watermarks, no borders, no UI chrome.",
];

export function buildScenePrompt(item: CatalogItem, sceneKey: SceneKey): string {
  const scene = findScene(sceneKey);
  if (!scene) throw new Error(`Unknown scene: ${sceneKey}`);
  const ctx = CATEGORY_CONTEXT[item.category] ??
    "The item is the product visible in the source photo. Stage it in a realistic on-brand setting.";

  return `Generate a photograph that looks like a casual iPhone snapshot of this exact product placed inside ${scene.environment}.

PRODUCT REFERENCE (from source image):
- Title: ${item.title}
- Category: ${item.category}
${item.subtitle ? `- Subtitle: ${item.subtitle}\n` : ""}${item.dimensions ? `- Dimensions: ${item.dimensions}\n` : ""}${item.manufacturer ? `- Manufacturer: ${item.manufacturer}\n` : ""}
PRODUCT PLACEMENT:
${ctx}

CAMERA & FEEL — must look like a real phone photo, NOT a studio render:
${CAMERA_SPEC}

STRICT RULES:
${RULES.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Output: one photograph. Make it look like someone pulled out their iPhone, snapped a picture in their actual home, and texted it to a friend.`;
}
