#!/usr/bin/env python3
"""Batch-generate Lyria 3 brand beds (no autoplay), convert to 30s .m4a matching
the 08 Music library, and log every prompt recipe. Key is read from the fixed
compose.py so no secret lives here.
Usage: python3 gen-music-batch.py            # runs the PROMPTS below
"""
import re, base64, json, subprocess
from pathlib import Path
from urllib import request as urlreq

COMPOSE = Path("/Users/aaron/School/Curriculum Builder April 6th/compose.py")
KEY = re.search(r'GEMINI_API_KEY\s*=\s*"([^"]+)"', COMPOSE.read_text()).group(1)
MODEL = "lyria-3-clip-preview"  # 30s clips, matches library; -pro-preview = ~100s
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}"

OUT = Path("/Users/aaron/Priceless Building Center/PRICE-LESS DELIVERABLES/08 Music/auditions")
OUT.mkdir(parents=True, exist_ok=True)

# HARD instrumental guard — Lyria keeps sneaking vocals in. Wraps every prompt.
GUARD_HEAD = "Instrumental only, absolutely no vocals, no singing, no voice, no vocal chops, no lyrics. "
GUARD_TAIL = " Strictly instrumental — no vocals of any kind, no humming, no choir."

# Direction (2026-07-29): HIGHLY-EDITED modern Super Bowl commercial instrumental —
# build-ups, filter-sweep whooshes, hard-hitting drops + transition stabs — in the
# lo-fi funk-pop lane. (whooshes/hits are WANTED now, see memory priceless-music-direction)
# APPROVED base = "heavy" (Aaron loves it). Push MORE whooshes + DISTINCT transition
# signals an editor can cut to. 4 variations on the heavy lo-fi funk base.
PROMPTS = {
    "sb-heavy-transitions":
        "Hard-hitting lo-fi funk instrumental with bold cinematic edit transitions, styled "
        "like a highly-edited Super Bowl commercial. Heavy tape-crushed drums, deep 808 sub, "
        "aggressive syncopated funk bass, dirty wah guitar, vinyl crackle. Clear section "
        "changes each marked by DISTINCT transition sounds: rising white-noise whoosh sweeps, "
        "reverse-cymbal swells, big boom impact hits, and filter-sweep risers into slamming "
        "drops. Bold, gritty, punchy, around 100 BPM, cinematic commercial mix.",
    "sb-heavy-whoosh":
        "Heavy lo-fi funk with dramatic sweeping whooshes signaling every transition. "
        "Tape-crushed drums, deep sub bass, aggressive funk bass, dirty wah guitar, vinyl "
        "grit. Big rising whoosh risers and falling downlifter sweeps lead into and out of "
        "each section, dramatic build-and-drop dynamics, hard impacts on the drops, bold and "
        "gritty, around 100 BPM, cinematic commercial mix.",
    "sb-heavy-stutter":
        "Heavy lo-fi funk with glitchy stop-and-go edited transitions. Tape-crushed drums, "
        "deep 808 sub, aggressive funk bass, dirty wah guitar, vinyl crackle. Stutter cuts, "
        "gated chops, tape-stop and reverse-hit transitions between sections, sudden silences "
        "then slamming drops, punchy and modern, around 100 BPM, cinematic commercial mix.",
    "sb-heavy-boom":
        "Heavy lo-fi funk with huge cinematic impacts at every transition. Tape-crushed "
        "drums, deep sub, aggressive funk bass, dirty wah guitar, vinyl grit. Massive boom "
        "sub-drop hits and crash impacts mark each section change, whoosh sweeps lead into "
        "them, dramatic dynamics, bold and gritty, around 98 BPM, cinematic commercial mix.",
}

def generate(slug, prompt):
    prompt = GUARD_HEAD + prompt + GUARD_TAIL
    body = json.dumps({"contents": [{"parts": [{"text": prompt}]}],
                       "generationConfig": {"responseModalities": ["AUDIO"]}}).encode()
    req = urlreq.Request(URL, data=body, headers={"Content-Type": "application/json"})
    with urlreq.urlopen(req, timeout=150) as r:
        data = json.loads(r.read())
    for part in data["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            mp3 = OUT / f"audition-{slug}.mp3"
            mp3.write_bytes(base64.b64decode(part["inlineData"]["data"]))
            m4a = OUT / f"audition-{slug}.m4a"
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(mp3),
                            "-t", "30", "-c:a", "aac", "-b:a", "256k", "-ar", "44100",
                            "-ac", "2", "-movflags", "+faststart", str(m4a)], check=True)
            mp3.unlink(missing_ok=True)
            return m4a
    return None

manifest = {}
for slug, prompt in PROMPTS.items():
    try:
        m4a = generate(slug, prompt)
        manifest[slug] = {"prompt": GUARD_HEAD + prompt + GUARD_TAIL,
                          "file": m4a.name if m4a else None}
        print(f"[{slug}] {'OK -> ' + m4a.name if m4a else 'NO AUDIO'}", flush=True)
    except Exception as e:
        print(f"[{slug}] FAIL {e}", flush=True)
(OUT / "PROMPTS.json").write_text(json.dumps(manifest, indent=2))
print(f"\nAuditions in: {OUT}")
print("COMPLETE")
