#!/usr/bin/env python3
"""Insta360 X5 single-lens walkthrough -> clean, deduped, undistorted 4K frames.

Stages:
  1. analyze  - stream-decode each clip at reduced res, score every frame for
                sharpness (Laplacian variance), pick the sharpest frame per
                1-second window.
  2. dedupe   - drop candidates that show no real camera movement since the
                last kept frame (sequential phash), then drop revisit
                duplicates from walking back and forth (global phash match
                verified with ORB feature inliers).
  3. extract  - pull each surviving frame from the source at full 4K and
                reproject fisheye -> stereographic (conformal: text keeps its
                local shape, nothing cropped).

Usage: python3 pipeline.py <footage_dir> [--out frames] [--analyze-only]
"""

import argparse
import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import cv2
import numpy as np

ANALYSIS_W, ANALYSIS_H = 960, 540
WINDOW_SEC = 1.0
FPS = 30000 / 1001

# X5 single-lens MaxView: ~170 deg diagonal equidistant fisheye, 16:9 crop.
V360 = "v360=input=fisheye:ih_fov=148.2:iv_fov=83.3:output=sg:d_fov=170"

SEQ_HAMMING_MIN = 12     # must differ from last kept frame by at least this
GLOBAL_HAMMING_DUP = 14  # candidate revisit pairs checked when within this
ORB_DUP_INLIERS = 120    # ORB-verified inlier count that marks a duplicate


def phash64(gray: np.ndarray) -> np.uint64:
    small = cv2.resize(gray, (32, 32), interpolation=cv2.INTER_AREA)
    dct = cv2.dct(np.float32(small))[:8, :8].flatten()
    med = np.median(dct[1:])
    bits = dct > med
    return np.uint64(sum(int(b) << i for i, b in enumerate(bits)))


def hamming(a: np.uint64, b: np.uint64) -> int:
    return bin(int(a) ^ int(b)).count("1")


def analyze_clip(path: Path):
    """Stream gray frames, return per-window sharpest candidates."""
    cmd = [
        "ffmpeg", "-hide_banner", "-loglevel", "error",
        "-hwaccel", "videotoolbox",
        "-i", str(path),
        "-vf", f"scale={ANALYSIS_W}:{ANALYSIS_H},format=gray",
        "-f", "rawvideo", "-",
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, bufsize=10**8)
    frame_bytes = ANALYSIS_W * ANALYSIS_H
    win = round(FPS * WINDOW_SEC)
    candidates = []  # (frame_idx, sharpness, phash, thumb)
    best = None
    n = 0
    while True:
        buf = proc.stdout.read(frame_bytes)
        if len(buf) < frame_bytes:
            break
        gray = np.frombuffer(buf, np.uint8).reshape(ANALYSIS_H, ANALYSIS_W)
        sharp = cv2.Laplacian(gray, cv2.CV_64F).var()
        if best is None or sharp > best[1]:
            best = (n, sharp, gray.copy())
        n += 1
        if n % win == 0:
            candidates.append((best[0], best[1], phash64(best[2]), best[2]))
            best = None
    if best is not None:
        candidates.append((best[0], best[1], phash64(best[2]), best[2]))
    proc.wait()
    return n, candidates


def orb_inliers(orb, bf, g1: np.ndarray, g2: np.ndarray) -> int:
    k1, d1 = orb.detectAndCompute(g1, None)
    k2, d2 = orb.detectAndCompute(g2, None)
    if d1 is None or d2 is None or len(k1) < 50 or len(k2) < 50:
        return 0
    matches = bf.knnMatch(d1, d2, k=2)
    good = [m for m, nn in (p for p in matches if len(p) == 2)
            if m.distance < 0.75 * nn.distance]
    if len(good) < 30:
        return 0
    src = np.float32([k1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
    dst = np.float32([k2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)
    H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 5.0)
    return int(mask.sum()) if mask is not None else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("footage_dir")
    ap.add_argument("--out", default="frames")
    ap.add_argument("--analyze-only", action="store_true")
    ap.add_argument("--extract-only", action="store_true",
                    help="skip analysis/dedupe, extract from existing manifest")
    args = ap.parse_args()

    footage = Path(args.footage_dir)
    out_dir = footage / args.out
    out_dir.mkdir(exist_ok=True)
    clips = sorted(footage.glob("VID_*.mp4"))
    if not clips:
        sys.exit(f"no VID_*.mp4 clips in {footage}")

    if args.extract_only:
        kept = json.loads((out_dir / "manifest.json").read_text())
        extract_all(footage, out_dir, kept)
        return

    # ---- stage 1: sharpness analysis ----
    all_cands = []  # dicts across clips in chronological order
    for clip in clips:
        total, cands = analyze_clip(clip)
        print(f"[analyze] {clip.name}: {total} frames -> "
              f"{len(cands)} window candidates", flush=True)
        for idx, sharp, ph, thumb in cands:
            all_cands.append({
                "clip": clip.name, "frame": idx, "t": idx / FPS,
                "sharp": round(sharp, 1), "phash": ph, "thumb": thumb,
            })

    # ---- stage 2: dedupe ----
    orb = cv2.ORB_create(nfeatures=1500)
    bf = cv2.BFMatcher(cv2.NORM_HAMMING)
    kept, dropped_still, dropped_dup = [], 0, 0
    for c in all_cands:
        if kept:
            last = kept[-1]
            if (c["clip"] == last["clip"]
                    and hamming(c["phash"], last["phash"]) < SEQ_HAMMING_MIN):
                dropped_still += 1
                continue
        dup = False
        for k in kept[:-1]:
            if hamming(c["phash"], k["phash"]) <= GLOBAL_HAMMING_DUP:
                if orb_inliers(orb, bf, c["thumb"], k["thumb"]) >= ORB_DUP_INLIERS:
                    dup = True
                    break
        if dup:
            dropped_dup += 1
            continue
        kept.append(c)

    print(f"[dedupe] kept {len(kept)} / {len(all_cands)} "
          f"(dropped {dropped_still} no-movement, {dropped_dup} revisit dups)",
          flush=True)

    manifest = [{k: v for k, v in c.items() if k not in ("thumb", "phash")}
                | {"phash": f"{int(c['phash']):016x}"} for c in kept]
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=1))
    if args.analyze_only:
        return

    extract_all(footage, out_dir, kept)


def extract_all(footage: Path, out_dir: Path, kept: list):
    # ---- stage 3: full-res extraction with undistortion ----
    def extract(c):
        name = f"{Path(c['clip']).stem}_t{c['t']:07.2f}s.jpg"
        cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
               "-ss", f"{c['t']:.3f}", "-i", str(footage / c["clip"]),
               "-frames:v", "1", "-vf", V360, "-q:v", "2",
               str(out_dir / name)]
        subprocess.run(cmd, check=True)
        return name

    with ThreadPoolExecutor(max_workers=8) as pool:
        for i, name in enumerate(pool.map(extract, kept), 1):
            if i % 50 == 0:
                print(f"[extract] {i}/{len(kept)}", flush=True)
    print(f"[extract] done: {len(kept)} frames in {out_dir}", flush=True)


if __name__ == "__main__":
    main()
