# Audit + Proposed Changes (2026-06-08)

A working document. Two purposes:
1. **Document what I see** when reviewing the live site, so we can talk about it instead of running redo loops.
2. **Propose changes for each page** so the user can react before I execute.

## Rules of engagement (from the user)

- **Don't touch Price-Less aesthetic.** It's working. Only fix factual errors there.
- **Builders Corner and Four Squared are open** for improvement.
- **Document while looking.** Write notes, don't just click around.
- **Discuss before executing big changes.** Demonstrate first, get sign-off, then change.
- **Focus on usability, spacing, clean.**
- **Trust > marketing.** Real photos, real details, real social. No marketing twists.
- **Real item photos are coming later.** Build the structure now; product hero shots fill in.

---

## ✅ Just executed (user-called-out)

1. **Home / "Same family, three businesses" brand row · Price-Less tile** — Swapped `building-back-walk.webp` (people walking outside the back of the building, didn't fit the "materials warehouse" copy) → `store-interior-warehouse.webp` (real warehouse interior with cabinets stacked + ceiling fans on display from the rafters).
2. **Home / WHY PRICE-LESS · 02 · Price** — The line "We check it every night" was fabricated. Rewrote the entire 02 panel:
   - Headline: was *"Half off retail is normal."* → now *"Below retail, on every tag."*
   - Body: was *"Our tags show our price next to the live Home Depot, Lowe's, and Menards price. We check it every night. If you find the same item cheaper somewhere local, tell us and we'll match it."* → now *"We price every item against its retail value at the major home-improvement stores and keep ours below. The two numbers are right on the tag, so the math is something you can check, not something you have to take our word for."*
   - Reflects the real process per the owner (retail-anchored, not nightly competitor scrape).

---

## 🐛 Site-wide bug worth fixing (infrastructure, not Price-Less aesthetic)

**`quality={55}` calls drop images to blank.** Next.js's `images.qualities` config in `next.config.ts` only allows `[60, 75, 85, 100]`. Anywhere we set `quality={55}` (home community grid, four-squared tiles, about page community 2x2, contact map, tour viewpoints, BC home tiles, BC kitchens / baths style grids) the image silently 404s with a `next-image-unconfigured-qualities` warning and renders as a blank box.

**Fix (one-line):** add `55` to `images.qualities`. Or grep-replace every `quality={55}` → `quality={60}`. Either way every page improves immediately — this is the cause of the "blank tile" issue across many pages.

**Awaiting approval to apply.** This isn't a Price-Less aesthetic change, it's a config fix. Recommend doing it now.

---

## 📝 Outstanding fact corrections (waiting for owner confirmation OR removal)

Things currently on the live site that aren't in the source-of-truth doc and aren't verified. We should either confirm or strip:

| Claim | Where it shows | Status |
| ----- | -------------- | ------ |
| "Two-year labor warranty" | Home, /four-squared (×4), /builders-corner, /kitchens, /baths | Unverified, repeated heavily |
| "3,200+ items in store" | Home hero stats | Unverified |
| "58% average savings vs. big-box" | Home hero stats | Unverified |
| "18,000 sq ft warehouse" | Home hero stats, /tour hero | Unverified |
| "Family owned" header/footer | Header, footer (every page) | Per SOT: 1978–2019 was Don Midlikowski, 2019→ Josh Nickel (no kinship across owners). "Locally owned · Josh Nickel" is more accurate. |
| "From 1920s Wausau farmhouse" (reclaimed door) | /tour, /shop/doors, /shop/item/PL-000104 | Fabricated provenance |
| "Local delivery within Marathon County starts at $79" | /shop/item, /cart | Unverified delivery price |
| "16 available today" inventory counts | /shop/item pages | Unverified, decorative |
| "From $14,800 / $22,400 / $2,200" BC kitchen price floors | /builders-corner gallery + items | Fabricated price floors |
| "EPA RRP certified / Licensed plumber on the crew / Bonded waterproofing" | /four-squared standard-list | Unverified certifications |
| "3/4-inch plywood boxes / dovetail drawers / soft-close" spec bars | BC kitchens, BC baths | Unverified specifics |

**Proposed action**: I'll prepare a one-pass scrub doc that strips every unverified claim and replaces it with the honest version. **Awaiting your direction on whether to (a) strip everything not in SOT today, (b) wait for you to confirm each with Josh first, or (c) leave on the live site with TODO markers.**

---

## 🏢 BUILDERS CORNER — proposed redesign (NOT YET EXECUTED, awaiting buy-in)

### Current state observations

- BC mini-site uses Fraunces serif throughout, navy + gold accents
- Hero photo on `/builders-corner` looks AI-generated/staged, not a real install
- "12 starting points" tile grid on `/kitchens`, "9 layouts" on `/baths`, "Style references" on `/gallery` — these were originally fabricated case studies the SOT audit relabeled as "style references"
- Pricing tiers under style references ("From $14,800") are fabricated
- The `/builders-corner/portfolio/rib-mountain-modern` page is the worst offender — entire fabricated case study with designer credit + specs + timeline

### Proposed direction

1. **Hero swap.** Replace the AI-looking hero with `install-kitchen-walnut.webp` (real installed walnut shaker kitchen from Houzz/Google Business). Caption it honestly: "From a recent kitchen build, Wausau · 2024" if we can confirm; otherwise "From the Builders Corner showroom."

2. **Drop the price floors entirely** from every BC page. Replace with one line: *"Custom quote — the first consult is free."* That's the actual truth.

3. **`/portfolio/rib-mountain-modern` decision needed.** Three options:
   - **(a)** Move to `/concepts/` and clearly label as concept art, not a built project
   - **(b)** Delete entirely until we have a real project with permission
   - **(c)** Keep but rewrite headline + remove fabricated specifics (timeline, scope, hardware)
   - **My recommendation: (b)** — delete. Half-fictional case studies in a portfolio destroy trust faster than no portfolio at all.

4. **Replace the four "12 starting points" / "9 layouts" tile grids** with a single honest reference strip showing 5-6 real install photos: `install-kitchen-walnut.webp`, `install-kitchen-walnut-island-bar.webp`, `install-bathroom-shaker.webp`, `install-bathroom-yellow-green-tile.webp`, etc. Captions: "Style reference: walnut shaker kitchen" (not a fake project name).

5. **Italic Fraunces discipline.** Currently italic body text appears in many paragraphs across BC pages. Restrict italic to: (a) one display word per section, (b) pull-quotes from the owner. Body paragraphs become roman serif or Inter Tight.

6. **Add the real Builders Corner cursive-B logo** as the hero brand mark in addition to the existing BrandLogo placements.

7. **Strip the "On every kitchen / On every bath" spec bars** unless Josh confirms each item.

8. **Honest CTA**: "Come walk the showroom. 825 Washington Street. Wed–Sat. Bring a sketch or just an idea."

### What stays

- The premium serif-driven typography
- Navy + gold palette
- The mural quote on the BC home
- The honesty banner on `/gallery` ("These are reference photos, we're swapping for real installs as we get permission") — this is exactly the right tone

---

## 🔨 FOUR SQUARED — proposed redesign (NOT YET EXECUTED, awaiting buy-in)

### Current state observations

- Clean utility design (per CGN reference)
- Hero with Josh's mural quote + 4-stat trust strip
- "Six things we do" tiles — all rendering blank due to image bug
- "Real installs" grid — same, all blank
- FAQ accordion with unverified license/cert claims

### Proposed direction

1. **Fix tile images** (depends on the q=55 bug fix above). Wire each service tile to a real install photo from `/real-photos/install-*.webp`. Map:
   - Kitchen remodels → `install-kitchen-walnut.webp`
   - Bath remodels → `install-bathroom-shaker.webp`
   - Basement finishes → `install-kitchen-walnut-island-bar.webp` (yes a kitchen, but it's a basement-bar style)
   - Whole-home → `install-kitchen-walnut-marble.webp`
   - Mudrooms → `install-bathroom-blue-tile-shower.webp` (placeholder if no mudroom shot)
   - Demo + haul-off → `install-before-kitchen.webp`

2. **Strip unverified cert claims** unless Josh confirms. "Bonded waterproofing," "EPA RRP certified," "HEPA on dusty work," "Licensed plumber on the crew" — replace with what's actually true: "Josh has been swinging hammers in central Wisconsin for 28 years. Insured. References on request."

3. **Real customer testimonial centerpiece.** Use `thank-you-card-rosalie-noah.webp` (the handwritten thank-you card to Josh + Ty). Display the image PLUS transcribe the quote: *"Josh, Thank you (and Ty) so much for our amazing new kitchen. We couldn't be happier! Your attention to detail and craftsmanship are top notch. — Rosalie + Noah."* Real, attributed, with photo proof.

4. **Real before/after showcase.** Pair `install-before-kitchen.webp` (mid-install with paper + tape) with `install-kitchen-white-open.webp` (finished). Honest captions: "Same kind of project, mid-install / finished."

5. **"1978 on this corner" subtitle** misleads — Four Squared is Josh's separate brand. Rewrite as "Run by Josh Nickel · 28 years in the trades · 825 Washington for materials, on-site for the install."

6. **Phone bar** at the top is great per CGN pattern — keep.

### What stays

- The trades-crew utility voice (good)
- The 4-step process (Consult / Estimate / Build / Walkthrough) — good
- Persistent phone CTA pattern — good

---

## 🏠 PRICE-LESS — NOT BEING REDESIGNED (per user)

Only fact corrections going forward. Two just executed (above). If you call out a specific factual error or off-image, I'll fix it. No structural / aesthetic changes.

---

## 🎯 Footer (touches every page, treat carefully)

- Currently: "FAMILY OWNED SINCE 1978" baseline.
- Per SOT: 1978 founding by Don Midlikowski (unrelated), Josh sole owner since 2019.
- Missing links to: Reviews, Press, Careers, About, Yelp, Google profile.

**Proposed change:** swap "Family owned since 1978" → "Locally owned · Josh Nickel" baseline, and add the missing internal links + external Google + Yelp profile links to the "Follow" column.

**Awaiting buy-in.**

---

## 📷 Photo placement principle (going forward)

When a photo doesn't match the surrounding copy:
1. Look at the section copy first
2. Pick the photo from `/public/real-photos/MANIFEST.md` whose caption most closely matches the copy's subject
3. If no real photo fits, use a relevant AI hero from `/test-images/` or `/catalog-images/`
4. If nothing matches, leave the slot empty rather than ship a mismatched photo

When we get real item photos later, they slot into the existing `image` + `gallery` fields on each catalog item — no re-layout needed.

---

## 🎨 Spacing + usability notes (across BC + Four Squared)

- BC has too many tile grids in a row, no visual rhythm break between them
- Many display headlines are oversized at desktop widths and start to feel decorative rather than informative
- Trust signals (Google rating, real reviews, owner attribution) buried below decorative tile grids on BC pages — propose moving them above the fold

These are deferred until we lock in the bigger structural changes above.

---

Last updated: 2026-06-08
