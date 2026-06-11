#!/usr/bin/env python3
"""Download vendor logos into public/vendor-logos/ as local files (one-time).

Uses the logo.dev publishable key against img.logo.dev, validates each
response is a real PNG, and writes {slug}.png. Self-hosting means no token
at runtime and instant loads. Brands that 404 or return junk are reported
and simply fall back to a text chip on the wall.
"""

import re
import sys
from pathlib import Path
import requests

PK = "pk_bi5G_wy6Tm2L7Uh5hO7wdg"  # publishable key — safe in source
OUT = Path("public/vendor-logos")

# name -> domain (mirror of the domains in lib/vendor-logos.ts)
DOMAINS = {
    "Andersen": "andersenwindows.com", "Marvin": "marvin.com",
    "JELD-WEN": "jeld-wen.com", "Masonite": "masonite.com", "Pella": "pella.com",
    "Velux": "velux.com", "Therma-Tru": "thermatru.com",
    "Steves & Sons": "stevesdoors.com", "Lynden Door": "lyndendoor.com",
    "Norco": "norcowindows.com", "Semco Windows": "semcowindows.com",
    "Alcoa": "alcoa.com", "Western Building Products": "westernbp.com",
    "Wolf Home Products": "wolfhomeproducts.com",
    "Showplace Cabinetry": "showplacecabinetry.com",
    "Koch Cabinets": "kochcabinets.com", "Viatera by LX Hausys": "viaterausa.com",
    "Schlage": "schlage.com", "Kwikset": "kwikset.com", "Weslock": "weslock.com",
    "Amerock": "amerock.com", "Blum": "blum.com", "Stanley": "stanleyhardware.com",
    "Irwin": "irwin.com", "Simpson Strong-Tie": "strongtie.com",
    "Leviton": "leviton.com", "Loctite": "loctite.com", "Grip-Rite": "grip-rite.com",
    "Ingersoll-Rand": "ingersollrand.com", "Chamberlain": "chamberlain.com",
    "M-D Building Products": "mdteam.com", "Soss": "soss.com",
    "Johnson Hardware": "johnsonhardware.com", "AFCO": "afcorailing.com",
    "Trex": "trex.com", "Kohler": "kohler.com", "Delta": "deltafaucet.com",
    "Newport Brass": "newportbrass.com", "Duravit": "duravit.com",
    "Samuel Heath": "samuel-heath.com", "Progress Lighting": "progresslighting.com",
    "Air Vent Inc.": "airvent.com",
    "Gibraltar Building Products": "gibraltarbuildingproducts.com",
    "Quikrete": "quikrete.com",
}


def slug(name):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", name.lower())).strip("-")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    ok, fail = [], []
    for name, domain in DOMAINS.items():
        url = f"https://img.logo.dev/{domain}?token={PK}&size=256&format=png&retina=true"
        try:
            r = requests.get(url, timeout=30)
            ct = r.headers.get("content-type", "")
            if r.status_code == 200 and "image" in ct and len(r.content) > 600:
                (OUT / f"{slug(name)}.png").write_bytes(r.content)
                ok.append(f"{name} ({len(r.content)//1024}KB)")
            else:
                fail.append(f"{name} [{r.status_code} {ct} {len(r.content)}B]")
        except requests.RequestException as e:
            fail.append(f"{name} [{str(e)[:40]}]")
    print(f"downloaded {len(ok)}/{len(DOMAINS)} logos -> {OUT}")
    for x in ok:
        print("  ok  ", x)
    if fail:
        print("\nno logo (will show text chip):")
        for x in fail:
            print("  --  ", x)


if __name__ == "__main__":
    main()
