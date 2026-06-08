#!/usr/bin/env python3
"""
Bulk generate catalog imagery for the production storefront.

Generates:
  - Hero + scene-01 + scene-02 (sometimes 03) for ~26 NEW catalog items.
  - scene-01 + scene-02 for each of the 14 EXISTING priceless+BC items
    so they get a gallery (their hero photo already lives in
    public/test-images/ and stays put).

Output: public/catalog-images/<SKU>-hero.jpg, <SKU>-scene-NN.jpg.

Follows the same single-paragraph prompt pattern as gen-test-images.py:
subject, material/finish, lens/aperture, light source, "no CGI" guards.

Run from project root:
    GEMINI_API_KEY=... python3 scripts/gen-catalog-bulk.py
"""

import base64
import os
import sys
import time
from pathlib import Path

import requests

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    sys.exit("GEMINI_API_KEY not set.")

MODEL = "gemini-3-pro-image-preview"
ENDPOINT = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{MODEL}:generateContent?key={API_KEY}"
)
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "catalog-images"


# ---------------------------------------------------------------------------
# NEW CATALOG ITEMS (26 total)
# Each entry is (sku, hero_ratio, hero_prompt, [(scene_ratio, scene_prompt), ...])
# ---------------------------------------------------------------------------

NEW_ITEMS = [
    # ---------------- DOORS (2 more) ----------------
    (
        "PL-000112", "3:4",
        "Photorealistic commercial catalog photograph of a 60-inch wide pre-hung "
        "interior French double door unit, painted white shaker style with three "
        "stacked square divided-light panes per door and clear tempered glass. "
        "Standing upright on a polished concrete warehouse floor, leaning slightly "
        "open to show satin-nickel lever sets. Shot on 50mm at f/4, three-quarter "
        "view, sharp focus on the lever sets, soft falloff into blurred steel "
        "pallet racking behind. Cool daylight from an open bay door camera-right, "
        "5300K. Crisp factory-fresh paint, accurate geometry, no warped mullions, "
        "no CGI look.",
        [
            ("16:9",
             "Photorealistic interior architecture photograph of a 60-inch white "
             "shaker French double door unit installed as a den entry off a "
             "neutral-toned hallway in a Wausau Wisconsin home. Three divided "
             "light panes per door, satin-nickel levers, oak hardwood floor, "
             "warm wall sconce light spilling from the den. Shot on 24mm at f/4, "
             "eye level, sharp throughout. Soft natural daylight from an off-"
             "camera window, 4500K. Lived-in but tidy, real residential scale, "
             "no plastic-looking finishes, no CGI artifacts."),
            ("4:3",
             "Photorealistic styled photograph of the same white French double "
             "doors installed as a home-office entry off a bright living room. "
             "Doors partially open showing a desk with a brass lamp inside. "
             "Sisal rug, light oak floor, painted-white casing trim. Shot on "
             "35mm at f/4, slight low angle, sharp focus on the door hardware. "
             "Soft window daylight camera-left, 5000K. True paint white, "
             "accurate scale, photoreal high-end residential quality."),
        ],
    ),
    (
        "PL-000115", "3:4",
        "Photorealistic commercial catalog photograph of a single 24-inch wide "
        "primed-white pocket-door slab with a satin-nickel mortise pocket-door "
        "pull set, leaning against a soft grey concrete warehouse wall next to "
        "its boxed track-and-roller hardware kit. Shot on 50mm at f/4, three-"
        "quarter view, sharp focus on the recessed pull, blurred steel racking "
        "behind. Cool overhead fluorescent mixed with daylight, 5200K. Crisp "
        "factory paint, accurate proportions, no CGI look, no glossy plastic.",
        [
            ("4:3",
             "Photorealistic interior photograph of a 24-inch white pocket door "
             "installed as the entry to a small bathroom, halfway slid into its "
             "wall pocket showing the recessed satin-nickel pull. Light oak "
             "floor, warm sconce light inside the bath, painted-white trim. "
             "Shot on 35mm at f/4, eye level, sharp focus on the door pull. "
             "Soft natural daylight from a hall window, 4500K. Real residential "
             "scale, photoreal catalog quality."),
            ("4:3",
             "Photorealistic interior photograph of the same 24-inch white "
             "pocket door installed as a laundry-closet entry off a mudroom. "
             "Door fully open showing a stackable washer dryer inside, basket "
             "of folded towels on a built-in bench. Painted-white casing, slate "
             "floor. Shot on 35mm at f/4.5, eye level, sharp throughout. Soft "
             "warm overhead light, 3800K. Lived-in but tidy, no CGI artifacts."),
        ],
    ),

    # ---------------- WINDOWS (3 more) ----------------
    (
        "PL-000211", "3:4",
        "Photorealistic commercial product photograph of a single white vinyl "
        "awning window, 36 inches wide by 24 inches tall, clear insulated low-E "
        "glass, factory-applied weatherstripping visible, crank-out hardware at "
        "the bottom rail. Leaning against a clean grey concrete wall in a "
        "building-supply warehouse. Shot on 50mm at f/4, three-quarter view, "
        "sharp focus on the crank handle, blurred steel racking behind. Cool "
        "overhead fluorescent mixed with daylight from a far bay door, 5200K. "
        "Accurate proportions, no warped vinyl, no CGI look.",
        [
            ("4:3",
             "Photorealistic interior photograph of a white vinyl awning window "
             "installed above a kitchen sink in a bright Craftsman home, "
             "cranked open at a slight angle. Subway-tile backsplash, white "
             "shaker cabinets visible at the edges, brass faucet. Shot on 35mm "
             "at f/4, slight low angle, sharp focus on the crank handle. Warm "
             "morning daylight pouring through the window, 4200K. Lived-in "
             "kitchen detail, photoreal residential catalog quality."),
            ("4:3",
             "Photorealistic photograph of the same white vinyl awning window "
             "installed high on a bathroom wall above a freestanding soaker "
             "tub, cranked open to vent. Marble-look tile walls, brushed-nickel "
             "tub filler, eucalyptus branch on the tub rim. Shot on 35mm at "
             "f/4.5, eye level, sharp throughout. Soft cool natural daylight, "
             "5000K. Spa-magazine quality, no CGI."),
        ],
    ),
    (
        "PL-000214", "16:9",
        "Photorealistic commercial product photograph of a single large fixed "
        "picture window, 72 inches wide by 60 inches tall, slim black aluminum "
        "frame, clear insulated low-E glass. Standing upright on an A-frame on "
        "the polished concrete floor of a building-supply warehouse. Shot on "
        "35mm at f/5, three-quarter view, sharp focus on the frame profile, "
        "blurred steel racking behind. Cool overhead fluorescent mixed with "
        "daylight, 5200K, soft reflections in the glass. True matte-black "
        "finish, accurate proportions, no CGI.",
        [
            ("16:9",
             "Photorealistic architecture photograph of a large fixed picture "
             "window with a slim black frame installed in the living room of a "
             "modern Wisconsin lake home, looking out onto pine trees and a "
             "calm lake. White oak floor, low-profile leather sofa in frame, "
             "wool throw. Shot on 24mm at f/4, eye level, sharp throughout. "
             "Soft natural daylight pouring in, 4800K. Lived-in but minimal, "
             "photoreal high-end residential quality."),
            ("4:3",
             "Photorealistic photograph of the same large black-framed picture "
             "window installed as the focal wall of a home office, looking out "
             "onto a snowy backyard with bare birch trees. Walnut desk in "
             "foreground, brass desk lamp, leather chair. Shot on 35mm at f/4, "
             "eye level, sharp focus on the window frame. Soft cool natural "
             "winter light, 5500K. Calm and quiet, no CGI artifacts."),
        ],
    ),
    (
        "PL-000219", "16:9",
        "Photorealistic commercial product photograph of a single three-panel "
        "vinyl sliding patio door unit, 108 inches wide by 80 inches tall, "
        "white frame, clear insulated low-E glass, brushed-nickel handle on the "
        "operating panel. Standing upright on an A-frame on the polished "
        "concrete floor of a building-supply warehouse. Shot on 24mm at f/5, "
        "three-quarter view, sharp focus on the handle, blurred steel racking "
        "behind. Cool overhead fluorescent mixed with daylight from a far bay "
        "door, 5200K. Accurate proportions, no warped vinyl, no CGI look.",
        [
            ("16:9",
             "Photorealistic architecture photograph of a wide three-panel "
             "white vinyl sliding patio door installed across the back wall of "
             "a great room in a Wausau Wisconsin home, sliding panel open onto "
             "a cedar deck with two Adirondack chairs. Light oak floor, low "
             "linen sofa, area rug. Shot on 24mm at f/4, eye level, sharp "
             "throughout. Warm afternoon daylight pouring in, 4500K. Lived-in "
             "Midwest residential quality, no CGI."),
            ("4:3",
             "Photorealistic interior photograph of the same three-panel white "
             "sliding patio door installed in a sunroom addition, all panels "
             "closed, looking out on a snowy yard. White wicker chair with "
             "wool throw, potted fern, terra cotta tile floor. Shot on 35mm at "
             "f/4.5, eye level, sharp focus on the door handle. Soft cool "
             "winter light, 5500K. Cozy and quiet, photoreal."),
        ],
    ),

    # ---------------- CABINETS (1 more priceless) ----------------
    (
        "PL-000311", "1:1",
        "Photorealistic catalog photograph of a single 36-inch white shaker "
        "sink-base cabinet with two doors and a false drawer front, factory-"
        "drilled plumbing knockouts visible on the back panel. Sitting on a "
        "clean concrete warehouse floor against a soft neutral grey backdrop. "
        "Shot on 85mm at f/5.6, perfectly squared to camera, sharp throughout. "
        "Softbox key light from camera-left, subtle fill from camera-right. "
        "Crisp factory-fresh edges, real shaker bevel reveals, satin-nickel "
        "cup pulls, no oversaturated whites, no CGI look.",
        [
            ("4:3",
             "Photorealistic kitchen photograph of a 36-inch white shaker "
             "sink-base cabinet installed under a farmhouse-style undermount "
             "stainless sink in a renovated Craftsman kitchen. Honed quartz "
             "countertop, matte-black gooseneck faucet, subway-tile backsplash, "
             "potted basil on the counter. Shot on 35mm at f/4, eye level, "
             "sharp focus on the cabinet face. Warm window daylight camera-"
             "left, 4200K. Lived-in detail, photoreal."),
            ("4:3",
             "Photorealistic photograph of the same white shaker sink-base "
             "cabinet installed in a tidy laundry room under a deep stainless "
             "utility sink. Folded towels stacked on the closed door, hanging "
             "rod above with linen aprons. Subway-tile backsplash, slate "
             "floor. Shot on 35mm at f/4.5, eye level, sharp throughout. Cool "
             "natural daylight, 5000K. Real home detail, no CGI."),
        ],
    ),

    # ---------------- VANITIES (4 more) ----------------
    (
        "PL-000404", "4:3",
        "Photorealistic styled product shot of a 30-inch wall-mounted floating "
        "bathroom vanity in solid walnut with hand-rubbed natural finish "
        "showing real grain figure, single integrated white porcelain rectangle "
        "basin, brushed-brass single-handle faucet. Mounted on a soft warm "
        "linen-textured backdrop in a magazine-style showroom vignette. Shot "
        "on 85mm at f/4.5, eye level, sharp focus on the faucet, subtle bokeh "
        "behind. Soft warm key light camera-left, fill bounce camera-right, "
        "3400K. True walnut color, accurate porcelain, no plastic-looking "
        "finish, photoreal commercial bath catalog quality.",
        [
            ("4:3",
             "Photorealistic bathroom photograph of a 30-inch walnut floating "
             "vanity installed in a small modern powder room, brushed-brass "
             "faucet, round black-framed mirror above. Vertical-stack subway "
             "tile wainscot, matte-black sconce on either side of the mirror, "
             "potted snake plant in the corner. Shot on 35mm at f/4, eye "
             "level, sharp throughout. Soft warm sconce light mixed with cool "
             "daylight, 4000K. Magazine-quality powder room, no CGI."),
            ("3:4",
             "Photorealistic close-up photograph of the same walnut floating "
             "vanity in a primary bath, showing the porcelain basin, brushed-"
             "brass faucet, marble backsplash, and a folded white linen towel "
             "on a brass bar to the right. Shot on 50mm at f/4, slight angle, "
             "sharp focus on the faucet. Soft warm window light camera-left, "
             "3500K. Spa-magazine quality, photoreal."),
        ],
    ),
    (
        "PL-000409", "16:9",
        "Photorealistic styled product shot of a 60-inch double-sink bathroom "
        "vanity, painted soft sage-green shaker base with full-overlay doors "
        "and three center drawers, polished white quartz top, two undermount "
        "rectangular porcelain basins, polished-chrome widespread faucets. Set "
        "against a warm linen backdrop in a magazine-style showroom vignette. "
        "Shot on 50mm at f/4.5, eye level, sharp focus on the centerline. Soft "
        "warm key light camera-left, fill bounce camera-right, 3600K. Crisp "
        "factory paint, accurate quartz texture, photoreal commercial bath "
        "catalog quality, no plastic-looking finish.",
        [
            ("16:9",
             "Photorealistic architecture photograph of a 60-inch sage-green "
             "double-sink vanity installed as the focal piece of a primary "
             "bath in a renovated Wisconsin farmhouse. Large arched mirror "
             "above, brass wall sconces, white marble-look tile floor, brass "
             "towel bar with two folded linen towels. Shot on 24mm at f/4, "
             "eye level, sharp throughout. Soft natural daylight from a window "
             "camera-right, 4500K. Magazine-quality, photoreal residential."),
            ("4:3",
             "Photorealistic detail photograph of the same sage-green double "
             "vanity, close-up on one of the polished-chrome faucets and "
             "undermount basin. Hand soap pump, small ceramic dish with rings, "
             "folded white washcloth. Shot on 85mm at f/4, sharp focus on the "
             "faucet handle. Warm morning window light, 4000K. Photoreal "
             "lifestyle detail, no CGI."),
        ],
    ),
    (
        "PL-000412", "3:4",
        "Photorealistic styled product shot of a 24-inch European-style wall-"
        "mounted vanity in matte-white slab front, single integrated white "
        "stone basin, brushed-nickel single-handle faucet. Mounted on a soft "
        "warm grey backdrop in a magazine-style showroom vignette. Shot on "
        "85mm at f/4.5, eye level, sharp focus on the faucet, subtle bokeh "
        "behind. Soft warm key light camera-left, fill bounce camera-right, "
        "3600K. Crisp matte-white finish, accurate basin, no plastic-looking "
        "sheen, photoreal commercial bath catalog quality.",
        [
            ("3:4",
             "Photorealistic bathroom photograph of a 24-inch matte-white "
             "European floating vanity installed in a tight half-bath, brushed-"
             "nickel faucet, frameless rectangular mirror above. Large-format "
             "grey porcelain tile floor, small black sconce above the mirror. "
             "Shot on 35mm at f/4, eye level, sharp throughout. Soft warm "
             "sconce light, 3500K. Clean modern bath, no CGI."),
            ("4:3",
             "Photorealistic photograph of the same matte-white European "
             "vanity installed in a guest powder room, with a round brass-"
             "framed mirror above and a small potted fern beside it. Light "
             "oak floor, white-painted walls, brass sconce. Shot on 35mm at "
             "f/4.5, eye level, sharp focus on the basin. Soft natural "
             "daylight camera-right, 4500K. Magazine-quality, photoreal."),
        ],
    ),
    (
        "PL-000415", "3:4",
        "Photorealistic styled product shot of a 22-inch pedestal-style "
        "bathroom sink in glossy white vitreous china, single-handle polished-"
        "chrome faucet installed, set against a soft warm linen backdrop in a "
        "showroom vignette. Shot on 85mm at f/4.5, eye level, sharp focus on "
        "the faucet, subtle bokeh behind. Soft warm key light camera-left, "
        "fill bounce camera-right, 3600K. True vitreous china glaze, accurate "
        "geometry, no plastic-looking finish, photoreal commercial bath "
        "catalog quality.",
        [
            ("3:4",
             "Photorealistic bathroom photograph of a white pedestal sink with "
             "polished-chrome faucet installed in a small powder room of a "
             "1920s Wisconsin bungalow. Subway-tile wainscot, black-and-white "
             "hex floor tile, simple round mirror above, small brass sconce. "
             "Shot on 35mm at f/4, eye level, sharp throughout. Soft warm "
             "overhead light, 3500K. Period-appropriate detail, photoreal."),
            ("4:3",
             "Photorealistic photograph of the same white pedestal sink "
             "installed in a tidy guest bath, with a small folded linen towel "
             "draped over a brass towel ring beside it, simple framed mirror "
             "above. Beadboard wainscot painted soft white, wood floor. Shot "
             "on 35mm at f/4.5, eye level, sharp focus on the sink. Soft "
             "natural daylight from off-camera window, 4500K. Cozy traditional, "
             "no CGI."),
        ],
    ),

    # ---------------- COUNTERTOPS (4 more priceless) ----------------
    (
        "PL-000810", "16:9",
        "Photorealistic warehouse product photograph of a single 96-inch by "
        "25-inch butcher-block countertop slab in solid edge-grain hard maple, "
        "natural finish showing real grain detail and warm honey color. Resting "
        "flat on padded sawhorses on a polished concrete warehouse floor. Shot "
        "on 35mm at f/5.6, three-quarter view, sharp focus on the wood surface, "
        "blurred steel racking and stacked lumber behind. Cool overhead "
        "warehouse lighting mixed with daylight from a bay door, 5200K. True "
        "maple color, real grain (not repeating CGI patterns), photoreal "
        "commercial lumberyard catalog quality.",
        [
            ("16:9",
             "Photorealistic kitchen photograph of a maple butcher-block "
             "countertop installed as the working surface on a kitchen island "
             "in a renovated Wisconsin farmhouse. Painted-white shaker cabinets "
             "below, white subway tile backsplash beyond, cast-iron skillet "
             "and a wooden cutting board with chopped vegetables on the "
             "counter. Shot on 24mm at f/4, eye level, sharp throughout. Warm "
             "morning daylight from a window, 4200K. Lived-in detail, "
             "photoreal."),
            ("4:3",
             "Photorealistic close-up photograph of the maple butcher-block "
             "countertop on a kitchen island, with a hand cutting fresh herbs "
             "with a chef knife, glass of olive oil and small bowl of salt to "
             "the side. Shot on 50mm at f/4, slight overhead angle, sharp "
             "focus on the knife and herbs. Warm window light camera-left, "
             "4000K. Magazine-quality food prep detail, no CGI."),
        ],
    ),
    (
        "PL-000812", "4:3",
        "Photorealistic warehouse product photograph of a single remnant slab "
        "of polished grey granite, roughly 36 inches by 30 inches, soft natural "
        "grey field with subtle black and warm-grey speckling, polished edge "
        "showing the 3cm thickness. Resting flat on padded sawhorses on the "
        "polished concrete floor of a slab yard. Shot on 35mm at f/5.6, three-"
        "quarter view, sharp focus on the slab surface, blurred A-frame slab "
        "racks behind. Cool overhead lighting mixed with daylight from an open "
        "bay door, 5200K. True granite appearance, real speckle pattern, "
        "photoreal commercial stone-yard catalog quality.",
        [
            ("4:3",
             "Photorealistic photograph of a grey granite remnant installed as "
             "the countertop of a small wet bar in a finished basement, with "
             "an undermount stainless bar sink, polished-chrome bar faucet, "
             "two rocks glasses and a bottle of bourbon. Walnut cabinets below, "
             "subway-tile backsplash. Shot on 35mm at f/4, eye level, sharp "
             "throughout. Warm pendant light overhead, 3400K. Cozy basement "
             "bar detail, photoreal."),
            ("4:3",
             "Photorealistic photograph of the same grey granite remnant used "
             "as a laundry-room counter on top of a base cabinet, with a "
             "small ceramic dish for buttons and a folded stack of white "
             "linens. Painted-white cabinets, subway-tile backsplash, slate "
             "floor. Shot on 35mm at f/4.5, eye level, sharp focus on the "
             "stone surface. Cool natural daylight, 4800K. Real home detail, "
             "no CGI."),
        ],
    ),
    (
        "PL-000815", "16:9",
        "Photorealistic warehouse product photograph of a single slab of "
        "honed soapstone countertop, 60 inches by 25 inches, deep charcoal-"
        "grey color with subtle pale veining, soft matte honed surface, "
        "exposed edge showing the 3cm thickness. Resting flat on padded "
        "sawhorses on the polished concrete floor of a slab yard. Shot on "
        "35mm at f/5.6, three-quarter view, sharp focus on the slab surface, "
        "blurred A-frame slab racks behind. Cool overhead lighting mixed with "
        "daylight from an open bay door, 5200K. True soapstone appearance, "
        "real veining (not repeating CGI), photoreal commercial stone-yard "
        "quality.",
        [
            ("16:9",
             "Photorealistic kitchen photograph of honed soapstone countertops "
             "installed on a kitchen island in a moody modern farmhouse, white "
             "shaker cabinets below, matte-black gooseneck faucet on an "
             "apron-front sink at the back wall, brass pendant lights above. "
             "Shot on 24mm at f/4, eye level, sharp throughout. Warm late-"
             "afternoon window light, 3800K. Magazine-quality kitchen, no CGI."),
            ("4:3",
             "Photorealistic close-up photograph of honed soapstone counter "
             "with a steaming cast-iron Dutch oven on a wooden trivet, sprig "
             "of rosemary beside it, edge of a white linen napkin in frame. "
             "Shot on 50mm at f/4, slight angle, sharp focus on the Dutch "
             "oven. Warm window light camera-left, 3600K. Food-magazine "
             "detail, photoreal."),
        ],
    ),
    (
        "PL-000819", "16:9",
        "Photorealistic warehouse product photograph of a single 72-inch by "
        "25-inch butcher-block countertop slab in solid end-grain walnut, oil "
        "finish showing real grain figure and warm chocolate tone with subtle "
        "light streaks. Resting flat on padded sawhorses on a polished "
        "concrete warehouse floor. Shot on 35mm at f/5.6, three-quarter view, "
        "sharp focus on the wood surface, blurred steel racking and stacked "
        "lumber behind. Cool overhead lighting mixed with daylight, 5200K. "
        "True walnut color, real grain, photoreal commercial lumberyard "
        "catalog quality.",
        [
            ("16:9",
             "Photorealistic kitchen photograph of a walnut butcher-block "
             "countertop installed on the top of a coffee bar built-in along "
             "one wall of a kitchen, white shaker cabinets below, espresso "
             "machine, small wooden tray with two ceramic mugs, glass jar of "
             "beans. Shot on 24mm at f/4, eye level, sharp throughout. Warm "
             "pendant lighting overhead, 3400K. Lived-in coffee corner, "
             "photoreal."),
            ("4:3",
             "Photorealistic close-up photograph of the walnut butcher-block "
             "counter on a kitchen island, used as a serving surface with a "
             "wooden cheese board, two small ramekins of olives and almonds, "
             "edge of a stemless wine glass. Shot on 50mm at f/4, slight "
             "overhead angle, sharp focus on the cheese board. Warm pendant "
             "light, 3400K. Magazine entertaining detail, no CGI."),
        ],
    ),

    # ---------------- HARDWARE (4 more) ----------------
    (
        "PL-000510", "1:1",
        "Photorealistic close-up macro photograph of a set of five solid "
        "polished-brass round cabinet knobs, 1-1/4 inches in diameter, laid "
        "out in a clean row on a soft cream linen backdrop. Visible polished "
        "brass surface with subtle warm reflections, faint shadow under each "
        "piece. Shot on a 100mm macro lens at f/8 for full sharpness, overhead "
        "softbox lighting at 4200K, perfectly even exposure. Commercial "
        "catalog photography, true polished-brass color, no orange "
        "oversaturation, no plastic look.",
        [
            ("4:3",
             "Photorealistic kitchen detail photograph of polished-brass round "
             "knobs installed on the upper cabinet doors of a navy-blue shaker "
             "kitchen, soft daylight from an off-camera window catching the "
             "brass. Marble-look quartz countertop visible at the bottom of "
             "frame, brass faucet just out of focus beyond. Shot on 50mm at "
             "f/4, sharp focus on the closest knob. Warm morning light, "
             "4200K. Magazine-quality detail, photoreal."),
            ("4:3",
             "Photorealistic detail photograph of polished-brass round knobs "
             "installed on a tall white linen cabinet in a primary bath, with "
             "folded white towels visible inside the open door at the right "
             "edge. Marble-look porcelain tile floor, brass towel bar. Shot "
             "on 50mm at f/4.5, sharp focus on the knob. Soft natural "
             "daylight, 4500K. Spa-magazine detail, no CGI."),
        ],
    ),
    (
        "PL-000513", "1:1",
        "Photorealistic close-up macro photograph of a set of ten satin-nickel "
        "modern bar pulls, 4 inches center-to-center, laid out in a clean grid "
        "on a soft cream linen backdrop. Visible brushed grain in the satin "
        "nickel, subtle cool reflections, faint shadow under each piece. Shot "
        "on a 100mm macro lens at f/8 for full sharpness, overhead softbox "
        "lighting at 4200K, perfectly even exposure. Commercial catalog "
        "photography, true satin-nickel color, no plastic look.",
        [
            ("4:3",
             "Photorealistic kitchen detail photograph of satin-nickel bar "
             "pulls installed on the lower drawers of a white shaker kitchen "
             "island, quartz countertop above just at the top of frame, light "
             "oak floor just at the bottom. Shot on 50mm at f/4, eye level, "
             "sharp focus on the closest pull. Warm window daylight camera-"
             "left, 4200K. Magazine-quality detail, photoreal."),
            ("4:3",
             "Photorealistic detail photograph of satin-nickel bar pulls "
             "installed on a tall pantry cabinet in a modern Wisconsin "
             "kitchen. Painted-soft-grey cabinet front, brass pendant just "
             "visible at the top of the frame. Shot on 50mm at f/4.5, sharp "
             "focus on the pull. Soft natural daylight, 4500K. Real home "
             "detail, no CGI."),
        ],
    ),
    (
        "PL-000516", "1:1",
        "Photorealistic close-up macro photograph of a set of eight polished-"
        "chrome bin pulls, 3 inches center-to-center, traditional cup-style "
        "shape, laid out in a clean grid on a soft cream linen backdrop. "
        "Visible mirror-bright chrome surface with subtle cool reflections, "
        "faint shadow under each piece. Shot on a 100mm macro lens at f/8 for "
        "full sharpness, overhead softbox lighting at 4200K, perfectly even "
        "exposure. Commercial catalog photography, true chrome color, accurate "
        "highlight detail, no plastic look.",
        [
            ("4:3",
             "Photorealistic kitchen detail photograph of polished-chrome bin "
             "pulls installed on the lower drawers of a soft-blue inset shaker "
             "kitchen, marble countertop above just at the top of frame, light "
             "oak floor at the bottom. Shot on 50mm at f/4, sharp focus on "
             "the closest pull. Soft natural daylight camera-left, 4500K. "
             "Magazine-quality classic kitchen, photoreal."),
            ("4:3",
             "Photorealistic detail photograph of polished-chrome bin pulls "
             "installed on the apron drawers of a bathroom vanity, white "
             "shaker base, marble countertop, edge of a chrome faucet just "
             "visible. Shot on 50mm at f/4.5, sharp focus on the closest "
             "pull. Soft cool daylight, 5000K. Classic bath detail, no CGI."),
        ],
    ),
    (
        "PL-000519", "1:1",
        "Photorealistic close-up macro photograph of a set of six vintage-"
        "style clear cut-glass cabinet knobs with polished-brass mounting "
        "hardware, 1-1/4 inches in diameter, laid out in a clean grid on a "
        "soft cream linen backdrop. Visible faceted glass catching warm "
        "highlights, brass screws and bases polished bright, faint shadow "
        "under each piece. Shot on a 100mm macro lens at f/8 for full "
        "sharpness, overhead softbox lighting at 4200K, perfectly even "
        "exposure. Commercial catalog photography, accurate glass refraction, "
        "true brass color, no plastic look.",
        [
            ("4:3",
             "Photorealistic kitchen detail photograph of vintage clear-glass "
             "cabinet knobs with polished-brass bases installed on a creamy-"
             "white inset shaker upper cabinet in a 1920s Wisconsin "
             "farmhouse kitchen. Subway-tile backsplash, brass pendant just "
             "visible at the top of the frame. Shot on 50mm at f/4, sharp "
             "focus on the closest knob. Warm window daylight, 3800K. Period-"
             "appropriate detail, photoreal."),
            ("4:3",
             "Photorealistic detail photograph of the same vintage glass and "
             "brass knobs installed on the drawers of an antique-style "
             "bathroom vanity. White-painted base, marble top edge just "
             "visible, brass faucet at the top right of frame slightly out of "
             "focus. Shot on 50mm at f/4.5, sharp focus on the closest knob. "
             "Warm sconce light, 3500K. Lived-in classic bath, no CGI."),
        ],
    ),

    # ---------------- LIGHTING (4 more) ----------------
    (
        "PL-000605", "16:9",
        "Photorealistic product photograph of a single 36-inch linear pendant "
        "in matte black with an integrated linear LED diffuser (light off), "
        "suspended on two cloth cords from a section of soft white ceiling "
        "panel in a studio set. Shot on 50mm at f/5.6, dead-center "
        "composition, even exposure. Softbox key from camera-front, subtle "
        "rim light showing the housing profile, 4200K. True matte-black "
        "finish with subtle texture, accurate proportions, photoreal "
        "commercial lighting catalog quality.",
        [
            ("16:9",
             "Photorealistic kitchen photograph of a 36-inch matte-black "
             "linear pendant hanging above a long walnut dining table in a "
             "modern Wisconsin home, light ON casting a soft warm glow on the "
             "table below, four leather chairs around the table, simple "
             "ceramic bowl as a centerpiece. Shot on 24mm at f/4, eye level, "
             "sharp throughout. Mixed pendant warm glow and soft natural "
             "daylight, 3400K. Magazine-quality dining room, photoreal."),
            ("4:3",
             "Photorealistic interior photograph of the same matte-black "
             "linear pendant hanging above a kitchen island, light ON, white "
             "shaker cabinets below, marble countertop, two upholstered "
             "counter stools. Shot on 35mm at f/4.5, eye level, sharp "
             "throughout. Warm pendant glow mixed with cool daylight, 3600K. "
             "Real kitchen scene, no CGI."),
        ],
    ),
    (
        "PL-000609", "1:1",
        "Photorealistic product photograph of a four-light cluster pendant "
        "with antique-brass canopy and four staggered-length cloth cords, "
        "each cord ending in a clear glass globe shade housing an exposed "
        "Edison-style bulb (bulbs off). Hanging from a section of soft white "
        "ceiling in a studio set. Shot on 50mm at f/5.6, dead-center "
        "composition, even exposure. Softbox key from camera-front, subtle "
        "rim light showing the brass and glass detail, 4200K. True antique-"
        "brass color, accurate glass refraction, no plastic look.",
        [
            ("4:3",
             "Photorealistic interior photograph of a four-globe antique-"
             "brass cluster pendant hanging in the entry foyer of a "
             "renovated Wausau Wisconsin Craftsman home, bulbs ON casting a "
             "warm glow, oak hardwood floor, simple console table below with "
             "a ceramic bowl for keys, large framed black-and-white "
             "photograph on the wall. Shot on 35mm at f/4, eye level, sharp "
             "throughout. Mixed Edison-bulb warm glow and soft daylight, "
             "3000K. Magazine-quality entry, photoreal."),
            ("4:3",
             "Photorealistic photograph of the same four-globe brass cluster "
             "pendant hanging above a round dining table in a small breakfast "
             "nook, bulbs ON, two bentwood chairs visible, white-painted "
             "wainscot. Shot on 35mm at f/4.5, eye level, sharp throughout. "
             "Warm bulb glow mixed with morning daylight, 3200K. Cozy "
             "Wisconsin home detail, no CGI."),
        ],
    ),
    (
        "PL-000612", "16:9",
        "Photorealistic product photograph of a pair of brushed-brass swing-"
        "arm wall sconces with linen drum shades (lights off), mounted on a "
        "section of soft warm-grey wall in a studio set, arms positioned "
        "extended outward. Shot on 50mm at f/5.6, eye level, even exposure. "
        "Softbox key from camera-front, subtle rim light showing the brass "
        "grain and linen texture, 4200K. True brushed-brass color, accurate "
        "linen texture, no plastic look, photoreal lighting catalog quality.",
        [
            ("16:9",
             "Photorealistic interior photograph of a pair of brushed-brass "
             "swing-arm sconces with linen shades mounted on the wall above "
             "a low platform bed in a primary bedroom, both lights ON casting "
             "warm pools of light, white linen bedding, walnut nightstands "
             "below with stacked books. Shot on 24mm at f/4, eye level, sharp "
             "throughout. Mixed warm sconce glow and dim ambient light, "
             "3200K. Magazine-quality bedroom, photoreal."),
            ("4:3",
             "Photorealistic interior photograph of one of the brushed-brass "
             "swing-arm sconces mounted in a reading nook beside a leather "
             "club chair, light ON, swing arm extended over the chair, small "
             "side table with an open book and a ceramic mug of tea. Shot on "
             "35mm at f/4, eye level, sharp focus on the sconce shade. Warm "
             "sconce glow, 3000K. Cozy reading corner, no CGI."),
        ],
    ),
    (
        "PL-000616", "3:4",
        "Photorealistic product photograph of a single matte-black wall "
        "sconce with a frosted-glass cylindrical shade pointing upward (light "
        "off), mounted on a section of soft warm-grey wall in a studio set. "
        "Shot on 50mm at f/5.6, eye level, even exposure. Softbox key from "
        "camera-front, subtle rim light showing the housing profile, 4200K. "
        "True matte-black finish with subtle texture, accurate frosted glass, "
        "no plastic look, photoreal lighting catalog quality.",
        [
            ("3:4",
             "Photorealistic interior photograph of a matte-black wall sconce "
             "with frosted-glass shade mounted beside a frameless mirror over "
             "a bathroom vanity, light ON, casting soft up-glow on the wall. "
             "White marble-look tile, white vanity with brass faucet just "
             "visible at the bottom. Shot on 35mm at f/4, eye level, sharp "
             "throughout. Mixed sconce warm light and cool daylight, 3800K. "
             "Magazine-quality bath, photoreal."),
            ("4:3",
             "Photorealistic interior photograph of the same matte-black wall "
             "sconce mounted at the top of a stairwell, light ON, casting "
             "soft up-glow on a soft-white plaster wall, white-painted oak "
             "stair treads just visible at the bottom of frame, simple "
             "framed art beside it. Shot on 35mm at f/4.5, eye level, sharp "
             "focus on the sconce. Warm sconce glow, 3400K. Real residential "
             "hallway detail, no CGI."),
        ],
    ),

    # ---------------- TRIM (4 more) ----------------
    (
        "PL-000704", "16:9",
        "Photorealistic warehouse product photograph of a tidy bundle of "
        "primed-white solid-wood crown molding profiles, 4-5/8 inch face, "
        "bundled with paper banding, sitting on a wood pallet in a building-"
        "supply warehouse. Crisp factory-fresh paint, visible profile detail "
        "at the cut ends showing the ogee curve. Shot on 35mm at f/5.6, eye "
        "level, leading lines drawing the eye into the bundle. Cool overhead "
        "fluorescent mixed with daylight from a bay door behind camera, "
        "5200K. Blurred steel racking behind, accurate proportions, no CGI.",
        [
            ("16:9",
             "Photorealistic interior architecture photograph of finished "
             "primed-white crown molding installed where the wall meets the "
             "ceiling in a traditional living room of a Wausau Wisconsin "
             "home, painted-white ceiling, soft-grey wall, oak hardwood "
             "floor partially visible. Shot on 24mm at f/4, slight upward "
             "angle, sharp focus on the crown molding profile. Soft natural "
             "daylight from a window camera-right, 4500K. Magazine-quality "
             "trim work detail, no CGI."),
            ("4:3",
             "Photorealistic close-up photograph of installed crown molding "
             "in a dining room corner, showing the mitered inside corner "
             "joint with crisp paint and a slight shadow line below. Warm "
             "wall color, edge of a framed botanical print visible at the "
             "bottom. Shot on 50mm at f/4, sharp focus on the joint. Soft "
             "warm interior light, 3600K. Carpenter-quality detail, photoreal."),
        ],
    ),
    (
        "PL-000708", "16:9",
        "Photorealistic warehouse product photograph of a tidy bundle of "
        "primed-white MDF door and window casing profiles, 2-1/4 inch face "
        "with a soft beaded edge, bundled with paper banding, stacked on a "
        "wood pallet in a building-supply warehouse. Crisp factory-fresh "
        "paint, visible profile detail at the cut ends. Shot on 35mm at "
        "f/5.6, eye level, leading lines drawing the eye into the bundle. "
        "Cool overhead fluorescent mixed with daylight from a bay door "
        "behind camera, 5200K. Blurred steel racking behind, accurate "
        "proportions, no CGI.",
        [
            ("4:3",
             "Photorealistic interior photograph of finished primed-white "
             "casing installed around a six-panel interior door in a hallway "
             "of a traditional Wausau Wisconsin home, oak hardwood floor, "
             "soft-warm-grey wall, satin-nickel lever handle on the door. "
             "Shot on 35mm at f/4, eye level, sharp throughout. Soft natural "
             "daylight from a window down the hall, 4500K. Lived-in detail, "
             "photoreal."),
            ("4:3",
             "Photorealistic interior photograph of the same primed-white "
             "casing installed around a double-hung window in a sun-filled "
             "bedroom, white-painted wall, gauzy curtain partially visible, "
             "wood floor at the bottom of frame. Shot on 35mm at f/4.5, eye "
             "level, sharp focus on the casing miter joint at the top "
             "corner. Soft warm morning light, 4200K. Real home detail, no "
             "CGI."),
        ],
    ),
    (
        "PL-000712", "16:9",
        "Photorealistic warehouse product photograph of a tidy bundle of "
        "primed-white solid-pine shoe molding pieces, 3/4 inch by 1/2 inch "
        "profile, bundled with paper banding, stacked on a wood pallet in a "
        "building-supply warehouse. Crisp factory-fresh paint, visible "
        "profile detail at the cut ends showing the small quarter-round "
        "curve. Shot on 35mm at f/5.6, eye level, leading lines drawing the "
        "eye into the bundle. Cool overhead fluorescent mixed with daylight, "
        "5200K. Blurred steel racking behind, no CGI.",
        [
            ("4:3",
             "Photorealistic close-up photograph of finished primed-white "
             "shoe molding installed where painted-white baseboard meets oak "
             "hardwood flooring in a hallway of a renovated Wausau "
             "Wisconsin home. Visible mitered corner of the molding running "
             "into a doorway. Shot on 50mm at f/4, slight downward angle, "
             "sharp focus on the molding. Soft natural daylight, 4500K. "
             "Carpenter-quality detail, photoreal."),
            ("4:3",
             "Photorealistic photograph of the same primed-white shoe "
             "molding installed where baseboard meets large-format porcelain "
             "tile in a bathroom, with the corner of a freestanding tub "
             "barely visible at the top of frame. Shot on 50mm at f/4.5, "
             "slight downward angle, sharp focus on the molding. Soft cool "
             "daylight, 5000K. Spa-magazine trim detail, no CGI."),
        ],
    ),
    (
        "PL-000716", "16:9",
        "Photorealistic warehouse product photograph of a tidy bundle of "
        "primed-white MDF chair-rail trim, 2-5/8 inch face with a traditional "
        "stepped profile, bundled with paper banding, stacked on a wood "
        "pallet in a building-supply warehouse. Crisp factory-fresh paint, "
        "visible profile detail at the cut ends. Shot on 35mm at f/5.6, eye "
        "level, leading lines drawing the eye into the bundle. Cool overhead "
        "fluorescent mixed with daylight from a bay door behind camera, "
        "5200K. Blurred steel racking behind, no CGI.",
        [
            ("16:9",
             "Photorealistic interior architecture photograph of finished "
             "primed-white chair-rail molding installed at hip height around "
             "a traditional dining room of a Wausau Wisconsin home, white "
             "beadboard wainscot below the rail, deep-navy paint above, oak "
             "hardwood floor, edge of a wood dining chair visible. Shot on "
             "24mm at f/4, eye level, sharp throughout. Soft natural daylight "
             "from a window camera-right, 4500K. Traditional Midwest "
             "residential detail, photoreal."),
            ("4:3",
             "Photorealistic close-up photograph of installed chair-rail "
             "molding capping the top of beadboard wainscot in a stairwell, "
             "showing the joint detail where the rail meets the wall above. "
             "Painted-white wainscot, soft-warm-grey wall above, edge of an "
             "oak handrail just visible. Shot on 50mm at f/4, sharp focus on "
             "the chair rail. Soft natural daylight, 4500K. Carpenter-"
             "quality detail, no CGI."),
        ],
    ),
]


