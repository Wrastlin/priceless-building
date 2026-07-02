# Price-Less Building Center — Site Text Audit

All user-facing written copy extracted from the Next.js App Router site, organized by page/route. Each text block lists its source file and line number in parentheses for easy editing.

> Generated for owner fact-checking. **Do not treat any number/date/rating/percentage as verified** — see the "FACTUAL CLAIMS TO VERIFY" section first. Many specific figures (savings %, delivery fees, financing terms, review counts, blog stats, demo/sample order data) appear to be illustrative/placeholder copy, not confirmed business facts.

---

## FACTUAL CLAIMS TO VERIFY

Every specific number, date, year, rating, percentage, dollar figure, count, guarantee, or term found on the site, grouped by topic, with source location.

### Founding dates & history
- "Est. 1978" — header tagline (`components/site-header.tsx` line 46); hero badge (`components/home-hero.tsx` line 77); brand logo print line (`components/brand-logo.tsx` line 95)
- "Since 1978" / "since 1978" — multiple: about hero (`app/about/page.tsx` line 37), trust block (`components/trust-block.tsx` line 28), what-to-expect band (`components/what-to-expect-band.tsx` line 22), walkthrough band (`components/walkthrough-band.tsx` line 108), footer (`components/site-footer.tsx` line 141), stats strip "serving central Wisconsin since 1978" (`components/stats-strip.tsx` line 18), careers SEO desc "Family-owned since 1978" (`app/careers/page.tsx` lines 47-48)
- `founded: 1978` — data constant (`lib/brands.ts` line 26); `PRICELESS.description` "...since 1978" (line 29)
- "Price-Less Building Center started in 1978 as a weekend operation and went full-time in 1982." (`app/about/page.tsx` line 45); also "1982 went full-time" stat (line 53) and Chapter One copy (lines 72-75)
- "founded in 1978 and acquired in 2019 by three local partners" — about SEO description (`app/about/page.tsx` lines 16-17) — **NOTE: conflicts with "Josh Nickel took over" single-owner framing elsewhere**
- "1983 · Builders Corner Cabinetry & Design founded" — home timeline (`app/page.tsx` line 30-31); about (lines 54, 75); builders-corner "since 1983" (`app/builders-corner/page.tsx` SEO lines 23-24, line 111, line 214); `BUILDERS.tagline` "Built in Wausau since 1983" (`lib/brands.ts` line 51); BUILDERS.description "since 1983" (line 53)
- "2019 · May · Josh Nickel takes over both businesses" — home timeline (`app/page.tsx` lines 37-42); about "In May 2019, Josh Nickel took over" (line 88); `ownerSince: 2019` (`lib/brands.ts` line 26)
- "founder: Don Midlikowski" data constant (`lib/brands.ts` line 24)
- "owner: Josh Nickel" data constant (`lib/brands.ts` line 25)
- "© 2026 Price-Less Building · Builders Corner · 4 Squared" footer copyright (`components/site-footer.tsx` line 138)

### Google rating & reviews
- `GOOGLE_RATING = { average: 4.8, count: 10 }` data constant (`lib/google-reviews.ts` line 110)
- "4.8★" stats strip + "on Google · {count} reviews" (`components/stats-strip.tsx` line 19)
- "4.8★ · On Google across all three brands" (`app/builders-corner/page.tsx` line 215)
- Reviews page SEO: "{4.8}★ ... {4.8} stars across {10} Google reviews" (`app/reviews/page.tsx` lines 14-15)
- "{4.8} ... {10} Google reviews · 5/5 on Facebook" (`components/reviews-section.tsx` lines 50-53)
- "Read our 9 Google reviews" (`components/what-to-expect-band.tsx` line 74) — **count "9" conflicts with "10" in GOOGLE_RATING**
- Source comment: "4.8 stars, 9 displayed reviews as of 2026-06" (`lib/google-reviews.ts` lines 39-44) — **mentions both 9 and 10**
- "Voted Top 5 in Marathon County" / "Top 5 remodeler in the county" (`app/four-squared/page.tsx` lines 124, 133)

### Mural / community events
- "Build Your Future ... painted by 50 Wausau volunteers in June 2023" (`components/home-hero.tsx` lines 112, 122); "fifty volunteers" home timeline (`app/page.tsx` line 52)
- "more than 50 community volunteers painted ... June 2023 ... artist Stephanie Kohli" (`app/about/page.tsx` lines 135, 234)
- "painted by 50+ community volunteers under artist Stephanie Kohli" (`app/press/page.tsx` lines 67-68)
- "125 hours of decorating" — first Santa's Workshop (`app/press/page.tsx` lines 55-56)
- Easter Bunny first visit "April 2025" (`app/about/page.tsx` line 157; `app/page.tsx` lines 61-63; press Apr 12, 2025 line 41)
- Santa's Workshop "December 2024" first (`app/about/page.tsx` line 152; press Dec 8, 2024 line 53), "December 2025" second annual (`app/about/page.tsx` line 162; `app/page.tsx` lines 73-75; press Dec 11, 2025 line 29)
- "Great Grocery Giveaway ... free groceries for a year" (`app/about/page.tsx` lines 148-149)
- "Six-year anniversary celebration" (`components/facebook-band.tsx` line 23)

### Owner / crew claims
- Josh Nickel "with over 27 years in construction" (`app/four-squared/page.tsx` line 130)
- "Sales grew roughly 40% through the pandemic year ... (Source: The Business News, May 2021.)" (`app/about/page.tsx` line 91); press "roughly 40% sales growth through 2020" (`app/press/page.tsx` lines 79-80)
- "From the owners' year-end letter, December 2022" (`app/about/page.tsx` line 184)
- "4 Squared is Josh and Ty" / "runs the crew with Ty" (`app/about/page.tsx` line 177; `app/four-squared/page.tsx` line 133)

### Savings / pricing claims
- "40-60% off" / "already 40–60% below the big-box" (`app/faq/page.tsx` line 122)
- "{savings}% OFF" dynamic badge on product cards (`components/product-card.tsx` line 63)
- "SAME ITEM. HALF THE PRICE." compare hero (`app/compare/page.tsx` line 37)
- "Avg. savings vs Home Depot — 54%" (`app/compare/page.tsx` line 49)
- "SKUs we benchmark weekly — 3,200+" (`app/compare/page.tsx` line 50)
- "Big-box stores checked — 4" (`app/compare/page.tsx` line 51)
- "Years of receipts to prove it — 25" (`app/compare/page.tsx` line 52)
- Blog: "Price-Less tag has to be at least 20% under the lowest ... Most of the time we're closer to 50% under ... rule we set ourselves in 2002" (`app/blog/[slug]/page.tsx` line 61)
- Blog: "We started doing that [3-number tags] in 2014" (`app/blog/[slug]/page.tsx` line 65)
- Blog: "discount about 30%" on reclaimed (`app/blog/[slug]/page.tsx` line 64)
- Admin settings: "Suggested tag = comparable retail × 45%. Floor minimum margin = 35%. Auto-discount stale items after 60 days." (`app/admin/settings/page.tsx` lines 15-18)
- "Three hundred SKUs hit the floor every week" (`app/blog/page.tsx` line 109)

### Hours / location
- Hours array Mon–Sat 8:30 AM, Fri to 4:30 PM, Sat to 12:30 PM, Sun Closed (`lib/brands.ts` lines 31-39) — "Verified 2026-06-08 from the Google Business profile" comment
- "MON–SAT · open six days a week" (`components/stats-strip.tsx` line 20; `app/builders-corner/page.tsx` line 216)
- Address: "825 Washington St, Wausau, WI 54403" + phone "(715) 848-3855" (`lib/brands.ts` lines 12-16)
- (All in-code ZIPs are "54403": `lib/brands.ts` line 15, `app/checkout/checkout-form.tsx` line 100. No ZIP conflict found in source.)
- Geo lat/lng 44.958065, -89.617963 (`lib/brands.ts` line 17)

