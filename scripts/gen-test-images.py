#!/usr/bin/env python3
"""
Photorealism test for gemini-3-pro-image-preview (Nano Banana Pro).

Generates 10 product images for Price-Less Building Center using prompts
that follow the Google DeepMind Nano Banana prompt-guide pattern:
single descriptive paragraph naming the subject, material/finish,
lens/aperture, and light source.

Output: public/test-images/<NN>-<slug>.jpg (next to the storefront so we
can preview in the browser if we want).

Run from project root:
    GEMINI_API_KEY=... python3 scripts/gen-test-images.py
"""

import base64
import os
import sys
import time
from pathlib import Path

import requests

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    sys.exit(
        "GEMINI_API_KEY not set. Export it in your shell or pass it inline:\n"
        "  GEMINI_API_KEY=... python3 scripts/gen-test-images.py"
    )

MODEL = "gemini-3-pro-image-preview"
ENDPOINT = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{MODEL}:generateContent?key={API_KEY}"
)
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "test-images"

PROMPTS = [
    (
        "01-interior-door-shaker",
        "4:3",
        "Photorealistic commercial catalog photograph of a single white "
        "five-panel shaker interior door propped at a slight angle on a "
        "polished concrete warehouse floor. Brushed-nickel lever handle, "
        "factory-fresh paint, visible wood-grain panel detail. Shot on a "
        "50mm lens at f/4, sharp focus on the door face, shallow depth of "
        "field falling off into softly blurred steel pallet racking in the "
        "background. Natural daylight from an open bay door camera-right, "
        "cool 5600K, no harsh shadows. Centered three-quarter view, accurate "
        "geometry, no warped lines, no oversaturation, no CGI look.",
    ),
    (
        "02-exterior-door-black-steel",
        "4:3",
        "Photorealistic commercial product shot of a matte-black steel "
        "exterior entry door with a polished chrome deadbolt, standing "
        "upright on a clean concrete floor of a building-supply warehouse. "
        "Subtle weatherstripping visible at the edges. Shot on 50mm at "
        "f/4.5, eye-level, sharp focus on the lockset. Cool overhead "
        "fluorescent mixed with daylight from a far-off bay door, 5200K. "
        "Steel racking with cardboard packaging blurred in the background. "
        "Accurate proportions, no CGI plastic finish, true matte-black "
        "appearance with subtle texture in the powder coat.",
    ),
    (
        "03-base-cabinet-white-shaker",
        "1:1",
        "Photorealistic catalog photograph of a single 30-inch white shaker "
        "base cabinet, two doors, one drawer, brushed-nickel cup pulls and "
        "knobs. Sitting on a clean concrete warehouse floor against a soft "
        "neutral grey backdrop. Shot on 85mm at f/5.6, perfectly squared "
        "to camera, sharp throughout. Softbox key light from camera-left, "
        "subtle fill from camera-right, no specular hot spots on the paint. "
        "Crisp factory-fresh edges, visible shaker bevel reveals, no warped "
        "geometry, no oversaturated whites.",
    ),
    (
        "04-pantry-cabinet-walnut",
        "3:4",
        "Photorealistic commercial photograph of a 24-inch wide, 84-inch "
        "tall walnut shaker pantry cabinet with hand-rubbed natural finish "
        "showing real grain figure and chatoyance. Three drawers above two "
        "doors, satin-brass bar pulls. Standing upright on polished "
        "concrete in a warehouse, plain dark-grey backdrop, shot on 50mm "
        "at f/4, slightly low angle to convey height. Soft daylight key "
        "from camera-left, gentle warm fill, 4500K. Accurate proportions, "
        "true walnut color, no plastic-looking finish, no CGI artifacts.",
    ),
    (
        "05-vanity-single-marble-top",
        "4:3",
        "Photorealistic styled product shot of a 36-inch single-sink "
        "bathroom vanity. Painted navy-blue shaker base, honed Carrara "
        "marble top with grey veining, brushed-brass widespread faucet, "
        "undermount white porcelain basin. Set against a warm linen "
        "backdrop in a magazine-style showroom vignette. Shot on 85mm at "
        "f/4.5, eye level, sharp focus on the faucet, subtle bokeh on the "
        "backdrop. Soft warm key light camera-left, fill bounce camera-"
        "right, 3400K. Photorealistic, commercial bath catalog quality, "
        "no plastic-looking marble, accurate veining.",
    ),
    (
        "06-double-hung-window",
        "3:4",
        "Photorealistic product photograph of a single double-hung vinyl "
        "window, white frame, clear insulated glass, factory-applied "
        "weatherstripping visible. Leaning at a slight angle against a "
        "clean grey concrete wall in a building-supply warehouse. Shot on "
        "50mm at f/4, three-quarter view, sharp focus on the sash lock. "
        "Cool overhead fluorescent mixed with daylight, 5200K, subtle "
        "reflections in the glass showing soft warehouse interior. "
        "Accurate proportions, no warped vinyl, no CGI look.",
    ),
    (
        "07-cabinet-hardware-brushed-brass",
        "1:1",
        "Photorealistic close-up macro photograph of a set of six "
        "brushed-brass cabinet bar pulls and matching round knobs laid out "
        "in a clean grid on a white linen backdrop. Visible brushed grain "
        "in the brass, subtle warm highlights, faint shadow under each "
        "piece. Shot on a 100mm macro lens at f/8 for full sharpness, "
        "overhead softbox lighting at 4200K, perfectly even exposure. "
        "Commercial catalog photography, true brass color, no orange "
        "oversaturation, no plastic look.",
    ),
    (
        "08-painted-trim-stack",
        "16:9",
        "Photorealistic warehouse product photograph of a tidy stack of "
        "primed-and-painted white MDF trim and casing profiles bundled "
        "with paper banding, sitting on a wood pallet in a building-supply "
        "warehouse. Crisp factory-fresh paint, visible profile detail at "
        "the cut ends. Shot on 35mm at f/5.6, eye level, leading lines "
        "drawing the eye into the bundle. Cool overhead fluorescent mixed "
        "with daylight from a bay door behind camera, 5200K. Real "
        "warehouse context, blurred steel racking behind, accurate "
        "proportions, no CGI.",
    ),
    (
        "09-faucet-matte-black",
        "4:3",
        "Photorealistic styled product photograph of a single matte-black "
        "single-handle kitchen faucet with pull-down spray head, installed "
        "in an undermount stainless sink set in a butcher-block walnut "
        "countertop. Soft marble backsplash behind. Shot on 85mm at f/4, "
        "eye level, sharp focus on the spray head. Soft warm window light "
        "camera-left, gentle fill camera-right, 3400K. True matte black "
        "with subtle texture in the finish, no plastic sheen, accurate "
        "geometry, photoreal commercial kitchen catalog quality.",
    ),
    (
        "10-flush-mount-light",
        "1:1",
        "Photorealistic product photograph of a single matte-black "
        "12-inch flush-mount ceiling light with a frosted glass diffuser. "
        "Mounted on a section of clean white ceiling panel in a studio "
        "set. Shot on 50mm at f/5.6, dead-center composition, even "
        "exposure. Softbox key from camera-front, subtle rim light "
        "showing the housing profile, 4200K. The light itself is OFF, we "
        "want to show the fixture, not the glow. Accurate proportions, "
        "true matte-black finish with subtle texture, photoreal "
        "commercial lighting catalog quality.",
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
    print(f"---\n{ok}/{len(PROMPTS)} images generated. See {OUT_DIR}")


if __name__ == "__main__":
    main()