# ---------------------------------------------------------------------------
# EXISTING ITEMS — scene-01 and scene-02 only (hero stays put)
# Maps SKU -> [(scene_ratio, scene_prompt), ...]
# ---------------------------------------------------------------------------

EXISTING_SCENES = {
    "PL-000101": [  # white 5-panel pre-hung interior door
        ("4:3",
         "Photorealistic interior photograph of a white pre-hung five-panel "
         "shaker interior door installed as a bedroom entry off a hallway in "
         "a renovated Wausau Wisconsin home, brushed-nickel lever handle, "
         "oak hardwood floor, painted-white casing, soft-grey hallway wall. "
         "Shot on 35mm at f/4, eye level, sharp throughout. Soft natural "
         "daylight from a window down the hall, 4500K. Photoreal."),
        ("4:3",
         "Photorealistic interior photograph of the same white five-panel "
         "shaker door installed as the entry to a small office, door "
         "partially open showing a walnut desk inside. Painted-white casing, "
         "oak floor. Shot on 35mm at f/4.5, eye level, sharp focus on the "
         "lever. Warm window daylight, 4200K. Photoreal."),
    ],
    "PL-000104": [  # reclaimed pine
        ("4:3",
         "Photorealistic interior photograph of a reclaimed five-panel solid-"
         "pine door with original honey patina installed as a pantry entry "
         "in a renovated farmhouse kitchen, oil-rubbed bronze thumb latch, "
         "white shaker cabinets visible at the edges. Shot on 35mm at f/4, "
         "eye level, sharp throughout. Warm late-afternoon daylight, "
         "3800K. Lived-in farmhouse quality, photoreal."),
        ("4:3",
         "Photorealistic interior photograph of the same reclaimed pine door "
         "installed as the entry to a finished basement workshop, door "
         "partially open showing pegboard wall inside, oil-rubbed bronze "
         "latch. Painted-white casing, concrete floor. Shot on 35mm at "
         "f/4.5, eye level, sharp focus on the door panels. Warm overhead "
         "shop light, 3400K. Authentic age character, no CGI."),
    ],
    "PL-000110": [  # matte black steel exterior door
        ("4:3",
         "Photorealistic exterior photograph of a matte-black steel exterior "
         "door installed as the front entry of a modern farmhouse in Wausau "
         "Wisconsin, polished-chrome deadbolt, simple grey-stained porch "
         "boards, two black planters with boxwood. Shot on 35mm at f/4, eye "
         "level, sharp throughout. Soft natural daylight, 5000K. Magazine-"
         "quality curb-appeal shot, photoreal."),
        ("4:3",
         "Photorealistic interior photograph of the same matte-black steel "
         "door seen from inside an entry foyer, polished-chrome deadbolt, "
         "oak hardwood floor, simple grey runner rug, console table with a "
         "ceramic bowl for keys. Shot on 35mm at f/4.5, eye level, sharp "
         "focus on the deadbolt. Mixed warm sconce and cool daylight from "
         "sidelights, 4000K. Photoreal."),
    ],
    "PL-000201": [  # white vinyl double-hung
        ("4:3",
         "Photorealistic interior photograph of a white vinyl double-hung "
         "window installed above a kitchen breakfast nook in a Wausau "
         "Wisconsin Craftsman home, painted-white casing, oak table with two "
         "chairs visible, gauzy linen curtain pulled back. Shot on 35mm at "
         "f/4, eye level, sharp throughout. Warm morning daylight pouring "
         "through, 4200K. Lived-in detail, photoreal."),
        ("4:3",
         "Photorealistic interior photograph of the same white vinyl double-"
         "hung window installed in a bedroom, painted-white casing, sash "
         "partially raised, gauzy white curtain. Edge of a linen-upholstered "
         "headboard at the bottom of frame. Shot on 35mm at f/4.5, eye "
         "level, sharp focus on the sash lock. Soft natural light, 4500K. "
         "Photoreal."),
    ],
    "PL-000208": [  # matte-black casement
        ("3:4",
         "Photorealistic interior photograph of a matte-black aluminum-frame "
         "casement window installed in a modern bathroom above a freestanding "
         "soaker tub, crank-out hardware, large-format marble-look tile "
         "walls, brushed-nickel tub filler. Shot on 35mm at f/4, eye level, "
         "sharp throughout. Soft cool natural daylight, 5000K. Spa-magazine "
         "quality, photoreal."),
        ("4:3",
         "Photorealistic interior photograph of the same matte-black casement "
         "window installed in a home office above a walnut desk, painted-"
         "white casing, brass desk lamp, leather chair. Shot on 35mm at "
         "f/4.5, eye level, sharp focus on the crank handle. Soft natural "
         "afternoon light, 4500K. Quiet office detail, no CGI."),
    ],
    "PL-000301": [  # 30in white shaker base cabinet
        ("4:3",
         "Photorealistic kitchen photograph of a 30-inch white shaker base "
         "cabinet installed as part of a galley kitchen run in a renovated "
         "Wausau Wisconsin home, brushed-nickel cup pulls, honed quartz "
         "countertop above, subway-tile backsplash. Shot on 35mm at f/4, "
         "eye level, sharp throughout. Warm window daylight, 4200K. Real "
         "kitchen scene, photoreal."),
        ("4:3",
         "Photorealistic photograph of the same 30-inch white shaker base "
         "cabinet installed as part of a wet bar in a finished basement, "
         "with a quartz top, bar sink, and brushed-nickel cup pulls. Subway "
         "tile backsplash, two rocks glasses on the counter. Shot on 35mm "
         "at f/4.5, eye level, sharp focus on the cup pull. Warm pendant "
         "light, 3400K. Photoreal."),
    ],
    "PL-000305": [  # 36in espresso wall cabinet
        ("4:3",
         "Photorealistic kitchen photograph of a 36-inch espresso shaker "
         "wall cabinet installed over a small kitchen counter in a "
         "townhouse, satin-nickel knobs, quartz countertop below, glass "
         "canisters of pasta and rice on the counter. Shot on 35mm at f/4, "
         "eye level, sharp throughout. Warm pendant light overhead, 3600K. "
         "Real urban kitchen, photoreal."),
        ("4:3",
         "Photorealistic photograph of the same espresso shaker wall cabinet "
         "installed in a coffee-bar nook above a walnut counter, one door "
         "open showing stacked white mugs inside, espresso machine on the "
         "counter, small wood tray with a sugar caddy. Shot on 35mm at "
         "f/4.5, eye level, sharp focus on the open shelf. Warm pendant "
         "light, 3400K. Lived-in coffee corner, no CGI."),
    ],
    "PL-000401": [  # 48in white vanity quartz
        ("16:9",
         "Photorealistic bathroom photograph of a 48-inch white shaker "
         "single-sink vanity with quartz top and brushed-nickel pulls "
         "installed as the focal piece of a primary bath in a Wausau "
         "Wisconsin home, large frameless mirror above, brushed-nickel "
         "sconces, marble-look tile floor, brass towel bar to one side. "
         "Shot on 24mm at f/4, eye level, sharp throughout. Soft natural "
         "daylight, 4500K. Magazine-quality bath, photoreal."),
        ("4:3",
         "Photorealistic close-up photograph of the same 48-inch white "
         "vanity quartz top, with the brushed-nickel faucet running gently "
         "into the porcelain basin, small ceramic dish for rings, folded "
         "white linen washcloth on the counter. Shot on 50mm at f/4, "
         "slight angle, sharp focus on the faucet. Warm morning window "
         "light, 4000K. Photoreal lifestyle detail."),
    ],
    "PL-000501": [  # matte black pulls 10pk
        ("4:3",
         "Photorealistic kitchen detail photograph of matte-black bar pulls "
         "installed on the lower drawers of a soft-grey shaker kitchen "
         "island, marble countertop above just at the top of frame, light "
         "oak floor at the bottom. Shot on 50mm at f/4, sharp focus on the "
         "closest pull. Soft natural daylight camera-left, 4500K. Magazine-"
         "quality kitchen detail, photoreal."),
        ("4:3",
         "Photorealistic detail photograph of matte-black bar pulls "
         "installed on the drawers of a primary-bath vanity, white shaker "
         "base, marble countertop, edge of a matte-black faucet just "
         "visible. Shot on 50mm at f/4.5, sharp focus on the pull. Soft "
         "cool daylight, 5000K. Spa-bath detail, no CGI."),
    ],
    "PL-000601": [  # 3-light brass vanity bar
        ("16:9",
         "Photorealistic bathroom photograph of a 24-inch three-light "
         "brushed-brass vanity bar fixture mounted above a frameless mirror "
         "over a white shaker bathroom vanity, all three bulbs ON casting "
         "warm light, marble-look tile, white vanity with brass faucet. "
         "Shot on 24mm at f/4, eye level, sharp throughout. Mixed warm "
         "bulb glow and cool daylight, 3800K. Magazine-quality bath, "
         "photoreal."),
        ("4:3",
         "Photorealistic photograph of the same three-light brass vanity "
         "bar mounted over a small mirror in a powder room, light ON, "
         "small white pedestal sink below, beadboard wainscot, framed "
         "art beside the mirror. Shot on 35mm at f/4.5, eye level, sharp "
         "focus on the fixture. Warm bulb glow, 3400K. Cozy powder room, "
         "no CGI."),
    ],
    "PL-000701": [  # primed MDF base trim
        ("4:3",
         "Photorealistic close-up photograph of installed primed-white MDF "
         "base trim where painted-white baseboard meets oak hardwood floor "
         "in a hallway of a renovated Wausau Wisconsin home, painted-white "
         "wall above, edge of a doorway visible. Shot on 50mm at f/4, "
         "slight downward angle, sharp focus on the trim profile. Soft "
         "natural daylight, 4500K. Carpenter-quality detail, photoreal."),
        ("4:3",
         "Photorealistic photograph of the same primed-white MDF base trim "
         "installed in a bedroom corner, painted-white wall, light-grey "
         "carpet just visible at the bottom of frame, edge of a wood "
         "nightstand to the right. Shot on 50mm at f/4.5, slight downward "
         "angle, sharp focus on the trim. Warm bedroom lamp light, 3400K. "
         "Real home detail, no CGI."),
    ],
    "BC-000801": [  # white-oak shaker custom kitchen
        ("16:9",
         "Photorealistic architecture photograph of a custom white-oak "
         "shaker kitchen run installed along one wall of a modern Wausau "
         "Wisconsin home, paired with a center island in the same finish, "
         "honed concrete countertop, matte-black faucet, two leather "
         "counter stools, simple plaster wall. Shot on 24mm at f/4, eye "
         "level, sharp throughout. Soft natural daylight, 4500K. High-end "
         "residential, photoreal."),
        ("4:3",
         "Photorealistic close-up photograph of the same white-oak shaker "
         "cabinetry, focused on the satin-brass bar pulls and the visible "
         "grain figure in one drawer front, with a hand reaching for the "
         "pull. Shot on 50mm at f/4, sharp focus on the pull. Warm window "
         "daylight, 4200K. Magazine-quality detail, no CGI."),
    ],
    "BC-000802": [  # bone-white inset kitchen
        ("16:9",
         "Photorealistic architecture photograph of a bone-white inset "
         "painted shaker kitchen with five-piece doors and polished-chrome "
         "knobs and cup pulls, installed in a bright traditional Wisconsin "
         "home, honed marble countertop, white apron-front sink, brass "
         "pendant lights above a center island, oak hardwood floor. Shot "
         "on 24mm at f/4, eye level, sharp throughout. Soft natural "
         "daylight, 5000K. High-end residential, photoreal."),
        ("4:3",
         "Photorealistic close-up photograph of the same bone-white inset "
         "kitchen, focused on the polished-chrome cup pull on one drawer "
         "front with the exposed inset reveal clearly visible, marble "
         "countertop above. Shot on 50mm at f/4, sharp focus on the cup "
         "pull. Soft natural daylight, 4800K. Furniture-grade joinery, no "
         "CGI."),
    ],
    "BC-000803": [  # calacatta quartz slab
        ("16:9",
         "Photorealistic kitchen photograph of Calacatta-style polished "
         "quartz installed as the countertop on a large kitchen island in a "
         "modern Wausau Wisconsin home, white shaker cabinets below, "
         "matte-black gooseneck faucet on an apron-front sink at the back "
         "wall, brass pendant lights above the island. Shot on 24mm at "
         "f/4, eye level, sharp throughout. Soft natural daylight, 4500K. "
         "Magazine-quality kitchen, photoreal."),
        ("4:3",
         "Photorealistic close-up photograph of the same Calacatta quartz "
         "countertop, focused on the bold grey veining with a small white "
         "ceramic bowl of lemons and a sprig of rosemary on the surface. "
         "Shot on 50mm at f/4, slight overhead angle, sharp focus on the "
         "lemons. Warm window light camera-left, 4200K. Food-magazine "
         "detail, no CGI."),
    ],
}