### Delivery / pickup / fulfillment
- "Local delivery within Marathon County starts at $79" (`app/shop/item/[sku]/page.tsx` line 215; `app/cart/page.tsx` line 20; `app/cart/cart-view.tsx` line 87)
- "$79 flat · 25 mi · 1–3 day" delivery option (`app/checkout/checkout-form.tsx` line 88)
- "Free · usually 60 min" pickup (`app/checkout/checkout-form.tsx` line 88); "Usually ready in 60 minutes" (line 47-48)
- "reserved 48 hours" / "48-hour pickup window" checkout (`app/checkout/checkout-form.tsx` lines 115, 154; `app/checkout/page.tsx` line 20)
- "Pickups happen ... seven days from when you placed your order" (`app/track/page.tsx` lines 48-50)
- FAQ delivery: "inside a 60-mile radius ... Same-day if placed before 11 AM ... Most local jobs are $75 to $185" (`app/faq/page.tsx` line 68)
- FAQ holds: "hold paid items for 72 hours and unpaid will-call holds for 24 hours" (`app/faq/page.tsx` line 60); contact "72-hour holds" (`app/contact/page.tsx` lines 142-143)
- FAQ shipping: "more than 90 miles out, call ahead" (`app/faq/page.tsx` line 64)
- Contact: "US-51 / I-39 sits eight minutes east ... downtown ten minutes west ... roughly forty minutes from Stevens Point, Antigo, Merrill" (`app/contact/page.tsx` line 174)

### Returns / warranty
- "30 days on unopened, undamaged items" (`app/faq/page.tsx` line 87; returns page lines 44, 53)
- "Refunds hit the original payment method within 5 business days" (`app/policies/returns/page.tsx` line 48)
- "card processor typically posts within 3-5 business days" (returns line 100)
- "Synchrony posts the credit within 7 business days" (returns line 102)
- "Net-30 contractor accounts can return unused items up to 60 days from invoice date" (returns line 108)
- "Call us within 48 hours" damage claim (returns line 77)
- Custom "50% deposit ... fully refundable within 7 days of signing" (returns lines 84-85)
- "manufacturers warranty 1 to 10 years" (`app/faq/page.tsx` line 91)

### Financing terms (page has NO SEO metadata object)
- "90 days same-as-cash ... 0% APR ... great for ... projects under $2,500. ... minimum $299" (`app/financing/page.tsx` lines 11-15, 64)
- "12 months, 0% APR ... purchases of $1,500 or more" (lines 19-22, 64)
- "24–60 months extended ... from 7.99% APR ... jobs $5,000 and up" (lines 27-31, 64)
- "decision in under a minute" / "under 60 seconds" / "about 90 seconds" (lines 39, 44, 60, 203)
- "We've financed everything from a single front door to a $42,000 whole-home remodel package" (line 84)
- Providers named: Synchrony, GreenSky (lines 30, 56, 72, etc.)

### Contractor accounts
- "authorize up to five named individuals" (`app/faq/page.tsx` line 118)
- "net-30 ... email it on the 1st, payment due by the 30th" (`app/faq/page.tsx` line 114)
- "invoices ... before 2022? Call the counter" (`app/faq/page.tsx` line 126)
- "60-mile delivery radius" (`app/contractors/page.tsx` line 173, line 66)

### Inventory scale (from store walkthrough data — auto-generated, "honest, conservative scale")
- Trim & profiles "1300+ pieces"; Interior door slabs "600+"; Balusters "600+"; Casement/vinyl windows "500+"; Paint & stain "500+"; many "+N" counts (`lib/store-showcase.ts` lines 12-399)
- 57 vendor entries (`lib/vendor-logos.ts`); "Verified vendors · {n} brands" (`components/vendor-wall.tsx` line 32)
- Real in-store prices from walkthrough (e.g. interior door $25–$182, window $99–$1,412, cabinet $30–$1,842) (`lib/walkthrough-inventory.ts`)

### Blog post stats (likely illustrative — verify before publishing)
- "rough opening ... 34×82-1/2", "90% of return trips" (swing), "2-3/8\" backset", "80% from Masonite/Jeld-Wen/Therma-Tru" (`app/blog/[slug]/page.tsx` lines 40-44)
- "$189 base cabinet vs $419 at Lowe's" (line 100)
- Reclaimed window prices "$80 to $140 per sash", "fourteen ... gone in nine days" (lines 81-82)
- Blog post dates Apr 9 – May 28, 2026 (`app/blog/page.tsx` and `[slug]/page.tsx`)

### Admin demo/sample data (internal — appears placeholder)
- Returns table sample customers/SKUs: Riverside Build Co., Maria Solberg, Dan Heinrichs, Jeff Korbel, Centra Group, etc. (`app/admin/returns/page.tsx` lines 17-21)
- Floor printer "Brother QL-820NWB · 4×3\" continuous" (`app/admin/settings/page.tsx` line 31; `app/admin/tags/page.tsx` lines 11-12)
- Comparable retailers list: Home Depot/Menards/Lowe's (Wausau), Amazon national (`app/admin/settings/page.tsx` lines 23-26)

---

# PAGES / ROUTES

## Global — Root Layout & SEO (`app/layout.tsx`)
- Default title: "Price-Less Building Center · Discount materials, custom cabinetry, and remodels in Wausau, WI" (line 53)
- Title template: "%s · Price-Less Building" (line 54)
- Meta description: "Discount and surplus building materials, premium custom cabinetry, and a professional install crew under one roof in Wausau, WI. Doors, windows, cabinets, vanities, hardware. Full kitchen remodels, bath remodels, and home renovations across central Wisconsin." (lines 56-57)
- applicationName: "Price-Less Building" (line 71); appleWebApp title: "Price-Less" (line 75)
- OpenGraph title (same as default, line 87-88); OG description: "Three local brands under one roof. Discount surplus materials, premium custom cabinetry, and a professional install crew. Get the materials and have them installed for a fraction of regional chain cost." (lines 89-90)
- OG image alt: "Build Your Future community mural on the side of Price-Less Building Center in Wausau, Wisconsin." (line 96)
- "Skip to main content" (line 139)

---

## Home (`app/page.tsx` + home components)

### Timeline / history events (`app/page.tsx`)
- "1978 — Price-Less Building Center opens in Wausau." + "A discount and surplus building-materials warehouse on Washington Street, focused on cancelled contractor orders and factory overstock." (lines 24-25) **[CLAIM: 1978]**
- "1983 — Builders Corner Cabinetry & Design founded." + "A custom cabinet shop opens in Wausau, specializing in kitchens, baths, and built-ins designed and finished locally." (lines 30-32) **[CLAIM: 1983]**
- "2019 · May — Josh Nickel takes over both businesses." + "Josh Nickel takes the reins ... The two storefronts keep their separate identities." + "Read the 2021 Business News profile" (lines 37-44) **[CLAIM]**
- "2023 · Jun — The Build Your Future community mural is painted." + "Designed by Stephanie Kohli and painted by fifty volunteers from across Wausau ..." + "Read the WSAW story" (lines 49-56) **[CLAIM]**
- "2025 · Apr — First Easter Bunny visit at the storefront." + community-day blurb + "Read the WSAW story" (lines 61-68) **[CLAIM]**
- "2025 · Dec — Second annual Santa's Workshop at the showroom." + WSAW blurb (lines 73-80) **[CLAIM]**
- Section head: "What has happened along the way." + "The two storefronts have a few decades of history between them, and local press has covered most of it. The milestones below link back to the original articles." (lines 227-228)
- Service-area list: Wausau, Schofield, Weston, Rib Mountain, Rothschild, Mosinee, Marathon, Marathon County, Central Wisconsin (all WI) (lines 134-142)
- JSON-LD / structured copy: "Premium custom kitchen and bath cabinetry, designed and built in Wausau, WI since 1983." (line 162) **[CLAIM]**; "Professional installation crew for custom kitchen remodels, bath remodels, and full home renovations in central Wisconsin." (line 170)

### Hero (`components/home-hero.tsx`)
- "Wausau, WI" (line 75) · "Est. 1978" badge (line 77) **[CLAIM]**
- "Wausau's one-stop shop for everything." (lines 81-83)
- "Discount and surplus materials, custom cabinetry, and a full install crew. Walk the warehouse, design with our team, install with our crew." (line 87)
- CTA "Browse the warehouse →" (line 95) · "Visit the store" (line 101)
- Hours pill (dynamic): "Open today, {hours}" / "Closed today · Open Mon 8:30 AM" (lines 142-144)
- Mural caption: "\"Build Your Future\" mural · designed by Stephanie Kohli · painted by 50 Wausau volunteers · June 2023" (line 122) **[CLAIM]** · "WSAW story →" (line 130)
- alt: "A finished kitchen with wood cabinets and granite countertops, built and installed by the Wausau crew." (line 40); mural alt (line 112)

