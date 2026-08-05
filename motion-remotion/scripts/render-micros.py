#!/usr/bin/env python3
"""Render SKU micros from Gemini cutouts: props -> remotion -> bt709 normalize -> frames -> verify."""
import json
import subprocess
import sys
from pathlib import Path

BASE = Path("/Users/aaron/Priceless Building Center/priceless-building")
MR = BASE / "motion-remotion"
PRODUCTS = MR / "public" / "products"
REVIEW = BASE / "docs" / "motion" / "renders" / "review-sheets"
SCRATCH = Path(__file__).parent / "props"; SCRATCH.mkdir(exist_ok=True)

# slug | cutout basename (in public/products) | title | subtitle
MANIFEST = [
    # swaps (approved copy, verbatim)
    ("paisley", "blue-patterned-bath-sink-gemini-cutout.png", "Blue Paisley Artist Basin", "Hand-patterned oval bath sink"),
    ("copper", "copper-sink-wood-counter-display-gemini-cutout.png", "Hammered Copper Vessel", "With oil-rubbed bronze faucet"),
    ("craftsman", "intake-black-craftsman-door-gemini-cutout.png", "Black Craftsman Entry Door", "White four-lite grid window"),
    ("globe", "floor-globe-crystal-chandelier-gemini-cutout.png", "Crystal Globe Chandelier", "Banded crystal, candelabra light"),
    ("vanity", "white-vanity-black-top-gemini-cutout.png", "White Shaker Vanity", "Black stone look top"),
    # new
    ("arched8", "floor-arched-eight-panel-door-gemini-cutout.png", "Eight-Panel Arch Door", "Walnut finish, arched top"),
    ("barndoor", "floor-barn-door-diamond-glass-gemini-cutout.png", "Reclaimed Barn Door", "Diamond leaded glass and track"),
    ("artglass", "dark-wood-exterior-door-glass-gemini-cutout.png", "Dark Craftsman Entry Door", "Art glass and dentil shelf"),
    ("brownglass", "brown-exterior-door-decorative-glass-gemini-cutout.png", "Decorative Glass Entry Door", "Warm mahogany-tone finish"),
    ("oakcraftsman", "craftsman-door-warehouse-gemini-cutout.png", "Oak Craftsman Door", "Six-lite divided window"),
    ("floralbowl", "intake-kohler-floral-vessel-sink-gemini-cutout.png", "Floral Vessel Bowl", "Embossed cream ceramic"),
    ("floralunder", "kohler-floral-sink-basin-gemini-cutout.png", "Floral Undermount Basin", "With chrome widespread faucet"),
    ("crystaltexture", "patterned-sink-dark-wood-gemini-cutout.png", "Crystal Texture Basin", "Set in dark wood top"),
    ("whitevessel", "floor-white-vessel-sink-black-table-gemini-cutout.png", "Modern White Vessel", "With polished chrome faucet"),
    ("pedestal", "pedestal-sink-gold-faucet-gemini-cutout.png", "Classic Pedestal Sink", "With brushed gold faucet"),
    ("candelabra", "intake-crystal-candelabra-chandelier-gemini-cutout.png", "Crystal Candelabra Chandelier", "Polished chrome candle lights"),
    ("sputnik", "red-sputnik-chandelier-gemini-cutout.png", "Red Sputnik Chandelier", "Mid-century statement piece"),
    ("ringpendant", "pendant-light-fixture-warehouse-gemini-cutout.png", "Ring Drum Pendant", "Bronze ring openwork shade"),
    ("barreltable", "floor-barrel-glass-top-table-gemini-cutout.png", "Whiskey Barrel Table", "With round glass top"),
    ("barnwoodmirror", "reclaimed-wood-framed-mirror-gemini-cutout.png", "Barnwood Mirror", "Reclaimed frame with hooks"),
    ("espressovanity", "dark-wood-vanity-white-top-gemini-cutout.png", "Espresso Bath Vanity", "With white stone-look top"),
]

FRAMES = [17, 52, 88]


def run(cmd, **kw):
    return subprocess.run(cmd, check=False, capture_output=True, text=True, **kw)


def main():
    only = sys.argv[1:] or None
    failures = []
    for slug, cutout, title, subtitle in MANIFEST:
        if only and slug not in only:
            continue
        asset = PRODUCTS / cutout
        if not asset.exists():
            print(f"[{slug}] MISSING ASSET {cutout}", flush=True)
            failures.append(slug)
            continue
        outdir = MR / "out" / f"sku-{slug}"
        outdir.mkdir(parents=True, exist_ok=True)
        final = outdir / f"PL-{slug}-micro.mp4"
        props = {
            "title": title,
            "subtitle": subtitle,
            "description": "",
            "dimensions": "",
            "price": "",
            "productSrc": f"products/{cutout}",
            "productCutoutSrc": f"products/{cutout}",
            "brand": "priceless",
            "templateId": "PL-sku-micro-v1",
        }
        propsfile = SCRATCH / f"props-{slug}.json"
        propsfile.write_text(json.dumps(props))

        tmp = outdir / "raw.mp4"
        r = run(
            ["npx", "remotion", "render", "PL-sku-micro-v1", str(tmp),
             f"--props={propsfile}", "--overwrite", "--log=error"],
            cwd=MR,
        )
        if r.returncode != 0 or not tmp.exists():
            print(f"[{slug}] RENDER FAIL\n{r.stdout[-800:]}\n{r.stderr[-800:]}", flush=True)
            failures.append(slug)
            continue

        # Mac-safe: yuv420p, BT.709, limited range, faststart
        r = run([
            "ffmpeg", "-y", "-v", "error", "-i", str(tmp),
            "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709",
            "-c:v", "libx264", "-crf", "16", "-preset", "medium",
            "-colorspace", "bt709", "-color_primaries", "bt709",
            "-color_trc", "bt709", "-color_range", "tv",
            "-movflags", "+faststart", "-an", str(final),
        ])
        if r.returncode != 0:
            print(f"[{slug}] ENCODE FAIL\n{r.stderr[-500:]}", flush=True)
            failures.append(slug)
            continue
        tmp.unlink(missing_ok=True)

        for f in FRAMES:
            run(["ffmpeg", "-y", "-v", "error", "-i", str(final),
                 "-vf", f"select=eq(n\\,{f})", "-vframes", "1",
                 str(outdir / f"scene-{f}.png")])

        v = run(["python3", str(MR / "scripts" / "verify-mp4-not-black.py"), str(final)])
        verdict = "verify-OK" if v.returncode == 0 else f"verify-FAIL\n{v.stdout}"
        subprocess.run(["cp", str(final), str(REVIEW / final.name)], check=False)
        print(f"[{slug}] DONE {verdict}", flush=True)

    print(f"COMPLETE failures={failures or 'none'}", flush=True)


if __name__ == "__main__":
    main()
