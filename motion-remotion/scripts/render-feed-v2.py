#!/usr/bin/env python3
"""Batch-render PL-feed-post-v2 for every product in feed-manifest.json.
Usage: python3 scripts/render-feed-v2.py [slug ...]"""
import json
import subprocess
import sys
from pathlib import Path

MR = Path(__file__).resolve().parent.parent
BASE = MR.parent
PLACE = BASE / "docs" / "motion" / "renders" / "placements"
PUB = MR / "public" / "placements"
REVIEW = BASE / "docs" / "motion" / "renders" / "review-sheets"
OUT = MR / "out" / "feed"
OUT.mkdir(parents=True, exist_ok=True)
PUB.mkdir(parents=True, exist_ok=True)

VF = ("scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,"
      "setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709")

manifest = json.loads((MR / "scripts" / "feed-manifest.json").read_text())
args = sys.argv[1:]
PLATES = "--plates" in args
only = set(a for a in args if not a.startswith("--"))

for item in manifest:
    slug = item["slug"]
    if only and slug not in only:
        continue
    placement = PLACE / f"{slug}-placement.png"
    if not placement.exists():
        print(f"[{slug}] NO PLACEMENT", flush=True)
        continue
    subprocess.run(["cp", str(placement), str(PUB)], check=False)
    if PLATES:
        # Textless master plate: explicit empty text so composition defaults
        # cannot leak in (Remotion merges defaultProps with input props).
        props = {"intro": "", "name": "", "descriptor": "", "tag": "",
                 "src": f"placements/{slug}-placement.png", "anchor": item["anchor"]}
    else:
        props = {
            "intro": "Introducing",
            "name": item["name"],
            "descriptor": item["descriptor"],
            "tag": "Price-Less · Wausau",
            "src": f"placements/{slug}-placement.png",
            "anchor": item["anchor"],
        }
    stem = f"PL-plate-{slug}" if PLATES else f"PL-feedv2-{slug}"
    pf = OUT / f"props-{stem}.json"
    pf.write_text(json.dumps(props))
    raw = OUT / f"raw-{slug}.mp4"
    final = OUT / f"{stem}.mp4"
    r = subprocess.run(["npx", "remotion", "render", "PL-feed-post-v2", str(raw),
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
    if not PLATES:
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(final),
                        "-vf", "select=eq(n\\,70)", "-vframes", "1",
                        str(OUT / f"v2frame-{slug}.png")], capture_output=True)
    v = subprocess.run(["python3", str(MR / "scripts" / "verify-mp4-not-black.py"),
                        str(final)], capture_output=True, text=True)
    subprocess.run(["cp", str(final), str(REVIEW / final.name)], check=False)
    print(f"[{slug}] DONE {'verify-OK' if v.returncode == 0 else 'verify-FAIL'}", flush=True)

print("COMPLETE", flush=True)