### Stats strip (`components/stats-strip.tsx`)
- "HUGE — savings vs. big-box retail" (line 17)
- "1978 — serving central Wisconsin since" (line 18) **[CLAIM]**
- "{4.8}★ — on Google · {10} reviews" (line 19) **[CLAIM]**
- "MON–SAT — open six days a week" (line 20)

### Trust block (`components/trust-block.tsx`)
- "Visit the store" (line 24)
- "We've been here since 1978" (lines 27-28) **[CLAIM]**
- "825 Washington St in Wausau. Open Mon through Sat. Family owned. Come see the warehouse for yourself." (lines 31-32)
- Address block (dynamic) (line 54); "Free parking in the lot behind the building. Loading dock on the south side for pickups." (lines 57-58); "Get directions →" (line 67); "Hours" (line 75); "Call {phone}" (line 89)
- "Have a project in mind?" + walkthrough teaser (lines 94-97) + "See how it works →" (line 103)

### Brand statement (`components/brand-statement.tsx`)
- "Style and class at every price point." (line 14)
- "We pride ourselves on being affordable to anyone looking to liven up their home, and we try to make the rest of it as easy as possible." (line 17)

### Family band — sister brands (`components/family-band.tsx`)
- "The rest of the family." + "Two more local brands across the parking lot. Use just one, or have all three work on the same project." (lines 60-61)
- "Builders Corner." + "Premium custom cabinetry. Kitchens, baths, and built-ins designed in the showroom and built in our own shop in Wausau." + tags "Custom kitchens / Custom baths / Built-ins" + "Read the Builders Corner story" (lines 21-24)
- "4 Squared." + "The install crew. Demo, plumbing, electrical, tile, finish carpentry, start to final walkthrough. Installs cabinets from Builders Corner or anything you bring." + tags (lines 38-40) + "Meet the install crew" (line 41)
- Several install/kitchen/bath image alt strings (lines 27-49, 92-94)

### Catalog band (`components/catalog-band.tsx`)
- "On the floor right now" (line 20); search placeholder "Search doors, windows, cabinets…" (line 46); "Browse" (line 55); "Much more on the floor than what fits here." (line 80); "Shop all products →" (line 83)

### Before/after band (`components/before-after-band.tsx`)
- "A few of the rooms we have finished." + "Kitchens and baths the in-house install crew has wrapped over the last few years. The tiles below cycle through the full set." + "Meet the install crew" (lines 31-33)
- "We can pull from any of these designs as a starting point for your room." + "Start a project →" (lines 43-46)

### What-to-expect band (`components/what-to-expect-band.tsx`)
- "A few things worth knowing before you visit." + intro (lines 35-36)
- "The inventory — Brand-new in-the-box stock from cancelled contractor orders, mis-shipments, and factory overstock. Same brands as the big-box stores." (lines 9-10)
- "The pricing — Every tag shows our price next to current retail at Home Depot, Lowe's, or Menards. Bring your phone and check." (lines 15-16)
- "Where to find us — 825 Washington Street, Wausau. In the same building since 1978. Open Monday through Saturday." (lines 21-22) **[CLAIM]**
- "Shop everything →" (line 68); "Read our 9 Google reviews" (line 74) **[CLAIM — count]**

### Walkthrough band (`components/walkthrough-band.tsx`)
- "See it in your home before you buy." + intro (lines 55-56)
- 5 steps: "Take a photo." / "Pick what you want." / "Choose colors with us." / "See it in the photo." / "Get the price." with descriptions (lines 8-37)
- "825 Washington Street, Wausau. Same building since 1978. Open Monday through Saturday." (lines 106-108) **[CLAIM]** + "See our store →" (line 112)

### Reviews section (home) (`components/reviews-section.tsx`)
- "What our customers say." (line 47); "{4.8}" (line 50); "{10} Google reviews · 5/5 on Facebook" (line 53) **[CLAIM]**; links "Google →" / "Yelp →" / "Facebook →" (lines 58-60); "Read all the reviews →" (line 72)

### Reviews masonry (dynamic) (`components/reviews-masonry.tsx`)
- Renders review source badge, body, name, date from data (lines 54-72). Review text lives in `lib/reviews-data.ts` (see Reviews page section).

### Facebook band (`components/facebook-band.tsx`)
- "Around the store lately." + "Between visits, our Facebook and Instagram are the most current view ... We post a few times a week." (lines 31-32)
- Photo alts incl. "Six-year anniversary celebration at Price-Less Building Center." (line 23) **[CLAIM]**, mural, Santa, grocery giveaway, paint day (lines 18-22)
- "See more on the Price-Less Building Center Facebook page" (line 41); follow-platform copy (lines 59-64)

### Vendor wall (`components/vendor-wall.tsx`)
- "Verified vendors · {n} brands" (line 32) **[CLAIM]**
- "Brands on the floor" + "Read straight off the boxes and signage in our aisles. New-in-box surplus from the names contractors already trust." (lines 16-17)

### Store showcase (`components/store-showcase.tsx`) — data from `lib/store-showcase.ts`
- "{n} departments · everything under one roof" (line 55)
- "What's on the floor right now." (lines 57-58)
- "A whole-store walkthrough, department by department. Surplus moves weekly, so think of this as the depth you'll find when you walk in, not a fixed list. Come dig." (lines 61-63)
- Per-collection (dynamic): "{n} types" / "from ${n}" / "{n} brands" (lines 89-91); "Browse all {dept} →" (line 122)
- Showcase counts (the "1300+ / 600+ / 500+" etc.) live in `lib/store-showcase.ts` lines 12-399 **[CLAIM]**

### Warehouse gallery (`components/warehouse-gallery.tsx`)
- "Around the warehouse." + "A slice of what is on the floor, in the showroom, and on the walls. Click any tile to open the full gallery." (lines 157-158); "Open photo" (line 171); "Open full gallery →" (line 241)

---

## Shared Header / Nav / Footer

### Site header (`components/site-header.tsx`)
- "Price-Less Building Center, Wausau, Wisconsin · Home" (line 31); logo alt (line 35)
- "Price-Less Building" wordmark (line 43); "Wausau, WI · Est. 1978" (line 46) **[CLAIM]**; "Call (715) 848-3855" (line 57)

### Main menu (`components/main-menu.tsx`)
- "Shop the warehouse" + "Surplus doors, windows, cabinets, vanities, lighting, hardware." (lines 25-26)
- "Premium custom cabinetry" + "Designed in our showroom, built in our Wausau shop." (lines 31-32)
- "Custom installs + remodels" + "Kitchens, baths, full renovations by the in-house crew." (lines 37-38)
- "Start a project" + "Visit, call, or send us photos of your space." (lines 43-44)
- Links: "Reviews / About / Visit + contact / Blog / FAQ / Contractor accounts" (lines 50-55)
- "Or jump straight to a department" (line 159); "The rest of the site" (line 182); "Call (715) 848-3855" (line 206); "Menu" / "Close menu" / "Open menu" (lines 94, 103, 128)

### Mobile drawer (`components/mobile-drawer.tsx`)
- "Builders Corner →" / "← Price-Less Building" brand toggle (line 62); "Menu" (lines 102-103); "Call (715) 848-3855" (line 158)

### Mobile tab bar (`components/mobile-tabbar.tsx`)
- "Shop" / "Reviews" / "Premier" / "Cart" / "Help" (lines 10-14)

### Header search (`components/header-search.tsx`)
- placeholder "Search doors, windows, cabinets…" (line 33); aria "Search the warehouse" (line 34)

### Newsletter bar (`components/newsletter-bar.tsx`)
- "Stay in the loop" + "Get the new inventory list as it lands." (lines 29-30)
- "A short email when fresh doors, windows, or cabinets hit the floor, plus first dibs on the design walkthrough when it launches. No spam." (lines 31-32)
- placeholder "you@gmail.com" (line 41); "Subscribe" (line 44)
- Success: "You're on the list." + "We'll be in touch when there's something worth saying." (lines 20-21) / "Subscribed. We'll email when fresh inventory lands and when the design walkthrough opens up." (line 14)

