#!/usr/bin/env python3
"""Second pass: use logo.dev Brand Search API (secret key) to resolve the
CORRECT domain for each vendor, then download that logo. Catches brands my
hand-guessed domains missed. Re-QA visually after; monograms/wrong matches
still need a human eye, so this only adds candidates, it doesn't auto-trust.
"""
import json, re, sys
from pathlib import Path
import requests

OUT = Path("public/vendor-logos")
CAND = Path("public/vendor-logos/_candidates")  # download here first for QA

def secret():
    for line in Path(".env.local").read_text().splitlines():
        m = re.match(r"\s*LOGODEV_SECRET\s*=\s*(.+)$", line)
        if m: return m.group(1).strip()
    sys.exit("no LOGODEV_SECRET")

def slug(n): return re.sub(r"-+","-",re.sub(r"[^a-z0-9]+","-",n.lower())).strip("-")

# vendors we do NOT yet have a verified logo for (text-chip today)
MISSING = [
  "Norco Windows","Semco Windows","Wolf Home Products","Stanley Hardware",
  "Viatera","Gibraltar Building Products","Air Vent","Weslock","Progress Lighting",
  "Premdor","Patriot Lighting","Home Decorators Collection","Bella Quartz",
  "Countryside Cabinetry","AFCO Railing","Titan","Marvin","Vetter Windows",
]

def main():
    tok = secret()
    CAND.mkdir(parents=True, exist_ok=True)
    H = {"Authorization": f"Bearer {tok}"}
    got = []
    for name in MISSING:
        try:
            r = requests.get("https://api.logo.dev/search", params={"q": name}, headers=H, timeout=30)
            if r.status_code != 200:
                print(f"  search fail {name}: {r.status_code}"); continue
            results = r.json()
            if not results:
                print(f"  no match: {name}"); continue
            top = results[0]
            lu = top.get("logo_url")
            if not lu:
                print(f"  no logo_url: {name} -> {top.get('domain')}"); continue
            img = requests.get(lu, timeout=30)
            if img.status_code == 200 and "image" in img.headers.get("content-type","") and len(img.content) > 600:
                (CAND / f"{slug(name)}.png").write_bytes(img.content)
                got.append(f"{name} -> {top.get('domain')} ({len(img.content)//1024}KB)")
            else:
                print(f"  dl fail {name}: {img.status_code}")
        except requests.RequestException as e:
            print(f"  err {name}: {str(e)[:50]}")
    print(f"\ndownloaded {len(got)} candidates to {CAND} (QA before promoting):")
    for g in got: print("  ?", g)

if __name__ == "__main__":
    main()