# ---------------------------------------------------------------------------
# Generator
# ---------------------------------------------------------------------------

def generate(prompt: str, ratio: str) -> tuple[bytes, str]:
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": ratio},
        },
    }
    resp = requests.post(ENDPOINT, json=payload, timeout=300)
    if resp.status_code != 200:
        raise RuntimeError(f"HTTP {resp.status_code}: {resp.text[:400]}")
    data = resp.json()
    for cand in data.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                mime = inline.get("mimeType") or inline.get("mime_type") or "image/png"
                ext = mime.split("/")[-1].replace("jpeg", "jpg")
                return base64.b64decode(inline["data"]), ext
    raise RuntimeError(f"No image in response. Keys: {list(data.keys())}")


def generate_with_retry(prompt: str, ratio: str) -> tuple[bytes, str]:
    """One transparent retry on transient failure."""
    try:
        return generate(prompt, ratio)
    except Exception as e:  # noqa: BLE001
        print(f"        retry after error: {e}", flush=True)
        time.sleep(3)
        return generate(prompt, ratio)


def write_image(path: Path, prompt: str, ratio: str) -> bool:
    if path.exists() and path.stat().st_size > 4096:
        print(f"        SKIP {path.name} (exists, {path.stat().st_size // 1024} KB)")
        return True
    t0 = time.time()
    try:
        img, _ext = generate_with_retry(prompt, ratio)
        path.write_bytes(img)
        print(
            f"        saved {path.name} ({len(img) // 1024} KB) in "
            f"{time.time() - t0:.1f}s",
            flush=True,
        )
        return True
    except Exception as e:  # noqa: BLE001
        print(f"        FAILED {path.name}: {e}", file=sys.stderr, flush=True)
        return False


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Plan total
    total = 0
    for sku, _r, _p, scenes in NEW_ITEMS:
        total += 1 + len(scenes)
    for _sku, scenes in EXISTING_SCENES.items():
        total += len(scenes)

    print(f"Using model: {MODEL}")
    print(f"Writing to: {OUT_DIR}")
    print(f"New items:  {len(NEW_ITEMS)}")
    print(f"Existing items needing scenes: {len(EXISTING_SCENES)}")
    print(f"Total images to generate: {total}")
    print("---")

    done = 0
    ok = 0

    # NEW items first
    for sku, hero_ratio, hero_prompt, scenes in NEW_ITEMS:
        print(f"=== {sku} ===")
        done += 1
        print(f"[{done:03d}/{total}] {sku}-hero ({hero_ratio})")
        if write_image(OUT_DIR / f"{sku}-hero.jpg", hero_prompt, hero_ratio):
            ok += 1
        for i, (ratio, prompt) in enumerate(scenes, start=1):
            done += 1
            name = f"{sku}-scene-{i:02d}.jpg"
            print(f"[{done:03d}/{total}] {name} ({ratio})")
            if write_image(OUT_DIR / name, prompt, ratio):
                ok += 1

    # EXISTING items
    for sku, scenes in EXISTING_SCENES.items():
        print(f"=== {sku} (existing) ===")
        for i, (ratio, prompt) in enumerate(scenes, start=1):
            done += 1
            name = f"{sku}-scene-{i:02d}.jpg"
            print(f"[{done:03d}/{total}] {name} ({ratio})")
            if write_image(OUT_DIR / name, prompt, ratio):
                ok += 1

    print(f"---\n{ok}/{total} images generated. See {OUT_DIR}")


if __name__ == "__main__":
    main()