### Brand logo (`components/brand-logo.tsx`)
- "Price-Less Building Center" (line 34); "Builder's Corner Cabinetry" (line 47); "4 Squared" (lines 67, 83)
- Print line: "Price-Less Building Center · 715-848-3855 · 825 Washington St, Wausau, WI" (line 95) **[CLAIM]**

### Cart button (`components/cart-button.tsx`)
- "Cart ({n} item/items)" (line 11); "Cart" (line 19)

### Site footer (`components/site-footer.tsx`)
- "Visit us · Wausau, WI" (line 19); "825 Washington Street." (lines 22-23); "(715) 848-3855 →" (line 31); "Get directions →" (line 39); "Hours" (line 47)
- Column links: "Shop"/"Studio" (line 60); "Doors / Windows / Cabinets / Vanities / Hardware" (lines 65-69); "Builders Corner / 4 Squared install / Visit the showroom" (lines 73-75)
- "Sister brands": "Price-Less Building / Builders Corner / 4 Squared" (lines 83-90); "Policies / Returns" (lines 94-97); "Follow / Facebook ↗ / Instagram ↗ / Contact" (lines 103-128)
- "© 2026 Price-Less Building · Builders Corner · 4 Squared" (line 138) **[CLAIM]**; "Wausau, WI · Same building since 1978" (line 141) **[CLAIM]**; "My account" (line 143); "Employee sign in" (line 146)

---

## About (`app/about/page.tsx`)
**SEO:** title "About · Price-Less Building Center" (line 15); description "A Wausau, Wisconsin discount and surplus building supply warehouse, founded in 1978 and acquired in 2019 by three local partners." (lines 16-17) **[CLAIM — "three local partners" vs single-owner narrative]**
- Hero: "Origin · Since 1978 · Wausau, Wisconsin · A weekend venture that never closed." (lines 35-42) **[CLAIM]**
- Body: "Price-Less Building Center started in 1978 as a weekend operation and went full-time in 1982. The cabinet-manufacturing arm, Builders Corner, opened in 1983. ..." (line 45) **[CLAIM]**
- "In numbers": 1978 founded weekend venture / 1982 went full-time / 1983 Builders Corner / 2019 new ownership (lines 50-55) **[CLAIM]**
- Chapter One · 1978 — "A weekend operation on Washington Street." + paragraphs (lines 69-75) **[CLAIM]**
- Chapter Two · 2019 — "New ownership, same building, same idea." + "In May 2019, Josh Nickel took over ..." + "Sales grew roughly 40% through the pandemic year ... (Source: The Business News, May 2021.)" (lines 85-91) **[CLAIM]**
- Chapter Three · The cluster — "Three brands, one address." + 825 Washington description + "Visit Builders Corner →" (lines 107-121)
- Chapter Four · 2023 onward — "Build Your Future." + "In June 2023, more than 50 community volunteers painted the 'Build Your Future' mural ... Stephanie Kohli of Stephanie Kohli Art LLC." + pull quote "Trades is a dying breed..." + "WSAW NewsChannel 7, June 2023" (lines 130-142) **[CLAIM]**
- WAOW 9 "Great Grocery Giveaway." — "free groceries for a year" (lines 147-149)
- "December 2024 — First Santa's Workshop." (lines 152-154) **[CLAIM]**
- "April 2025 — Easter Bunny visit." quote "It's pure joy. It's not a staged smile." (lines 157-159) **[CLAIM]**
- "December 2025 — Second annual Santa's Workshop." (lines 162-164) **[CLAIM]**
- "Today — Who runs it." + "Josh Nickel is behind all three. On the install side, 4 Squared is Josh and Ty." (lines 174-177)
- Owner quote "It takes a village ..." + "From the owners' year-end letter, December 2022" (lines 181-184) **[CLAIM]**
- "Come walk the warehouse on a Wednesday." (line 188); owner photo alt (line 195)
- Community section — grocery giveaway, "Santa's Workshop, two years running. Free photos, free hot chocolate, building materials still half off." (line 226), mural "painted June 2023 by 50+ volunteers" (line 234) **[CLAIM]**, food/clothing drives with Horace Mann & John Muir (line 242)
- Closing: "Come walk the warehouse." + "Open Monday through Saturday. The coffee pot is on and the load bay is open." + CTAs "Shop the surplus floor" / "Plan your visit" (lines 256-268)

---

## Builders Corner (`app/builders-corner/page.tsx`)
**SEO:** title "Builders Corner · Premium custom cabinetry, kitchens, and baths in Wausau, WI" (lines 21-22); description "Premium custom cabinetry designed and built in Wausau since 1983 ..." (lines 23-24) **[CLAIM: 1983]**
- Hero gallery image alts (lines 51-56)
- "Custom kitchens" + blurb (lines 61-62); "Custom baths" + blurb (lines 67-68); "Built-ins for the rest of the house" + blurb (lines 73-74)
- 4-step process: "01 Free consultation / 02 Design with you / 03 Build in the shop / 04 Installed by 4 Squared" (lines 95-98)
- JSON-LD copy: "Premium custom cabinetry ... built locally since 1983, installed by 4 Squared." (lines 106-107); "1983" (line 111) **[CLAIM]**
- CTA band: "The premium side of Price-Less" + "Premium custom cabinetry, designed and built in Wausau." + paragraph + "Book a free consultation" / "Or call" (lines 183-202)
- Stats: "1983 — Designing and building cabinetry in Wausau." / "4.8★ — On Google across all three brands." / "MON–SAT — Showroom open six days a week." (lines 214-216) **[CLAIM]**
- "What we make." (line 225); "Four steps from idea to install." (line 266); "Recent rooms." + "Every photo is a real install." (lines 306-307); filter tabs "Kitchen" / "Bath" (line 339)

---

## 4 Squared (`app/four-squared/page.tsx` + `components/four-squared/fs-hero.tsx`)
**SEO:** title "4 Squared · Kitchen, bath, and home remodels in Wausau, WI" (line 13); description (lines 14-15)
- JSON-LD: "Professional installation crew for custom kitchen remodels, bath remodels, and full home renovations in central Wisconsin. Operates under the Price-Less Building Center roof." (lines 36-37)
- "Voted Top 5 in Marathon County" (line 124) **[CLAIM]**
- "Meet Josh Nickel." + "Josh is the face behind all three businesses under one roof ... with over 27 years in construction. He started his own company in Winona, Minnesota while training as an aviation mechanic ..." (lines 127-130) **[CLAIM]**
- "On the install side he runs the crew with Ty ... His goal at Price-Less is simple ... recognized as a Top 5 remodeler in the county." (line 133) **[CLAIM]**
- "See the work on Facebook." + blurbs + "4 Squared on Facebook" / "See all photos on Facebook →" (lines 145-168)
- 4-step "How a project runs": "01 Consult / 02 Estimate / 03 Build / 04 Walkthrough" with descriptions (lines 91-94); "Plain English, no fabricated timelines." (line 181)
- Hero (`fs-hero.tsx`): "4 Squared — New Construction · Restoration · Remodeling" (line 38); "The install side of 825 Washington Street" (line 46); "The install crew that finishes the job." (lines 48-50); paragraph (line 53); "Get a free estimate →" (line 60) / "Or call {phone}" (line 66)

---

