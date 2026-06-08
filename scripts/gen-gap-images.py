#!/usr/bin/env python3
"""
Generate the 9 gap photos for the existing catalog items that don't
have a direct match in the original 10-image test batch. Same model,
same photorealism-paragraph pattern. Cost: ~$1.20 total.

Run from project root:
    GEMINI_API_KEY=... python3 scripts/gen-gap-images.py
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
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "test-images"

PROMPTS = [
    (
        "11-reclaimed-pine-door",
        "3:4",
        "Photorealistic commercial product photograph of a single reclaimed "
        "five-panel solid pine door, naturally weathered with visible original "
        "patina, knots, nail holes, and a soft warm honey tone. Standing "
        "upright against a clean grey concrete wall in a reclamation loft "
        "with worn wood floor. Shot on 50mm at f/4, three-quarter view, sharp "
        "focus on the panel detail. Warm soft daylight from a far window, "
        "3800K, gentle shadows. Authentic age character, real wood grain, no "
        "fake-distressed CGI look, accurate proportions.",
    ),
    (
        "12-black-casement-window",
        "3:4",
        "Photorealistic commercial product photograph of a single matte-black "
        "aluminum-frame casement window with crank-out hardware and clear "
        "tempered glass. Standing upright against a clean grey concrete wall "
        "in a building-supply warehouse. Shot on 50mm at f/4, three-quarter "
        "view, sharp focus on the crank handle. Cool overhead fluorescent "
        "mixed with daylight from a far bay door, 5200K, subtle reflection in "
        "the glass. True matte-black powder coat with subtle texture, no "
        "glossy plastic look, accurate proportions, no CGI.",
    ),
    (
        "13-espresso-wall-cabinet",
        "1:1",
        "Photorealistic catalog photograph of a single 36-inch espresso-brown "
        "stained shaker wall cabinet, two doors with adjustable shelves "
        "visible behind glass, satin-nickel knobs, deep rich espresso finish "
        "showing real wood grain through the stain. Sitting on a clean "
        "concrete warehouse floor against a soft neutral grey backdrop. Shot "
        "on 85mm at f/5.6, perfectly squared to camera, sharp throughout. "
        "Softbox key light from camera-left, subtle fill from camera-right. "
        "Crisp factory-fresh edges, real wood character, no plastic look.",
    ),
    (
        "14-white-vanity-quartz",
        "4:3",
        "Photorealistic styled product shot of a 48-inch single-sink "
        "bathroom vanity. Painted bright-white shaker base, polished white "
        "quartz top with faint subtle grey veining, brushed-nickel single-"
        "handle faucet, undermount white porcelain basin. Set against a warm "
        "linen backdrop in a magazine-style showroom vignette. Shot on 85mm "
        "at f/4.5, eye level, sharp focus on the faucet, subtle bokeh on the "
        "backdrop. Soft warm key light camera-left, fill bounce camera-"
        "right, 3400K. Crisp factory-fresh paint, accurate quartz texture, "
        "photoreal commercial bath catalog quality, no plastic-looking finish.",
    ),
    (
        "15-matte-black-pulls",
        "1:1",
        "Photorealistic close-up macro photograph of a set of ten matte-black "
        "solid-zinc cabinet bar pulls laid out in a clean grid on a white "
        "linen backdrop. Each pull is 5 inches center-to-center, subtle "
        "powder-coat texture in the black, faint shadow under each piece. "
        "Shot on a 100mm macro lens at f/8 for full sharpness, overhead "
        "softbox lighting at 4200K, perfectly even exposure. Commercial "
        "catalog photography, true matte-black with subtle grain in the "
        "finish, no glossy plastic look.",
    ),
    (
        "16-brass-vanity-bar",
        "16:9",
        "Photorealistic product photograph of a single 24-inch three-light "
        "brushed-brass vanity bar fixture with clear cylindrical glass shades "
        "and E26 sockets visible. Mounted horizontally on a section of soft "
        "white wall in a studio set. Shot on 50mm at f/5.6, dead-center "
        "composition, even exposure. Softbox key from camera-front, subtle "
        "rim light showing the brushed grain in the brass, 3800K. The lights "
        "themselves are off so we see the fixture, not the glow. True warm "
        "brass color, no orange oversaturation, accurate proportions.",
    ),
    (
        "17-whiteoak-shaker-kitchen",
        "16:9",
        "Photorealistic magazine-style architectural photograph of a custom "
        "white-oak shaker kitchen cabinetry run installed along one wall of "
        "a modern home. Visible grain figure in the white oak, satin-brass "
        "bar pulls, soft-close drawers and full-overlay doors, honed concrete "
        "countertop, simple plaster wall. Wide-shot at 24mm f/4, eye level, "
        "sharp throughout. Soft natural daylight from a tall window camera-"
        "right, 4500K, no hard shadows. True white-oak color and grain, no "
        "plastic-looking finish, accurate proportions, photoreal high-end "
        "residential catalog quality.",
    ),
    (
        "18-bone-white-inset-kitchen",
        "16:9",
        "Photorealistic magazine-style architectural photograph of a custom "
        "bone-white inset painted shaker kitchen with five-piece doors, "
        "exposed inset reveals, polished-chrome knobs and cup pulls, honed "
        "marble countertop with subtle grey veining. Installed in a bright "
        "well-lit room. Wide-shot at 24mm f/4, eye level, sharp throughout. "
        "Soft natural daylight from a wall of windows camera-right, 5000K, "
        "no hard shadows. True bone-white paint (warm, not stark), accurate "
        "inset detailing, photoreal high-end residential catalog quality.",
    ),
    (
        "19-calacatta-quartz-slab",
        "16:9",
        "Photorealistic warehouse product photograph of a single full slab "
        "of Calacatta-style polished white quartz, 126 inches by 63 inches, "
        "3cm thick, standing upright on an A-frame in a slab yard. Bold grey "
        "veining on a bright white field, glossy polished surface reflecting "
        "soft overhead light. Shot on 35mm at f/5.6, three-quarter view "
        "showing the slab edge thickness, sharp throughout. Cool overhead "
        "warehouse lighting mixed with daylight from open bay door, 5200K. "
        "Other slabs blurred in the background. Accurate quartz appearance, "
        "real veining (not repeating CGI patterns), photoreal commercial "
        "stone-yard catalog quality.",
    ),
]


def generate(prompt: str, ratio: str) -> tuple[bytes, str]:
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": ratio},
        },
    }
    resp = requests.post(ENDPOINT, json=payload, timeout=240)
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


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Using model: {MODEL}")
    print(f"Writing to: {OUT_DIR}")
    print(f"Prompts: {len(PROMPTS)}")
    print("---")
    ok = 0
    for i, (slug, ratio, prompt) in enumerate(PROMPTS, start=1):
        print(f"[{i:02d}/{len(PROMPTS)}] {slug} ({ratio})  ...", flush=True)
        t0 = time.time()
        try:
            img, ext = generate(prompt, ratio)
            out = OUT_DIR / f"{slug}.{ext}"
            out.write_bytes(img)
            print(
                f"        saved {out.name} ({len(img) // 1024} KB) in "
                f"{time.time() - t0:.1f}s"
            )
            ok += 1
        except Exception as e:  # noqa: BLE001
            print(f"        FAILED: {e}", file=sys.stderr)
    print(f"---\n{ok}/{len(PROMPTS)} images generated.")


if __name__ == "__main__":
    main()
