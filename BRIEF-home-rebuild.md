# BRIEF — Price-Less homepage rebuild to reference caliber

The synthesized prompt behind Aaron's words (2026-07-10). Governs the rebuild.
Read with DESIGN.md (tokens/fonts) and wireframe-storefront.md (section order).

## The real ask (what Aaron actually means)

> "Bold and flashy — people should see Price-Less and say *I want to go there.*
> I love the light theme. Match the CALIBER of the reference sites' real HTML/CSS.
> What you gave me was vibe-coded: tan+blue, gimmick pills, generic cards, a
> floating stat badge — that screams 'AI made this, lazy, not professional
> marketing.' Study the actual sites. Stitch their sections. Recreate at that
> quality. Take your time; do not rush a mockup."

The palette was never the problem (DESIGN.md navy+gold on cream is correct and is
literally what remodelingjourney.com uses). The problem was **execution craft**:
the previous attempt reached for the AI-homepage tropes these professional sites
deliberately avoid. This brief is about matching their craft, not their colors.

## The ceiling — what the reference sites actually do (scouted 2026-07-10)

- **sicora.com** — Cormorant serif ~54px, line-height 1.0, over a FULL-BLEED
  styled architectural photo. Warm cream `#fbfaf7`, warm near-black ink `#262420`.
  Centered logo nav. Buttons are near-invisible (text, lowercase, no fill). The
  PHOTO is the hero; type is a quiet overlay in a delicate frosted panel.
- **remodelingjourney.com** (Josh's anchor, a real Wausau remodeler) — navy header,
  ONE gold pill CTA (`rgb(207,151,37)` ≈ our brass), slab serif headline (Josefin/
  Roboto Slab) centered over a scrimmed room photo, a TRUST CLUSTER (3 customer
  avatars + "5-STAR-RATED ON Google"), and a stat row with GOLD numerals. Confirms
  our system; adds the trust cluster we were missing.
- **chairish.com** — premium retail: utility bar + real search + horizontal category
  nav; editorial hero (big lifestyle photo + serif eyebrow + moderno serif headline
  + RECTANGULAR black CTA). Whitespace-driven merchandising, restraint.
- **blockrenovation.com** — the bold pole: 100px headline, letter-spacing -4px, over
  a full-bleed lifestyle photo, one confident accent button. Bold = SCALE + PHOTO,
  not decoration.

Common denominators = the quality bar: **full-bleed real photography carries every
hero; type is large, confident, and restrained; whitespace is generous; buttons are
few and quiet; a genuine trust ladder (Google stars, years, reviews) is present.**

## Craft rules (do / never)

DO:
- Photography-forward heroes. A real store/install photo is the hero surface, not a
  decorative card beside text. Navy multiply/gradient only for legibility.
- Big, confident display type (Besley) at real editorial scale; tight leading; title
  case, never forced uppercase. Let one headline own the viewport.
- Generous vertical rhythm (reference sections run 60–120px padding). Whitespace.
- A real trust cluster near the top: 4.8★ Google, "serving Wisconsin since 1978",
  review count — styled like remodelingjourney, not a lone floating badge.
- Buttons: at most one primary per view. Gold pill (navy ink) for the single primary;
  everything else is a quiet text link with an arrow. No stacks of loud buttons.
- Gold reserved for accents/emphasis/savings; red ONLY for % off. Navy carries weight.
- Real photos throughout (141 in /public/real-photos). Merchandise the surplus like
  a curated hunt (chairish/rejuvenation), not a junk bin.

NEVER (the vibe-code tells that killed the last attempt):
- Gimmick status pills ("● Open today · Wausau · Since 1978" as a rounded chip).
- Floating stat cards over the hero photo ("67% under retail" badge).
- Generic even N-up category card grids with gradient scrims + arrow chips.
- Auto-scrolling photo marquees as decoration.
- Gold on gold on gold; loud button pairs; emoji; centered-everything.
- Tan/beige as a fill color instead of a warm neutral GROUND. Cream is the paper,
  not a block.

## Section plan (home) — stitched from the references, mapped to our content

Order per wireframe-storefront.md, re-treated to the ceiling above:
1. **Header** — light, real search + horizontal dept nav (chairish), navy wordmark,
   one gold CTA. Sticky, quiet.
2. **Hero** — full-bleed hero photo (finished kitchen / warehouse), navy legibility
   wash, big Besley headline ("Wausau's one-stop shop for everything."), one gold
   pill + one text link, and the trust cluster (remodelingjourney).
3. **Stats strip** — gold numerals, quiet labels (remodelingjourney stat row).
4. **Catalog band** — "On the floor right now": real search + dept pills + REAL
   ProductCards (wire to Supabase items). Merchandised (chairish restraint).
5. **Family band (navy)** — Price-Less / Builders Corner (Marcellus) / 4 Squared,
   "use one or all three" = wrap-into-one, real photos.
6. **Reviews** — 4.8★ Google, real quotes (trust ladder, sicora restraint).
7. **Timeline** — 1978→2025 history w/ real clippings (editorial, block storytelling).
8. **Before/after portfolio** — real installs; the remodeling journey.
9. **Warehouse gallery** — real floor photos, opens lightbox.
10. **Walkthrough** — "see it in your home before you buy" numbered steps.
11. **Brand statement (navy) + Newsletter + Visit/map** — close with trust + address.

## Fonts / tokens (honor exactly — DESIGN.md)
Besley (display), Hanken Grotesk (body/UI), Marcellus (Builders Corner), JetBrains
Mono (SKUs only). Cream `--background`, navy `--foreground`/`--brand-navy-deep`,
brass `--brand-gold`, red `--sale-red`. Pills 999px, cards 14px, soft warm shadows.

## Process / definition of done
- Build section by section IN the storefront (real components, real photos, real
  data), not a throwaway mockup.
- After each section, screenshot at desktop + mobile and compare side-by-side against
  the matching reference screenshot in scratchpad/refs/. If it doesn't hold up next
  to sicora/chairish/remodelingjourney, it isn't done.
- Do NOT present until the whole page holds that bar. No rushing.