## FAQ (`app/faq/page.tsx`)
**SEO:** title "FAQ · Shopping, pickup, returns, contractor accounts · Price-Less Building Center Wausau, WI" (line 133); description (lines 134-135)
- "The counter answers — Frequently asked questions." + "Twenty-something questions we hear every week ..." (lines 168-174)
- **Section 01 — Shopping the warehouse** (lines 24-49): Is everything new in crate? / How is pricing decided? (Tuesday Home Depot/Lowe's/Menards/Amazon check) / Why no Facebook prices? / Trade-ins? / What's coming next Wednesday? / Do you price match?
- **Section 02 — Pickup & delivery** (lines 55-76): Hold before driving in? ("paid items 72 hours ... unpaid will-call 24 hours") **[CLAIM]** / Ship outside Wisconsin? ("more than 90 miles out, call ahead") **[CLAIM]** / Do you deliver? ("60-mile radius ... same-day if before 11 AM ... most local jobs $75 to $185") **[CLAIM]** / Rent a truck? (U-Haul two blocks south) / Will you help me load? **[CLAIM]**
- **Section 03 — Returns & warranty** (lines 82-99): Return window ("30 days ... full policy on returns page") **[CLAIM]** / Damaged door? ("manufacturers warranty 1 to 10 years") **[CLAIM]** / Product warranty? / Return Builders Corner custom? (non-returnable once approved; "complimentary revision round")
- **Section 04 — Contractor accounts** (lines 105-126): Open an account? ("verify trade license + one reference, usually same day. No fees, no annual dues") **[CLAIM]** / What does net-30 mean? ("email on the 1st, due by the 30th") / Crew charge? ("up to five named individuals") **[CLAIM]** / Volume discounts? ("already 40–60% below the big-box ... priority access ... 60-mile delivery") **[CLAIM]** / Copy of old invoice? ("before 2022? Call the counter") **[CLAIM]**
- Closing: "Didn't see your question? Call the counter or stop by. We're here Wed–Sat." (lines 231-233) — **note "Wed–Sat" conflicts with Mon–Sat hours elsewhere**

---

## Financing (`app/financing/page.tsx`) — NO SEO metadata object on this page
- Hero: "Financing · Synchrony & GreenSky" + "BUY THE WHOLE PROJECT. PAY IT LIKE A BILL." + "90 days same-as-cash on doors and hardware. 12 months 0% APR on full kitchens. Extended 24–60 month plans ... get a decision in under a minute." + "Apply now" / "Talk to a person" (lines 101-115) **[CLAIM]**
- Plan 1 "90 days same-as-cash · 0% APR ... projects under $2,500 ... Best for: weekend projects" (lines 10-15) **[CLAIM]**
- Plan 2 "12 months, 0% APR ... purchases of $1,500 or more ... Best for: kitchens & full windows" (lines 18-23) **[CLAIM]**
- Plan 3 "24–60 months extended · from 7.99% APR ... jobs $5,000 and up ... GreenSky ... Best for: gut remodels & additions" (lines 26-31) **[CLAIM]**
- "Three plans, every project" / "Pick a payment shape that fits the job." / "Apply for this plan" (lines 124-151)
- "How it works" 3 steps: "Apply in minutes" (soft credit, ~90 seconds) / "Get a decision on the spot" (inside 60 seconds) / "Use it like a card" (lines 38-49) **[CLAIM]**
- FAQ (lines 55-84): Hurt credit? (soft inquiry) / How fast? ("under a minute") **[CLAIM]** / Minimum purchase? ("$299 ... $1,500 ... $5,000") **[CLAIM]** / Financing for delivery/labor? / Contractor program? (net-30) / Self-employed? / Pay off early? (no penalty) / Project types? ("financed everything from a single front door to a $42,000 whole-home remodel package") **[CLAIM]**
- "Frequently asked — Common questions, real answers." (lines 179-181)
- CTA: "Ready to apply? Most decisions in under 60 seconds. No impact to your credit to check." + "Start application" / "Talk to us first" (lines 201-216) **[CLAIM]**

---

## Contractor accounts (`app/contractors/page.tsx`)
**SEO:** title "Contractor accounts · Net-30 terms · Price-Less Building Center Wausau, WI" (line 42); description (lines 43-44)
- Success/error messages (lines 97-105)
- Hero: "Price-Less contractor program" + "BUILT FOR THE TRADES." + "Net-30 billing, contractor-only drops, will-call lockers, and after-hours load-out for crews ... No application fee. No annual dues." + "Sign up today" (lines 118-130)
- "What you get — Six things you won't get at the orange or blue stores." (lines 142-144)
- 6 benefits (lines 49-70): Net-30 account billing / Contractor-only inventory drops ("First call on every Wednesday delivery ... text the list the Tuesday before") **[CLAIM]** / Will-call hold lockers / After-hours load-out / Jobsite delivery ("60-mile radius ... same-day before 11 AM") **[CLAIM]** / Monthly statements (CSV export)
- Testimonial: Ryan T., Google review "Great people to deal with! Josh installed our granite island ..." (lines 78-82)
- "Apply in 60 seconds — Open an account." + "Most accounts open same-day after we verify your trade license and a quick reference." (lines 162-168) **[CLAIM]**
- Feature pills: "No fees, no minimums / Net-30 billing / 60-mile delivery radius / Will-call holds & locker bays" (lines 171-174) **[CLAIM]**
- Form fields + trade options (lines 183-218); "We'll call you within one business day to confirm." (line 221)
- "From the trades — What our contractor accounts say." (lines 230-232)
- Closing: "Working a job this week?" + "Call the counter ... We'll have it on the dock before your truck rolls." + "Call (715) 848-3855" / "Browse inventory" (lines 256-266)

---

## Careers (`app/careers/page.tsx`)
**SEO:** title "Careers · Price-Less Building Center" (line 46); description "Open positions ... Family-owned since 1978. Email pricelessbuildingcenter@gmail.com to apply." (lines 47-48) **[CLAIM: 1978]**
- Hero: "Hiring in Wausau, Wisconsin" + "We're looking for you." + "Two open roles ... Retail Sales and Front of House Management. Email your resume to pricelessbuildingcenter@gmail.com or stop by 825 Washington Street." + "Email your resume" / "See the roles ↓" (lines 61-81)
- Flyer alt (line 89); caption "From our recent hiring flyer, posted to Facebook." (line 97)
- "Do you have… — The kind of person we hire." (lines 109-112); traits list: Computer efficiency / Leadership experience / Communication skills / Collaboration mindset / Problem-solving ability (lines 38-42)
- "Open positions — Two roles, on the floor." + "Apply by email; we usually reply within a couple of business days." (lines 135-142) **[CLAIM]**
- Role 1 "Retail Sales · Full-time · Wausau, Wisconsin · On-site" + description + 3 requirements (lines 11-19)
- Role 2 "Front of House Management" + description + 4 requirements (lines 23-32)
- Closing: "Send your resume, or just stop by." + email/address/hours + "Email us" / "Call" (lines 181-189)

---

## Connections — setup guide (`app/connections/page.tsx` + `components/connections-form.tsx`)
**SEO:** title "Connections · setup guide" (line 19); description "Local-only backend reference ..." (lines 21-22) — **internal/dev page**
- Form (`connections-form.tsx`): sandbox/test-mode banner (line 53); "{n} of {n} fields filled." (line 58); "Copy as .env" / "Clear" (lines 60-71); status labels "Recommended / Optional / Connected / Manual / Skip" (lines 10-14); per-integration dynamic title/blurb/steps/fields (lines 79-187)

---

## Contact & Visit (`app/contact/page.tsx`)
**SEO:** title "Contact & Visit · Price-Less Building Center" (line 21); description "Hours, directions, phone and a contact form for Price-Less Building Center in Wausau, WI." (lines 22-23)
- Hero: "Walk-ins welcome / Open Monday through Saturday / Coffee on the counter" + "Come see the warehouse." + "Easy parking out front, contractor load bay around back, the red brick building with the white 'PRICE-LESS' sign on the roof." + "Call {phone}" / "Get directions →" (lines 60-80)
- "When we're open" + "Monday through Friday until 5:30 PM, Saturday morning until 12:30 PM." + "Jump to full hours →" (lines 87-96)
- "The address." + street/city/state/zip/phone + "Off the north end of Washington Street, just past the rail crossing ... You can't miss it." (lines 108-118)
- "When we're open." + "Closed Sundays. If we are not on the floor when you walk in, ring the bell at the counter." (lines 124-134)
- "Coming in for a load?" + "Call ahead and we'll have your will-call staged at the back bay. Forklift on site, 72-hour holds, net-30 terms available for licensed contractors." (lines 140-143) **[CLAIM]**
- "Will-call & holds: {phone}" / "Contractor accounts: pricelessbuildingcenter@gmail.com" / "Wholesale & bulk: pricelessbuildingcenter@gmail.com" (lines 146-148)
- "Eight minutes from the freeway." + "US-51 / I-39 sits eight minutes east, downtown Wausau ten minutes west ... roughly forty minutes ... Stevens Point, Antigo, and Merrill." + "Open in Google Maps →" (lines 171-182) **[CLAIM]**
- Contact form: "Send us a note" / "Got a project? Tell us." + "Sourcing something specific? We'll check the shelf and call you back inside one business day ..." + fields + department dropdown + "We respond within one business day. No marketing list. We hate them too." + "Send message" (lines 189-262)
- Success toast (line 38)
- "Faster than a form — Pick up the phone." + "During warehouse hours, a real person on the floor answers every call ..." + phone (lines 273-281)

---

## Reviews (`app/reviews/page.tsx`) — review data from `lib/reviews-data.ts`
**SEO:** title "Customer Reviews · {4.8}★ on Google · Price-Less Building Center Wausau, WI" (line 14); description "Real Google, Facebook, and Yelp reviews ... {4.8} stars across {10} Google reviews ..." (line 15) **[CLAIM]**
- "What our customers say — Reviews from real customers." + "★★★★★ {avg}/5 · Google · Facebook · Yelp" (lines 76-86)
- "Every review on this page is real, pulled from the public review platforms below with attribution. We do not publish testimonials we cannot point to." (lines 89-91)
- "Bought from us recently? — Leave us a review." + "Word of mouth keeps the lights on ..." + "Review on Google / Review on Facebook / Review on Yelp / Or send us a private note →" (lines 105-140)
- **Curated review quotes** (`lib/reviews-data.ts` lines 20-100) — 12 entries, real customer quotes attributed by first name (Pamela M., Ryan T., Gary G., Sarah S., Robin B., Jeff M., Damian B., + 3 Facebook, + 2 Yelp). Notable: "...found one in great condition for $25!" (Pamela M.). **Owner should confirm these are accurately attributed.**
- **Fallback Google reviews** (`lib/google-reviews.ts` lines 45-108) — 8 entries incl. an extra one not in reviews-data: Brady D. "The best. The building was a bit creepy but the stuff inside it more than made up for it ..."

---

## Press (`app/press/page.tsx`)
**SEO:** title "Press · Price-Less Building Center" (line 98); description "Press coverage ... WSAW NewsChannel 7 and The Business News features on the mural, holiday events, and the 2019 acquisition." (lines 99-100)
- "Press & media — IN THE NEWS." + intro (lines 116-122)
- Coverage items (all link to original articles):
  - WSAW · Dec 11, 2025 · "Wausau business transforms shop into Santa's workshop" + quote (lines 25-32) **[CLAIM: date]**
  - WSAW · Apr 12, 2025 · "Easter bunny visits local Wausau business" + quote (lines 37-44) **[CLAIM]**
  - WSAW · Dec 8, 2024 · "Local business brings Santa and the North Pole to Wausau" + "125 hours of decorating" quote (lines 49-56) **[CLAIM]**
  - WSAW · Jun 17, 2023 · "New mural coming to downtown Wausau" + "50+ community volunteers under artist Stephanie Kohli" + quote (lines 61-68) **[CLAIM]**
  - The Business News · May 3, 2021 · "They're building something" + "profiled the 2019 acquisition ... roughly 40% sales growth through 2020." (lines 73-80) **[CLAIM]**
  - Type tags "Television" / "Print" (lines 34-82); "Read the original" (line 156)
- "Press contact — Working on a story? We're happy to help." + "Email the shop directly. The fastest window for a callback is mid-week during open hours (Monday through Saturday)." + "pricelessbuildingcenter@gmail.com" + "About the business" (lines 170-187)

---

## Blog index (`app/blog/page.tsx`)
**SEO:** title "Building Guides + Behind the Counter · Price-Less Building Center Wausau, WI" (line 11); description (lines 12-13)
- "The Price-Less Journal — STORIES FROM THE WAREHOUSE." + "Buying guides, reclaimed-material drops, and the behind-the-scenes math ... Written by the same people who run the counter." (lines 148-155)
- 9 post cards with title/excerpt/category/author "The Price-Less team"/date/read-time (lines 41-125). Dates Apr 9 – May 28, 2026. Notable claims in excerpts: "Three hundred SKUs hit the floor every week" (line 109), "Eighteen solid-pine 5-panel doors out of a Marathon County teardown" (line 120), "1,400 sq ft house" trim math (line 96). **[CLAIM — all dates/figures]**

## Blog post (`app/blog/[slug]/page.tsx`)
**SEO (dynamic):** title "{post.title} · Price-Less Building Center" (line 123); description (line 121)
- 4 full posts with bylines/dates and body paragraphs (lines 28-106):
  - "What to look for when buying a surplus door" (Tips, May 28, 2026) — rough-opening 34×82-1/2, "90% of return trips" (swing), 2-3/8" backset, "80% from Masonite/Jeld-Wen/Therma-Tru" **[CLAIM]**
  - "How we price every item against the big box" (Behind the Counter, May 21, 2026) — "rule we set ourselves in 2002 ... at least 20% under ... closer to 50% under", "discount about 30%" reclaimed, "started [3-number tags] in 2014" **[CLAIM]**
  - "Three reclaimed window styles trending in central WI" (Reclaimed Finds, May 14, 2026) — "$80 to $140 per sash", "pallet of fourteen ... gone in nine days" **[CLAIM]**
  - "Why our cabinet boxes come from the same factories as the big-box brands" (Behind the Counter, May 7, 2026) — "$189 base cabinet at Price-Less ... $419 at Lowe's", names Conestoga/Wolf/Showplace/Bertch/Kountry Kraft **[CLAIM]**

---

## Gift cards (`app/gift-cards/page.tsx` + `gift-card-form.tsx`) — no SEO metadata object
- "Gift cards — For the friend who's always renovating." + "Good at Price-Less Building and Builders Corner. Never expires. Spend in-store or online." (lines 17-19)
- "Pick an amount" + "Digital card emailed instantly, or printed and mailed (free within Wisconsin)." (lines 30-31)
- Sample card preview: "GC-•••• 4429 / $100.00 / For Aunt Diane, happy renovating! ❤️ / No expiration · Redeem in store or at checkout" (lines 38-42)
- Form: preset amounts $25/$50/$100/$250/$500 + "Custom" (form lines 32-44); fields; "Email digital card · Instant" / "Mail printed card · Free in WI" (lines 65-66); "Buy gift card · ${amount}" (line 71); confirmation toast (line 16)

---

## Policies — Pricing methodology (`app/policies/pricing/page.tsx`)
**SEO:** title "Pricing methodology · Price-Less Building Center" (line 6); description (lines 7-8)
- "Policies — How we price." + "We list two numbers on most items: our price, and an estimated retail value." (lines 17-24)
- "Our price" + definition (lines 29-33); "Estimated retail value" + definition ("an honest estimate ... real number we sourced from a real listing") (lines 38-45)
- "How we verify it" + "source URL, dated screenshot, notes ... We re-verify every estimate at least every 90 days ..." (lines 50-66) **[CLAIM]**
- "What we don't do" — no "you save X%" headline / no inflated retail / no "MSRP/list price/regular price" (lines 72-85)
- "Questions or a price you want us to recheck?" + phone/email + "See also our returns policy." (lines 91-103)

## Policies — Returns & exchanges (`app/policies/returns/page.tsx`)
- (No SEO metadata object found)
- "Policies — Returns & exchanges." + intro "We sell surplus and overstock at warehouse pricing ..." (lines 21-26)
- "At a glance" (lines 42-48): "30 days · most items, with receipt, unused, original packaging." **[CLAIM]** / mis-tagged full refund / reclaimed final sale / custom non-returnable once production starts / "Refunds hit the original payment method within 5 business days." **[CLAIM]**
- "Standard return window" — "30 days from pickup/delivery" + conditions (lines 52-59) **[CLAIM]**
- "Items we can't take back" — reclaimed, cut-to-order trim, cut countertop slabs, special-order Builders Corner, AS-IS clearance (lines 62-69)
- "Damaged or defective items" — photograph, "Call us within 48 hours", swap/repair/refund (lines 73-80) **[CLAIM]**
- "Custom Builders Corner work" — "non-returnable once production starts ... sign the spec sheet and pay the 50% deposit" + "deposit fully refundable within 7 days of signing" (lines 83-85) **[CLAIM]**
- "How to start a return" — walk in / call / email returns@pricelessbuilding.com (lines 88-93)
- "Refund timeline" — card same day (processor 3-5 biz days) / cash at counter / Synchrony posts within 7 biz days / store credit on the spot (lines 97-103) **[CLAIM]**
- "Contractor accounts" — "return unused items up to 60 days from invoice date" (lines 107-108) **[CLAIM]**
- "Last updated: {current date}." (line 112)

> NOTE: There is **no `app/policies/page.tsx` index page** — only the `/pricing` and `/returns` subpages exist, though the footer links to "Policies."

---

## Shop / Commerce

### Shop index (`app/shop/page.tsx`)
**SEO:** title "Shop discount + surplus building materials in Wausau, WI · Price-Less Building Center" (line 14); description (lines 15-16); OG title/desc (lines 20-21)
- "Shop · {n} items on the floor right now" (line 39); "The whole warehouse, by department." (line 42)
- "Pricing reflects current floor stock. Call us at (715) 848-3855 to put a hold on something you want to come pick up." (line 45)
- "8 departments" (line 54); per-category label + blurb (lines 66-67, from `lib/catalog-meta.ts`); "Everything in stock — {n} items, last refreshed today." (lines 83-86); Sort options (line 89)
- **Department labels & blurbs** (`lib/catalog-meta.ts` lines 16-57): Doors / Windows / Cabinets / Vanities / Countertops / Hardware / Lighting / Trim & Millwork — each with a one-line blurb.

### Shop loading (`app/shop/loading.tsx`)
- "Loading the floor…" (line 10)

### Department page (`app/shop/[category]/page.tsx`)
**SEO (dynamic):** title "{label} · {count} in stock at Price-Less Building Center Wausau, WI" (line 23); description (line 24)
- "Department No. {NN}" (line 56); "Floor · {n} items in stock" (line 61); "{label}." + blurb (lines 64-67); "← All departments" / "Ask about a specific size →" (lines 71-74); "On the floor today — {n} items." (lines 88-90); Sort (line 94); empty state "Nothing here yet — Check back Wednesday. Fresh tags every week." (lines 100-101)

### Product detail (`app/shop/item/[sku]/page.tsx`)
**SEO (dynamic):** title from item title + price/retail (line 37); description with address, "New in box from cancelled contractor orders. SKU {sku}." (lines 39-43)
- "← All {category}" / "SKU {sku}" / manufacturer / title / subtitle (lines 131-157)
- "Our price" {price}; "Estimated retail" {strikethrough}; "How we estimate this" link (lines 163-176)
- Stock: "In stock · {n} available today" or "Made to order · call to confirm" (line 185); "Call {phone} to hold" / "Ask a question" (lines 195-199)
- Fulfillment: "Free pickup at {street}, {city}" (line 209); "Local delivery within Marathon County starts at $79" (line 215) **[CLAIM]**; "Ships within Wisconsin · UPS or LTL freight" (line 221); "Too large to ship. Pickup or local delivery only" (line 226)
- Spec table labels: SKU / Manufacturer / Dimensions / Weight / Category / In store ("Front floor") (lines 233-238)
- "Why is it cheaper?" + "This came in as a cancelled order from a Wisconsin contractor ... same model number you'd find at Home Depot or Menards ... around {msrp or '2× our tag'}. Methodology." (lines 243-245)
- "Other {category} in stock" + similar cards (lines 256-268)

### Search (`app/search/page.tsx`) — no SEO metadata
- "Search · all departments — What are you looking for?" (lines 23-25); placeholder (line 33); "Search →" (line 38)
- "Popular searches": doors, windows, cabinets, vanities, hardware, trim, reclaimed, quartz, shaker (lines 43-45)
- "Or browse by department." (line 57); per-category "No. {NN}" + label + blurb (lines 62-64); results header "{n} result(s) · '{q}'" (line 72); "No match — Try a department name (doors, windows, cabinets) or a SKU." (lines 76-77)

### Compare (`app/compare/page.tsx`) — no SEO metadata
- "Price comparison" badge (line 34); "SAME ITEM. HALF THE PRICE. LOOK FOR YOURSELF." (line 37)
- "We check Home Depot, Menards, Lowe's and Amazon prices every Tuesday. Same SKUs, same manufacturers ..." (lines 40-41) **[CLAIM]**
- Stat cards: "Avg. savings vs Home Depot — 54%" / "SKUs we benchmark weekly — 3,200+" / "Big-box stores checked — 4" / "Years of receipts to prove it — 25" (lines 49-52) **[CLAIM]**
- Per-item: SKU/title/subtitle, "What you'd pay at {retailer} {price}", "Price-Less tag {price}", "You save {amount}", "{pct}% off retail", "See this one in the warehouse →" (lines 74-116)
- Disclaimer: "Prices shown ... based on retail listings checked the Tuesday before each Wednesday inventory drop. We're not affiliated with any of those retailers ..." (lines 129-131) **[CLAIM]**
- "The smart move — See it in person before you buy." + "Roll up to 825 Washington ..." + "Shop the warehouse" / "Visit the store" (lines 140-153)

### Cart (`app/cart/page.tsx` + `cart-view.tsx`)
- "Your cart · Wausau pickup or local delivery" (page line 14); "Ready to roll?" + "Pickup is free at the back load-bay. Local delivery within Marathon County starts at $79." (lines 16-20) **[CLAIM]**
- View: empty state "Empty cart — Find something on the floor and we'll hold it for pickup." + "Shop the warehouse" (lines 31-33); "{n} items" / "Clear cart" (lines 42-44); qty controls / "remove" (lines 61-67); "Order summary / Subtotal / Sales tax ({rate}%) / Pickup at warehouse — Free / Total" (lines 75-82); "Pickup is free at 825 Washington St. Local delivery within Marathon County starts at $79." (line 87) **[CLAIM]**

### Checkout (`app/checkout/page.tsx` + `checkout-form.tsx`)
- "Checkout · Step 1 of 1 — Reserve your items." + "Hold + pay in store is the most popular path. Reserves the items for 48 hours, no card needed." (page lines 14-20) **[CLAIM]**
- Form sections "01 Your info / 02 Fulfillment / 03 Payment" (lines 70-105); fields Name/Phone/Email; fulfillment options "Pickup — Free · usually 60 min" / "Local delivery — $79 flat · 25 mi · 1–3 day" (line 88) **[CLAIM]**; address fields (default Wausau/WI/54403); payment options "Hold + pay in store — No card needed · reserved 48 hours" / "Card · Stripe — Charged when we confirm stock" (lines 113-115) **[CLAIM]**
- Order sidebar; "Tax ({rate}%)"; "Place order"; "By placing this order you agree to a 48-hour pickup window and our return policy." (lines 127-154) **[CLAIM]**
- Confirmed: "Order {n} confirmed — We've emailed you a receipt. Pickup at the rear load-bay door, 825 Washington St. Usually ready in 60 minutes during open hours." + "Back to home" / "Keep shopping" (lines 45-52) **[CLAIM]**
- Empty: "Add something to your cart first." + "Shop the warehouse" (lines 61-62)

### Track order (`app/track/page.tsx`) — no SEO metadata
- "Order tracking — Where's my order?" + "Enter your order number and the email ... Pickups happen at our back load-bay door, seven days from when you placed your order." (lines 45-50) **[CLAIM]**
- Fields "Order number" (PL-ORD-XXXXX) / "Email on file"; "Track order" / "Looking up…" (lines 60-82)
- "Lost your number? Call (715) 848-3855 ..." (line 85)
- Tracked view: "Order {n}" / "Ready for pickup" / progress "Placed / Picked / Ready" with sample timestamps "Mon 8:42 AM / 11:05 AM / 2:18 PM" (lines 94-108) **[CLAIM — sample data]**
- "In your order" item rows (lines 130-146); "Pickup instructions — Pull around to the back load-bay door at 825 Washington St. Bring this order number and a photo ID ..." (lines 156-161) **[CLAIM]**; "Questions about this pickup? (715) 848-3855" / "Send us a note" (lines 168-174)

---

## Account & Auth (customer-facing)

### My account (`app/account/page.tsx`)
**SEO:** title "My account · Price-Less Building" (line 6); description (line 8)
- "Price-Less Building · Customer account" (line 38); "Welcome back{name}" / "Signed in as {email}." (lines 43-44)
- Tiles: "Keep shopping — Browse doors, windows, cabinets, and more." / "Track an order — See the status of a pickup or delivery." / "Payment methods — Securely save a card for faster checkout. Card details are handled by our payment provider, never stored by Price-Less. (Coming soon.)" (lines 47-53)
- "Sign out" (line 63); signed-out: "Your account." + "Create an account to check out faster ... we never see your password." + "Price-Less staff? Employee sign in." (lines 70-80)

### Customer auth (`app/account/customer-auth.tsx`)
- "Continue with Google" / "or" / Email (you@email.com) / Password (At least 8 characters) / "Working…" / "Create account" / "Sign in" (lines 83-123); "Already have an account?" / "New here?" + toggle (lines 128-134)
- Toasts: "Sign-in failed" / "Password too short — Use at least 8 characters." / "Could not create account" / "Check your email — Confirm your address to finish setting up your account." (lines 37-61)

### Staff login (`app/login/page.tsx` + `login-form.tsx`)
**SEO:** title "Sign in · Price-Less Admin" (line 6)
- "Price-Less Admin" + "Staff portal · Wausau, WI" + "Back to storefront →" (lines 54-65); "Staff only — Sign in to admin." + "Document items, approve drafts, generate marketing. Access is restricted to invited Price-Less team members." + "Not staff? The public storefront is at pricelessbuilding.com." (lines 73-90)
- Form: "Continue with Google" / "Redirecting…" / "We never see your Google password." (lines 43-46); toast "Sign-in failed" (line 16)

---

## Admin (internal staff tools — visible text, lower priority)

### Admin shell / nav (`components/admin-shell.tsx`)
- Nav groups: Overview(Dashboard) / Items(Add item, Staging, Inventory, Featured) / Print tags / Marketing(Generate post) / Flow(Receiving, Returns) / Config(Settings) (lines 23-32)
- "Price-Less admin" (line 73); "Storefront" (line 88); "Dev mode" (line 89); "Sign out" (line 92); "Signed in as" / "no account attached" / "Manage team →" (lines 131-135)

### Dashboard (`app/admin/page.tsx`)
- "Dashboard" / "+ Add item" (lines 34-37); cards "Add a new item — Snap a photo, describe it, pull live retail comparables, set a tag price." / "Review {n} drafts" / "Generate marketing — Turn a live item into a Facebook Marketplace post, Instagram caption, or floor flyer." (lines 44-67); "In staging" / "Recently published" / empty states / "Live SKUs / In staging / Departments" stat labels (lines 77-152)

### Inventory list (`app/admin/inventory/page.tsx` + `inventory-table.tsx`)
- "Inventory ({n})" / "Print tags" / "+ Add item" (lines 13-20); search placeholder, "All categories" / "All brands" / "Price-Less" / "Builders Corner" filters; table headers Item/SKU/Category/Tag/Retail/Qty/Added; "No items match the current filters." / "Edit" (table lines 83-182)

### Add item (`app/admin/inventory/new/page.tsx` + `new-item-form.tsx`)
- "Add new item" + "Snap a photo, describe what it is, pull live retail comparables, set a tag price, and generate the SKU + printable tag." (page lines 8-12)
- Form (lengthy): photo section, "Tell the AI what it is (optional)", "Analyze and price" + helper, "Review the details", spec fields, "Live retail comparables" (Home Depot / Lowe's / Menards / Amazon), "Retail average / Tag price / Margin slider", "Floor tag preview" (4×3" thermal tag mock), "Save to staging" + flow note, plus many toast messages (form lines 105-693)

### Item detail (`app/admin/inventory/[sku]/page.tsx`)
- "{sku} · {category} · {location} · {n} on floor" header; "Pricing (Tag/MSRP/Margin)"; "Re-run live comparable search"; "Live retail comparables ({n})"; "History (Status/Created/Created by/Currently on floor)"; "Generate post / Print tag / Storefront" (lines 23-98)

### Featured (`app/admin/featured/page.tsx`)
- "Featured ({n})" (line 24) + featured manager UI

### Receiving (`app/admin/receiving/page.tsx`)
- "Receiving — Snap one photo per item or scan packing-slip barcodes. We batch-create SKUs, run comparables, and stage them for tag print." (lines 6-8)

### Returns (`app/admin/returns/page.tsx`)
- "Returns / + Start a return" + "Every return scans back through the same SKU ..." (lines 35-39); table headers Return/Customer/Item/Reason/Refund/Status (lines 46-52); status labels pending/restock/scrap/refunded; "Restock / Scrap / done" actions
- **Sample/demo rows** (lines 17-21): Riverside Build Co. / Maria Solberg / Dan Heinrichs / Jeff Korbel / Centra Group with SKUs PL-000201, PL-000601, PL-000101, PL-000501, PL-000110 and reasons. **[CLAIM — placeholder demo data]**

### Settings (`app/admin/settings/page.tsx`)
- "Settings — Floor configuration · SKU + tag + pricing rules." (lines 5-6)
- "SKU prefix — Items default to PL-XXXXXX for Price-Less and BC-XXXXXX for Builders Corner ..." (lines 8-11)
- "Pricing rules — Suggested tag = comparable retail × 45%. Floor minimum margin = 35%. Auto-discount stale items after 60 days." (lines 14-18) **[CLAIM]**
- "Comparable retailers — Home Depot (Wausau) / Menards (Wausau) / Lowe's (Wausau) / Amazon (national)" (lines 21-26)
- "Floor printer — Brother QL-820NWB · 4×3\" continuous · Bluetooth, paired." (lines 29-31) **[CLAIM]**

### Staging (`app/admin/staging/page.tsx`)
- "Staging / Add item" + "Drafts waiting for a manager to approve before they land on the storefront." + empty state (lines 14-33)

### Print tags (`app/admin/tags/page.tsx`)
- "Print tags — 4×3\" thermal tag with Code 128 barcode, tag price, retail comparison, and aisle location. Sends to the floor printer (Brother QL-820NWB)." (lines 10-12) **[CLAIM]**

### Marketing (`app/admin/marketing/page.tsx`)
- "Marketing · {item.title} / Generate post" + "Pick a live item to generate ready-to-post copy for Facebook Marketplace, Instagram, a floor flyer, or Craigslist. Each block is copy-to-clipboard." + empty state (lines 36-60)

---

## 404 Not Found (`app/not-found.tsx`)
- "404 · Page not found" (line 19); "LOOKS LIKE THIS AISLE IS EMPTY." (line 22); "We could not find what you came in for. Either the page moved, the link is wrong, or this SKU sold out and rolled off the floor ..." (lines 25-26); "Back to the front counter" / "Browse the warehouse" (lines 30-31); "Popular sections" + category tiles (lines 36-51); "Still stuck? Call the floor at (715) 848-3855." (line 60)

---

## Shared data constants (feed multiple pages)
- `lib/brands.ts` — ADDRESS (825 Washington St, Wausau, WI 54403, (715) 848-3855), PRICELESS (founded 1978, founder Don Midlikowski, owner Josh Nickel since 2019, tagline "The Home Improvement Warehouse"), BUILDERS ("since 1983"), FOUR_SQUARED ("Two-year labor warranty"), hours, socials. **[CLAIM-heavy — primary source of truth for dates/owner/hours]**
- `lib/google-reviews.ts` — GOOGLE_RATING {average: 4.8, count: 10}; 8 fallback Google review quotes. **[CLAIM]**
- `lib/reviews-data.ts` — 12 curated reviews (Google/Facebook/Yelp) with quotes, names, dates.
- `lib/store-showcase.ts` — department inventory tiers and "+N" counts ("conservative scale"). **[CLAIM]**
- `lib/walkthrough-inventory.ts` — per-department types with real in-store price ranges read off tags during 2026-06-11 walkthrough. **[CLAIM]**
- `lib/catalog-meta.ts` — 8 department labels + blurbs (drive shop/menu copy).
- `lib/vendor-logos.ts` — 57 vendor/brand entries (drives "{n} brands" counts).

> NOTE: `FOUR_SQUARED.description` in `lib/brands.ts` (line 65) contains "Two-year labor warranty." — this warranty claim is NOT surfaced in the visible 4 Squared page copy reviewed, but lives in the JSON-LD/description data. **[CLAIM — verify warranty length]**
