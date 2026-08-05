#!/usr/bin/env python3
"""Fail if sampled frames look black. Usage: python3 scripts/verify-mp4-not-black.py path.mp4"""
import sys
import subprocess
import tempfile
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "-q"])
    from PIL import Image

path = Path(sys.argv[1])
# Probe duration so we never sample past EOF on short cuts
probe = subprocess.run(
    [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        str(path),
    ],
    capture_output=True,
    text=True,
    check=False,
)
duration = float(probe.stdout.strip() or "30")
times = [max(0.5, duration * r) for r in (0.05, 0.25, 0.5, 0.75, 0.9)]
ok = True
with tempfile.TemporaryDirectory() as td:
    for t in times:
        out = Path(td) / f"{t}.png"
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-ss",
                str(t),
                "-i",
                str(path),
                "-frames:v",
                "1",
                "-update",
                "1",
                str(out),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )
        if not out.exists():
            print(f"t={t}s MISSING_FRAME")
            ok = False
            continue
        im = Image.open(out).convert("RGB")
        avg = sum(sum(c) for c in im.getdata()) / (im.width * im.height * 3)
        status = "PASS" if avg > 15 else "FAIL_BLACK"
        if avg <= 15:
            ok = False
        print(f"t={t}s brightness={avg:.1f} {status}")
sys.exit(0 if ok else 1)
