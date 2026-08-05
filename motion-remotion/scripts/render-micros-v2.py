#!/usr/bin/env python3
"""Serif-quiet SKU micros (PL-sku-micro-v2) for every product in feed-manifest.json.
Usage: python3 scripts/render-micros-v2.py [slug ...]"""
import json
import subprocess
import sys
from pathlib import Path

MR = Path(__file__).resolve().parent.parent
REVIEW = MR.parent / "docs" / "motion" / "renders" / "review-sheets"
OUT = MR / "out" / "micro-v2"
OUT.mkdir(parents=True, exist_ok=True)

VF = ("scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,"
      "setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709")

CUTOUTS = {
    "arched8": "floor-arched-eight-panel-door-trim.png",
    "barndoor": "floor-barn-door-diamond-glass-trim.png",
    "artglass": "dark-wood-exterior-door-glass-trim.png",
    "brownglass": "brown-exterior-door-decorative-glass-trim.png",
    "oakcraftsman": "craftsman-door-warehouse-trim.png",
    "craftsman": "intake-black-craftsman-door-trim.png",
    "copper": "copper-sink-wood-counter-display-gemini-cutout-trim.png",
    "paisley": "blue-patterned-bath-sink-gemini-cutout-trim.png",
    "floralbowl": "intake-kohler-floral-vessel-sink-gemini-cutout-trim.png",
    "floralunder": "kohler-floral-sink-basin-gemini-cutout-trim.png",
    "crystaltexture": "patterned-sink-dark-wood-gemini-cutout-trim.png",
    "whitevessel": "floor-white-vessel-sink-black-table-gemini-cutout-trim.png",
    "pedestal": "pedestal-sink-gold-faucet-gemini-cutout-trim.png",
    "dragon": "dragon-pattern-sink-basin-cutout-trim.png",
    "kohlervessel": "kohler-vessel-sink-gold-faucet-studio-trim.png",
    "globe": "floor-globe-crystal-chandelier-gemini-cutout-trim.png",
    "empire": "crystal-ceiling-fan-warehouse-cutout-trim.png",
    "candelabra": "intake-crystal-candelabra-chandelier-gemini-cutout-trim.png",
    "sputnik": "red-sputnik-chandelier-gemini-cutout-trim.png",
    "ringpendant": "pendant-light-fixture-warehouse-gemini-cutout-trim.png",
    "barreltable": "floor-barrel-glass-top-table-gemini-cutout-trim.png",
    "barnwoodmirror": "reclaimed-wood-framed-mirror-gemini-cutout-trim.png",
    "espressovanity": "dark-wood-vanity-white-top-gemini-cutout-trim.png",
    "vanity": "white-vanity-black-top-gemini-cutout-trim.png",
}

manifest = json.loads((MR / "scripts" / "feed-manifest.json").read_text())
only = set(sys.argv[1:])

for item in manifest:
    slug = item["slug"]
    if only and slug not in only:
        continue
    cut = CUTOUTS.get(slug)
    if not cut or not (MR / "public" / "products" / "trim" / cut).exists():
        print(f"[{slug}] NO CUTOUT {cut}", flush=True)
        continue
    props = {
        "name": item["name"],
        "descriptor": item["descriptor"],
        "cutout": f"products/trim/{cut}",
    }
    pf = OUT / f"props-{slug}.json"
    pf.write_text(json.dumps(props))
    raw = OUT / f"raw-{slug}.mp4"
    final = OUT / f"PL-micro2-{slug}.mp4"
    r = subprocess.run(["npx", "remotion", "render", "PL-sku-micro-v2", str(raw),
                        f"--props={pf}", "--overwrite", "--log=error"],
                       cwd=MR, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"[{slug}] RENDER FAIL {r.stderr[-300:]}", flush=True)
        continue
    e = subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-vf", VF,
                        "-c:v", "libx264", "-crf", "16", "-preset", "medium",
                        "-colorspace", "bt709", "-color_primaries", "bt709",
                        "-color_trc", "bt709", "-color_range", "tv",
                        "-movflags", "+faststart", "-an", str(final)],
                       capture_output=True, text=True)
    if e.returncode != 0:
        print(f"[{slug}] ENCODE FAIL {e.stderr[-200:]}", flush=True)
        continue
    raw.unlink(missing_ok=True)
    for fr in (17, 52, 88):
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(final),
                        "-vf", f"select=eq(n\\,{fr})", "-vframes", "1",
                        str(OUT / f"{slug}-{fr}.png")], capture_output=True)
    v = subprocess.run(["python3", str(MR / "scripts" / "verify-mp4-not-black.py"),
                        str(final)], capture_output=True, text=True)
    subprocess.run(["cp", str(final), str(REVIEW / final.name)], check=False)
    print(f"[{slug}] DONE {'verify-OK' if v.returncode == 0 else 'verify-FAIL'}", flush=True)

print("COMPLETE", flush=True)
