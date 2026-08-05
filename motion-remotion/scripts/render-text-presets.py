#!/usr/bin/env python3
"""Render the text-preset library (A-F) over one marketing shot, verify each,
and build a single labeled review reel for side-by-side scanning.
Usage: python3 scripts/render-text-presets.py [A B ...]"""
import json
import subprocess
import sys
from pathlib import Path

MR = Path(__file__).resolve().parent.parent
OUT = MR / "out" / "text-presets"
OUT.mkdir(parents=True, exist_ok=True)

SHOT = "placements/globe-placement.png"
FONT = "/System/Library/Fonts/Helvetica.ttc"

# preset letter -> (slug, human label for the review reel)
PRESETS = {
    "A": ("quiet-stack", "A  QUIET STACK  (current baseline)"),
    "B": ("falling-words", "B  FALLING WORDS  (live drop-in)"),
    "C": ("rail-lowerthird", "C  RAIL LOWER-THIRD  (editorial)"),
    "D": ("rise-reveal", "D  RISE REVEAL  (mask up)"),
    "E": ("split-flank", "E  SPLIT FLANK  (bold punch)"),
    "F": ("linedraw-kicker", "F  LINE-DRAW KICKER  (underline sweep)"),
}

VF = ("scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,"
      "setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709")

only = [a.upper() for a in sys.argv[1:]] or list(PRESETS.keys())
finals = []

for letter in only:
    slug, _ = PRESETS[letter]
    props = {"preset": letter, "src": SHOT}
    pf = OUT / f"props-{letter}.json"
    pf.write_text(json.dumps(props))
    raw = OUT / f"raw-{letter}.mp4"
    final = OUT / f"PL-textpreset-{letter}-{slug}.mp4"
    r = subprocess.run(
        ["npx", "remotion", "render", "PL-text-preset", str(raw),
         f"--props={pf}", "--overwrite", "--log=error"],
        cwd=MR, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"[{letter}] RENDER FAIL {r.stderr[-400:]}", flush=True)
        continue
    e = subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-vf", VF,
         "-c:v", "libx264", "-crf", "16", "-preset", "medium",
         "-colorspace", "bt709", "-color_primaries", "bt709",
         "-color_trc", "bt709", "-color_range", "tv",
         "-movflags", "+faststart", "-an", str(final)],
        capture_output=True, text=True)
    if e.returncode != 0:
        print(f"[{letter}] ENCODE FAIL {e.stderr[-300:]}", flush=True)
        continue
    raw.unlink(missing_ok=True)
    # settled frame for still review
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(final),
         "-vf", "select=eq(n\\,72)", "-vframes", "1",
         str(OUT / f"frame-{letter}.png")], capture_output=True)
    v = subprocess.run(
        ["python3", str(MR / "scripts" / "verify-mp4-not-black.py"), str(final)],
        capture_output=True, text=True)
    finals.append((letter, final))
    print(f"[{letter}] DONE {'verify-OK' if v.returncode == 0 else 'verify-FAIL'} -> {final.name}",
          flush=True)

# --- Build one labeled review reel (burned name per clip, for scanning) ------
if len(finals) > 1:
    labeled = []
    for letter, final in finals:
        _, label = PRESETS[letter]
        lab = OUT / f"lab-{letter}.mp4"
        txt = label.replace(":", "\\:").replace("'", "")
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-i", str(final), "-vf",
             (f"drawtext=fontfile={FONT}:text='{txt}':x=48:y=56:fontsize=34:"
              "fontcolor=white:alpha=0.92:box=1:boxcolor=black@0.35:boxborderw=18"),
             "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
             "-colorspace", "bt709", "-color_primaries", "bt709",
             "-color_trc", "bt709", "-color_range", "tv", str(lab)],
            capture_output=True, text=True)
        labeled.append(lab)
    concat = OUT / "concat.txt"
    concat.write_text("".join(f"file '{p}'\n" for p in labeled))
    reel = OUT / "PL-text-presets-REVIEW-REEL.mp4"
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
         "-i", str(concat), "-c", "copy", "-movflags", "+faststart", str(reel)],
        capture_output=True, text=True)
    for p in labeled:
        p.unlink(missing_ok=True)
    concat.unlink(missing_ok=True)
    print(f"REVIEW REEL -> {reel.name}", flush=True)

print("COMPLETE", flush=True)
