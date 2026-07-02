> STOREFRONT WIREFRAME — Price-Less Building Center
> Monospace layout review. Verbatim on-screen text per page, top to bottom.
> Shared chrome (header/footer) documented once below; later pages reference it.

================================================================================
GLOBAL CHROME
================================================================================

# [GLOBAL HEADER] — Sticky site header (every page)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Link: logo image]  Price-Less Building          [Search input ][📞][Cart][Menu]│
│  Wausau, WI · Est. 1978                                                          │
│                                                                                 │
│  LEFT (links to home /):                                                         │
│    [Image: Price-Less Building Center logo]                                      │
│    Price-Less Building            (wordmark, "Less" in brand red)               │
│    Wausau, WI · Est. 1978                                                        │
│                                                                                 │
│  RIGHT cluster:                                                                  │
│    [Input: "Search doors, windows, cabinets…"]   (lg screens only)             │
│    [Link: "(715) 848-3855"]  (phone, lg screens only)                          │
│    [Link: "Cart"  + count badge number]                                        │
│    [Button: "Menu"]  (opens drawer)                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

┌─ [EXPANDABLE — Main Menu drawer, hidden until "Menu" tapped] ──────────────────┐
│  Menu                                                   [Button: ✕ Close menu]   │
│                                                                                 │
│  PRIMARY PATHS (stacked rows, each with icon + label + sub + →):                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │ [Price-Less logo] Shop the warehouse                                    →  │ │
│  │   Surplus doors, windows, cabinets, vanities, lighting, hardware.          │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │ [Builders logo]   Premium custom cabinetry                              →  │ │
│  │   Designed in our showroom, built in our Wausau shop.                      │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │ [4 squares icon]  Custom installs + remodels                           →  │ │
│  │   Kitchens, baths, full renovations by the in-house crew.                  │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │ [wrench icon]     Start a project                                      →  │ │
│  │   Visit, call, or send us photos of your space.                            │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  Or jump straight to a department          (2-column grid, each w/ thumbnail)   │
│  [Link: "Doors"]      [Link: "Windows"]                                         │
│  [Link: "Cabinets"]   [Link: "Vanities"]                                        │
│  [Link: "Countertops"][Link: "Hardware"]                                        │
│  [Link: "Lighting"]   [Link: "Trim & Millwork"]                                 │
│                                                                                 │
│  The rest of the site                      (3-column grid)                      │
│  [Link: "Reviews"]  [Link: "About"]  [Link: "Visit + contact"]                 │
│  [Link: "Blog"]     [Link: "FAQ"]    [Link: "Contractor accounts"]             │
│                                                                                 │
│  [Button: "Call (715) 848-3855"]                                               │
└────────────────────────────────────────────────────────────────────────────────┘


# [GLOBAL FOOTER] — Site footer (every page)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Visit us · Wausau, WI                                                          │
│                                                                                 │
│  825 Washington          [Link: "(715) 848-3855 →"]                            │
│  Street.    (huge)       [Link: "Get directions →"]                            │
│                                                                                 │
│  ── COLUMNS (4-col grid) ────────────────────────────────────────────────────  │
│                                                                                 │
│  HOURS                  SHOP                SISTER BRANDS         FOLLOW         │
│  Sun   Closed           [Link: Doors]      [seal image]          [Link:Facebook↗]│
│  Mon   8:30 AM–5:30 PM  [Link: Windows]    [Link: Price-Less     [Link:Instagram↗]│
│  Tue   8:30 AM–5:30 PM  [Link: Cabinets]    Building]            [Link: Contact] │
│  Wed   8:30 AM–5:30 PM  [Link: Vanities]   [Link: Builders                       │
│  Thu   8:30 AM–5:30 PM  [Link: Hardware]    Corner]                              │
│  Fri   8:30 AM–4:30 PM                      [Link: 4 Squared]                    │
│  Sat   8:30 AM–12:30 PM                                                          │
│                                            POLICIES                              │
│                                            [Link: Returns]                       │
│                                                                                 │
│  ── BASELINE (brand-red strip) ──────────────────────────────────────────────  │
│  © <year> Price-Less Building · Builders Corner · 4 Squared                     │
│  Wausau, WI · Same building since 1978   [Link: My account] [Link: Employee sign in]│
└──────────────────────────────────────────────────────────────────────────────┘
```
> NOTE: On Builders-Corner pages the SHOP column becomes "STUDIO" with links:
>   [Link: Builders Corner] [Link: 4 Squared install] [Link: Visit the showroom]
> and the "Street." word is gold instead of red.


================================================================================
PAGE WIREFRAMES
================================================================================

# / — Home
> 🔗 **Open this page:** http://localhost:3002/

```
[GLOBAL HEADER]
```

```
┌─ HERO ─────────────────────────────────────────────────────────────────────────┐
│  ● Open today, 8:30 AM – 5:30 PM   ·   Wausau, WI   ·   Est. 1978              │
│     (status text varies; if closed: "Closed today · Open Mon 8:30 AM")          │
│                                                                                 │
│  WAUSAU'S                                                                        │
│  ONE-STOP SHOP                                                                   │
│  FOR EVERYTHING.    (last line in accent color)                                 │
│                                                                                 │
│  Discount and surplus materials, custom cabinetry, and a full install crew.     │
│  Walk the warehouse, design with our team, install with our crew.               │
│                                                                                 │
│  [Link: "Browse the warehouse →"]      [Link: "Visit the store"]               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ MURAL FIGURE ─────────────────────────────────────────────────────────────────┐
│  [Image: Build Your Future community mural]                                      │
│  "Build Your Future" mural · designed by Stephanie Kohli · painted by 50         │
│  Wausau volunteers · June 2023                            [Link: "WSAW story →"] │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ STATS STRIP (dark, 4-col) ────────────────────────────────────────────────────┐
│  HUGE              1978                    4.8★                  MON–SAT          │
│  savings vs.       serving central         on Google ·          open six days     │
│  big-box retail    Wisconsin since         10 reviews           a week            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ CATALOG BAND ─────────────────────────────────────────────────────────────────┐
│  On the floor right now            [Input: "Search doors, windows, cabinets…"]   │
│                                                                                 │
│  Browse  [Link: Doors][Windows][Cabinets][Vanities][Countertops][Hardware]      │
│          [Lighting][Trim & Millwork]   (pill row)                                │
│                                                                                 │
│  (4-col product grid — up to 12 ProductCards; see ProductCard template below)   │
│                                                                                 │
│  Much more on the floor than what fits here.        [Link: "Shop all products →"]│
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ FAMILY BAND (dark) ───────────────────────────────────────────────────────────┐
│  The rest of the family.                                                         │
│  Two more local brands across the parking lot. Use just one, or have all three   │
│  work on the same project.                                                       │
│                                                                                 │
│  ┌─ CARD (2-col) ─────────────────┐  ┌─ CARD ─────────────────────────────────┐ │
│  │ [Image + Builders logo badge]  │  │ [Image + 4 Squared logo badge]         │ │
│  │ [3 thumbnail photos]           │  │ [3 thumbnail photos]                   │ │
│  │ Builders Corner.               │  │ 4 Squared.                             │ │
│  │ Premium custom cabinetry.      │  │ The install crew. Demo, plumbing,      │ │
│  │ Kitchens, baths, and built-ins │  │ electrical, tile, finish carpentry,    │ │
│  │ designed in the showroom and   │  │ start to final walkthrough. Installs   │ │
│  │ built in our own shop in       │  │ cabinets from Builders Corner or       │ │
│  │ Wausau.                        │  │ anything you bring.                    │ │
│  │ [Custom kitchens][Custom baths]│  │ [Kitchen remodels][Bath remodels]      │ │
│  │ [Built-ins]                    │  │ [Cabinet install][Built-ins]           │ │
│  │                                │  │ [Tile + trim][Doors + windows]         │ │
│  │ Read the Builders Corner       │  │ Meet the install crew →                │ │
│  │ story →                        │  │                                        │ │
│  └────────────────────────────────┘  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ REVIEWS SECTION ──────────────────────────────────────────────────────────────┐
│  What our customers say.                  [Link: Google →][Yelp →][Facebook →]   │
│  4.8 ★★★★★  10 Google reviews · 5/5 on Facebook                                  │
│                                                                                 │
│  (masonry of 6 review cards; each: stars, source badge, quote, name, date)      │
│  e.g. "Contacted the staff to see if they had a countertop size we were having   │
│  trouble finding…" — Pamela M. · a year ago   [Google]                          │
│                                                                                 │
│  [Link: "Read all the reviews →"]                                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ TIMELINE (muted bg) ──────────────────────────────────────────────────────────┐
│  What has happened along the way.                                                │
│  The two storefronts have a few decades of history between them, and local       │
│  press has covered most of it. The milestones below link back to the original    │
│  articles.                                                                       │
│                                                                                 │
│  ● 1978   [photo] Price-Less Building Center opens in Wausau.                    │
│             A discount and surplus building-materials warehouse on Washington    │
│             Street, focused on cancelled contractor orders and factory overstock.│
│  ● 1983   [photo] Builders Corner Cabinetry & Design founded.                   │
│             A custom cabinet shop opens in Wausau, specializing in kitchens,     │
│             baths, and built-ins designed and finished locally.                  │
│  ● 2019 May [photo] Josh Nickel takes over both businesses.                     │
│             Josh Nickel takes the reins at Price-Less Building Center and        │
│             Builders Corner Cabinetry & Design. The two storefronts keep their   │
│             separate identities.   [Link: "Read the 2021 Business News profile →"]│
│  ● 2023 Jun [photo] The Build Your Future community mural is painted.            │
│             Designed by Stephanie Kohli and painted by fifty volunteers from     │
│             across Wausau, the mural now wraps the side of the building facing    │
│             Washington Street.   [Link: "Read the WSAW story →"]                 │
│  ● 2025 Apr [photo] First Easter Bunny visit at the storefront.                 │
│             A community day at the store, with the Easter Bunny visiting kids    │
│             from across central Wisconsin. The first of what became a recurring  │
│             seasonal event.   [Link: "Read the WSAW story →"]                    │
│  ● 2025 Dec [photo] Second annual Santa's Workshop at the showroom.             │
│             Santa visits the Builders Corner showroom for the second year. WSAW  │
│             covered both the decorations and the volunteer hours that went into   │
│             setting it up.   [Link: "Read the WSAW story →"]                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ BEFORE/AFTER PORTFOLIO ───────────────────────────────────────────────────────┐
│  (dark heading strip)                                                            │
│  A few of the rooms we have finished.                                            │
│  Kitchens and baths the in-house install crew has wrapped over the last few      │
│  years. The tiles below cycle through the full set.                              │
│  [Link: "Meet the install crew →"]                                              │
│                                                                                 │
│  (grid of flipping install photos)                                              │
│  We can pull from any of these designs as a starting point for your room.        │
│                                                  [Link: "Start a project →"]     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ WAREHOUSE GALLERY ────────────────────────────────────────────────────────────┐
│  Around the warehouse.                                                           │
│  A slice of what is on the floor, in the showroom, and on the walls. Click any   │
│  tile to open the full gallery.                                                  │
│                                                                                 │
│  (12 flipping photo tiles)                       [Button: "Open full gallery →"] │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─ [EXPANDABLE — Photo lightbox modal, opens on tile click] ──────────────────┐
  │  [full-screen photo]   [Button: ✕]   [Button: ‹ prev]   [Button: next ›]    │
  └──────────────────────────────────────────────────────────────────────────────┘

┌─ FACEBOOK BAND (muted bg) ─────────────────────────────────────────────────────┐
│  Around the store lately.                                                        │
│  Between visits, our Facebook and Instagram are the most current view of what    │
│  is going on at the store. New stock photos, holiday hours, customer thank-you   │
│  cards, mural updates. We post a few times a week.                               │
│                                                                                 │
│  [grid of 6 recent photos → Facebook]   | If you would rather follow along      │
│                                          | between visits, the easiest way is    │
│                                          | one of the platforms below. Yelp is   │
│                                          | mostly older reviews; Instagram and   │
│                                          | Facebook get the day-to-day photos.   │
│                                          | [Link: "Follow on Facebook →"]        │
│                                          | [Link: "Follow on Instagram →"]       │
│                                          | [Link: "Read us on Yelp →"]           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ WALKTHROUGH BAND (muted bg, id=design-walkthrough) ───────────────────────────┐
│  See it in your home before you buy.                                             │
│  A walkthrough we are putting together. Photo of your space, the pieces you      │
│  want, the colors, a render in the same photo, real pricing.                     │
│                                                                                 │
│  (5-card row, each photo + number)                                              │
│  01 [photo] Take a photo.                                                        │
│     Wall, room, doorway, or the front of the house. Anything we can build around.│
│  02 [photo] Pick what you want.                                                  │
│     Door, window, vanity, cabinet, siding, shelf, trim. Pulled from what is      │
│     actually on the floor.                                                       │
│  03 [photo] Choose colors with us.                                               │
│     Real swatches, side by side, before anything renders.                        │
│  04 [photo] See it in the photo.                                                 │
│     A full render placed back into the picture you took.                         │
│  05 [photo] Get the price.                                                       │
│     Items we actually carry, with the cost next to each one.                     │
│                                                                                 │
│  [full mural image]                                                              │
│  825 Washington Street, Wausau.                          [Link: "See our store →"]│
│  Same building since 1978. Open Monday through Saturday.                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ BRAND STATEMENT (dark, centered) ─────────────────────────────────────────────┐
│  Style and class at every price point.   ("every" in accent)                    │
│  We pride ourselves on being affordable to anyone looking to liven up their      │
│  home, and we try to make the rest of it as easy as possible.                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ NEWSLETTER BAR (brand-red card) ──────────────────────────────────────────────┐
│  STAY IN THE LOOP                                                                │
│  Get the new inventory list as it lands.                                         │
│  A short email when fresh doors, windows, or cabinets hit the floor, plus first  │
│  dibs on the design walkthrough when it launches. No spam.                       │
│  [Input: "you@gmail.com"]   [Button: "Subscribe"]                              │
└─────────────────────────────────────────────────────────────────────────────────┘
  ┌─ [STATE — after submit, replaces the form] ─────────────────────────────────┐
  │  You're on the list.                                                         │
  │  We'll be in touch when there's something worth saying.                      │
  │  (toast: "Subscribed. We'll email when fresh inventory lands and when the    │
  │   design walkthrough opens up.")                                             │
  └──────────────────────────────────────────────────────────────────────────────┘

┌─ TRUST / VISIT BLOCK (id=trust) ───────────────────────────────────────────────┐
│  VISIT THE STORE                                                                 │
│  We've been here since 1978.   ("since 1978" in accent)                         │
│  825 Washington St in Wausau. Open Mon through Sat. Family owned. Come see the    │
│  warehouse for yourself.                                                         │
│                                                                                 │
│  ┌─ MAP (Google embed) ──────────────┐  ┌─ HOURS + CTA ──────────────────────┐ │
│  │ [iframe map]                       │  │ HOURS                              │ │
│  │ 825 Washington St, Wausau, WI 54403│  │ Sun  Closed                        │ │
│  │ Free parking in the lot behind the │  │ Mon  8:30 AM – 5:30 PM             │ │
│  │ building. Loading dock on the south│  │ Tue  8:30 AM – 5:30 PM             │ │
│  │ side for pickups.                  │  │ Wed  8:30 AM – 5:30 PM             │ │
│  │ [Link: "Get directions →"]        │  │ Thu  8:30 AM – 5:30 PM             │ │
│  │                                    │  │ Fri  8:30 AM – 4:30 PM             │ │
│  │                                    │  │ Sat  8:30 AM – 12:30 PM            │ │
│  │                                    │  │ [Link: "Call (715) 848-3855"]     │ │
│  │                                    │  │ ┌─ Have a project in mind? ──────┐ │ │
│  │                                    │  │ │ We are putting together a       │ │ │
│  │                                    │  │ │ step-by-step walkthrough that   │ │ │
│  │                                    │  │ │ lets you take a photo of the    │ │ │
│  │                                    │  │ │ space, pick out the pieces, and │ │ │
│  │                                    │  │ │ see the finished room before    │ │ │
│  │                                    │  │ │ any of it leaves the warehouse. │ │ │
│  │                                    │  │ │ [Link: "See how it works →"]    │ │ │
│  │                                    │  │ └─────────────────────────────────┘ │ │
│  └────────────────────────────────────┘  └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```

────────────────────────────────────────────────────────────────────────────────
SHARED COMPONENT — ProductCard (used in catalog/shop/category/search grids)
────────────────────────────────────────────────────────────────────────────────
```
┌────────────────────────────┐
│ [product photo]            │
│ [badge: "NN% OFF"]  (if discounted)                                           │
│ [badge: first badge text]  (top-right, if present)                            │
│ Placeholder when no image: "Photo coming soon"                                │
│ ─────────────────────────  │
│ <Item title>               │
│ <Item subtitle>            │
│ $<price>   (or "Call for price")    <Location>                                │
│ Retail $<msrp> (strikethrough)      SKU <sku>                                 │
└────────────────────────────┘
```


# /shop — Catalog landing
> 🔗 **Open this page:** http://localhost:3002/shop

```
[GLOBAL HEADER]
```

```
┌─ HEADER ───────────────────────────────────────────────────────────────────────┐
│  Shop · <N> items on the floor right now                                         │
│  The whole warehouse, by department.   ("warehouse," in accent)                 │
│  Pricing reflects current floor stock. Call us at (715) 848-3855 to put a hold   │
│  on something you want to come pick up.                                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ DEPARTMENTS (horizontal scroll strip, muted bg) ──────────────────────────────┐
│  8 departments                                                                  │
│  (snap-scroll cards, one per category)                                          │
│  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐ …                            │
│  │01 / Dept ││02 / Dept ││03 / Dept ││04 / Dept │                              │
│  │[photo]   ││[photo]   ││[photo]   ││[photo]   │                              │
│  │Doors.    ││Windows.  ││Cabinets. ││Vanities. │                              │
│  │Interior, ││Double-   ││Stock     ││30" to    │                              │
│  │exterior, ││hung,     ││kitchen   ││72". Quartz│                             │
│  │slabs,    ││casement, ││runs to   ││tops, soft-│                             │
│  │pre-hung. ││picture,  ││full-     ││close,    │                              │
│  │Solid-core││sliders.  ││overlay   ││ready to  │                              │
│  │and       ││New and   ││custom    ││install.  │                              │
│  │reclaimed.││surplus.  ││Builders  ││          │                              │
│  │          ││          ││Corner    ││          │                              │
│  │          ││          ││sets.     ││          │                              │
│  └──────────┘└──────────┘└──────────┘└──────────┘                              │
│  (also: Countertops, Hardware, Lighting, Trim & Millwork — see category blurbs) │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ STORE SHOWCASE — "What's on the floor right now" ─────────────────────────────┐
│  8 departments · everything under one roof                                       │
│  What's on the floor right now.   (period in accent)                            │
│  A whole-store walkthrough, department by department. Surplus moves weekly, so   │
│  think of this as the depth you'll find when you walk in, not a fixed list.      │
│  Come dig.                                                                       │
│                                                                                 │
│  (2-col grid of department panels; each:)                                       │
│  ┌──────────────────────────────────────────┐                                  │
│  │ [department photo]                         │                                 │
│  │ <Label>      <N> types · from $<low> · <N> brands                           │
│  │ [4 thumbnail tiles, each with product-type caption]                         │
│  │ [Link: "Browse all <label> →"]                                              │
│  └──────────────────────────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ INVENTORY GRID ───────────────────────────────────────────────────────────────┐
│  Everything in stock                                                             │
│  <N> items, last refreshed today.   ("last refreshed today." in accent)        │
│  Sort · Featured / Newest / Price ↑ / Price ↓                                   │
│                                                                                 │
│  (4-col grid of ProductCards — all priceless items)                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ VENDOR WALL (muted bg) ───────────────────────────────────────────────────────┐
│  Verified vendors · <N> brands                                                  │
│  Brands on the floor                                                             │
│  Read straight off the boxes and signage in our aisles. New-in-box surplus from  │
│  the names contractors already trust.                                           │
│                                                                                 │
│  (infinite-scroll logo marquee: Andersen, Marvin, JELD-WEN, Masonite, Pella,    │
│   Velux, Therma-Tru, Schlage, Kwikset, Kohler, Delta, Blum, Quikrete, etc.)     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```


# /shop/[category] — Category listing template (generic)
> 🔗 **Template page** — visit a real one, e.g. http://localhost:3002/shop/… (replace the `[…]` part)

```
[GLOBAL HEADER]
```

```
┌─ HERO (half image / half copy, 12-col) ────────────────────────────────────────┐
│  ┌─ [category photo] ──────────────┐  ┌─ COPY ─────────────────────────────────┐│
│  │  Department No. NN  (badge)      │  │  Floor · <N> items in stock            ││
│  │                                  │  │  <Category Label>.   (huge)            ││
│  │                                  │  │  <Category blurb>                      ││
│  │                                  │  │  [Link: "← All departments"]           ││
│  │                                  │  │  [Link: "Ask about a specific size →"] ││
│  └──────────────────────────────────┘  └────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ VERIFIED FLOOR INVENTORY — "What we're carrying" ─────────────────────────────┐
│  On the floor right now                                                          │
│  What we're carrying.   (period in accent)                                      │
│  Surplus moves fast, so this is the current mix from our last floor walk, not a  │
│  fixed price list. Come see it, or call and we'll check stock and exact sizes    │
│  for you.                                                                        │
│                                                                                 │
│  (grid of product-type tiles; each:)                                            │
│  ┌──────────────────┐                                                           │
│  │ [photo]          │  badge: "Extensive selection" / "Good selection" /        │
│  │                  │         "Limited stock" / "A few in stock"                │
│  │ <Type name>   $<low>–$<high>  (or "$<n>" / "Ask for price")                  │
│  │ <brand · brand · brand>                                                       │
│  └──────────────────┘                                                           │
│                                                                                 │
│  Also on the floor: <comma-separated type names>.   (when no photo available)   │
│  Brands seen in this department: <brand · brand · brand …>                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ INVENTORY (muted bg) ─────────────────────────────────────────────────────────┐
│  On the floor today                                                              │
│  <N> items.   ("items." in accent)         Sort · Featured / Newest / Price ↑/↓ │
│                                                                                 │
│  (3-col grid of ProductCards)                                                    │
│                                                                                 │
│  ┌─ [EMPTY STATE — when 0 items] ──────────────────────────────────────────┐   │
│  │ Nothing here yet                                                          │   │
│  │ Check back Wednesday. Fresh tags every week.                             │   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```

> CATEGORY BLURBS (verbatim, used in hero + dept strips):
>   Doors        — Interior, exterior, slabs, pre-hung. Solid-core and reclaimed.
>   Windows      — Double-hung, casement, picture, sliders. New and surplus.
>   Cabinets     — Stock kitchen runs to full-overlay custom Builders Corner sets.
>   Vanities     — 30" to 72". Quartz tops, soft-close, ready to install.
>   Countertops  — Quartz, granite and butcher block. Remnants and full slabs.
>   Hardware     — Pulls, hinges, latches, casters. New-in-box from contractor overstock.
>   Lighting     — Pendants, sconces, vanity bars, recessed cans.
>   Trim & Millwork — Casing, base, crown. Primed and ready.


# /search — Search
> 🔗 **Open this page:** http://localhost:3002/search

```
[GLOBAL HEADER]
```

```
┌─ SEARCH HEADER ────────────────────────────────────────────────────────────────┐
│  Search · all departments                                                       │
│  What are you looking for?   ("looking for?" in accent)                         │
│  [Input: "Search doors, windows, cabinets, brands…"]      [Button: "Search →"]  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ DEFAULT STATE (no query) ─────────────────────────────────────────────────────┐
│  Popular searches                                                                │
│  [Link: "doors →"][windows →][cabinets →][vanities →][hardware →][trim →]        │
│  [reclaimed →][quartz →][shaker →]                                               │
│                                                                                 │
│  Or browse by department.   ("department." in accent)                           │
│  (4-col grid; each:)                                                            │
│  ┌──────────────┐                                                               │
│  │ No. NN       │                                                               │
│  │ <Label>.     │                                                               │
│  │ <blurb>      │                                                               │
│  └──────────────┘                                                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ RESULTS STATE (query present) ────────────────────────────────────────────────┐
│  <N> results · "<query>"                                                         │
│  (4-col grid of ProductCards)                                                    │
│                                                                                 │
│  ┌─ [NO-MATCH STATE] ──────────────────────────────────────────────────────┐   │
│  │ No match                                                                  │   │
│  │ Try a department name (doors, windows, cabinets) or a SKU.               │   │
│  └────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```


# /compare — Price comparison
> 🔗 **Open this page:** http://localhost:3002/compare

```
[GLOBAL HEADER]
```

```
┌─ HERO (photo bg, dark overlay) ────────────────────────────────────────────────┐
│  Price comparison   (pill)                                                       │
│  SAME ITEM. HALF THE PRICE. LOOK FOR YOURSELF.                                   │
│  We check Home Depot, Menards, Lowe's and Amazon prices every Tuesday. Same      │
│  SKUs, same manufacturers. Here's what those identical items cost across town,   │
│  alongside our tag.                                                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ HEADLINE STATS (4-col) ───────────────────────────────────────────────────────┐
│  54%                3,200+               4                    25                  │
│  Avg. savings vs    SKUs we benchmark    Big-box stores       Years of receipts  │
│  Home Depot         weekly               checked              to prove it        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ COMPARISON CARDS (2-col grid, up to 8 discounted items) ──────────────────────┐
│  ┌─ CARD ─────────────────────────────────────────────────────────────────┐    │
│  │ [photo]  │ SKU <sku>                                                     │    │
│  │          │ <Item title>                                                  │    │
│  │          │ <Item subtitle>                                               │    │
│  │          │ WHAT YOU'D PAY AT                                             │    │
│  │          │ ┌─────────────────────────────────────────┐                  │    │
│  │          │ │ Home Depot              $<msrp×1.00>     │                  │    │
│  │          │ │ Menards                 $<msrp×0.92>     │                  │    │
│  │          │ │ Lowe's                  $<msrp×0.88>     │                  │    │
│  │          │ │ Amazon                  $<msrp×1.05>     │                  │    │
│  │          │ └─────────────────────────────────────────┘                  │    │
│  │          │ ┌─ (brand-red) ───────────────────────────┐                  │    │
│  │          │ │ Price-Less tag    $<price>  You save $<n>│                  │    │
│  │          │ │                             <NN>% off retail                │    │
│  │          │ └─────────────────────────────────────────┘                  │    │
│  │          │ [Link: "See this one in the warehouse →"]                     │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ DISCLAIMER (muted bg, centered) ──────────────────────────────────────────────┐
│  Prices shown for Home Depot, Menards, Lowe's and Amazon are based on retail     │
│  listings checked the Tuesday before each Wednesday inventory drop. We're not    │
│  affiliated with any of those retailers. We just price against them so you       │
│  don't have to.                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ CTA (dark card) ──────────────────────────────────────────────────────────────┐
│  THE SMART MOVE                                                                  │
│  See it in person before you buy.                                                │
│  Photos are great. A tape measure is better. Roll up to 825 Washington. We'll    │
│  walk you right to the bin.                                                      │
│  [Link: "Shop the warehouse"]   [Link: "Visit the store"]                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```


# /cart — Cart
> 🔗 **Open this page:** http://localhost:3002/cart

```
[GLOBAL HEADER]
```

```
┌─ HEADER ───────────────────────────────────────────────────────────────────────┐
│  Your cart · Wausau pickup or local delivery                                     │
│  Ready to roll?   ("roll?" in accent)        Pickup is free at the back load-bay.│
│                                              Local delivery within Marathon       │
│                                              County starts at $79.               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ EMPTY-CART STATE ─────────────────────────────────────────────────────────────┐
│  Empty cart                                                                      │
│  Find something on the floor and we'll hold it for pickup.                       │
│  [Link: "Shop the warehouse"]                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ FILLED CART (line items + summary, 12-col) ───────────────────────────────────┐
│  ┌─ LINE ITEMS (8-col) ──────────────────────┐  ┌─ SUMMARY (4-col) ──────────┐ │
│  │ <N> items            [Button: Clear cart]  │  │ ORDER SUMMARY              │ │
│  │ ─────────────────────────────────────────  │  │ Subtotal           $<n>   │ │
│  │ [thumb] <title>           [−][qty][+]  $<n> │  │ Sales tax (5.5%)   $<n>   │ │
│  │         <subtitle>                  [remove]│  │ Pickup at warehouse Free  │ │
│  │         SKU <sku> · <location>             │  │ ─────────────────────────  │ │
│  │ (repeats per line)                         │  │ Total              $<n>   │ │
│  │                                            │  │ [Link: "Checkout"]        │ │
│  │                                            │  │ Pickup is free at 825      │ │
│  │                                            │  │ Washington St. Local       │ │
│  │                                            │  │ delivery within Marathon   │ │
│  │                                            │  │ County starts at $79.      │ │
│  └────────────────────────────────────────────┘  └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```


# /checkout — Checkout
> 🔗 **Open this page:** http://localhost:3002/checkout

```
[GLOBAL HEADER]
```

```
┌─ HEADER ───────────────────────────────────────────────────────────────────────┐
│  Checkout · Step 1 of 1                                                          │
│  Reserve your items.   ("items." in accent)   Hold + pay in store is the most   │
│                                               popular path. Reserves the items   │
│                                               for 48 hours, no card needed.      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ EMPTY STATE (cart empty) ─────────────────────────────────────────────────────┐
│  Add something to your cart first.                                               │
│  [Link: "Shop the warehouse"]                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ CHECKOUT FORM (7-col) ────────────────────┐  ┌─ ORDER SUMMARY (5-col) ────────┐
│  01  Your info.                             │  │ Order · <N> items              │
│  [Input: Name][Input: Phone][Input: Email]  │  │ [thumb] <title>  × <qty>  $<n> │
│                                             │  │ (repeats)                      │
│  02  Fulfillment.                           │  │ Subtotal           $<n>        │
│  ┌──────────────────┐┌──────────────────┐   │  │ Tax (5.5%)         $<n>        │
│  │ ○ Pickup         ││ ○ Local delivery │   │  │ Pickup/Delivery    Free/$79    │
│  │ Free · usually   ││ $79 flat · 25 mi │   │  │ ─────────────────────────────  │
│  │ 60 min           ││ · 1–3 day        │   │  │ Total              $<n>        │
│  └──────────────────┘└──────────────────┘   │  │ [Button: "Place order"]        │
│  ┌─ [EXPANDS when "Local delivery" chosen]┐  │  │ By placing this order you      │
│  │ [Input: Street address]                 │  │  │ agree to a 48-hour pickup      │
│  │ [Input: City="Wausau"][Input: State="WI"]│ │  │ window and our return policy.  │
│  │ [Input: ZIP="54403"]                    │  │  └────────────────────────────────┘
│  └─────────────────────────────────────────┘  │
│                                             │
│  03  Payment.                               │
│  ┌──────────────────┐┌──────────────────┐   │
│  │ ○ Hold + pay in  ││ ○ Card · Stripe  │   │
│  │   store          ││ Charged when we  │   │
│  │ No card needed · ││ confirm stock    │   │
│  │ reserved 48 hours││                  │   │
│  └──────────────────┘└──────────────────┘   │
└─────────────────────────────────────────────┘

  ┌─ [CONFIRMATION STATE — after Place order] ──────────────────────────────────┐
  │  ✓                                                                          │
  │  Order PL-ORD-NNNNN confirmed                                               │
  │  We've emailed you a receipt. Pickup at the rear load-bay door, 825         │
  │  Washington St. Usually ready in 60 minutes during open hours.             │
  │  [Link: "Back to home"]   [Link: "Keep shopping"]                          │
  │  (toast: "Order PL-ORD-NNNNN confirmed")                                   │
  └──────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```


# /track — Order tracking
> 🔗 **Open this page:** http://localhost:3002/track

```
[GLOBAL HEADER]
```

```
┌─ HERO (photo bg, dark overlay) ────────────────────────────────────────────────┐
│  Order tracking   (pill)                                                         │
│  Where's my order?                                                               │
│  Enter your order number and the email you used at checkout. Pickups happen at   │
│  our back load-bay door, seven days from when you placed your order.             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ LOOKUP FORM (card) ───────────────────────────────────────────────────────────┐
│  Order number                                                                    │
│  [Input: "PL-ORD-XXXXX"]                                                         │
│  Email on file                                                                   │
│  [Input: "you@example.com"]                                                      │
│  [Button: "Track order"]   (while loading: "Looking up…")                        │
│  Lost your number? Call (715) 848-3855 and we'll dig it out of the day's tickets.│
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─ [RESULT — shown after lookup submitted] ───────────────────────────────────┐
  │  Order  <ORDER NO>                    ● Ready for pickup                     │
  │                                                                             │
  │  PROGRESS (3 steps)                                                          │
  │   1 Placed     2 Picked     3 Ready                                          │
  │   Mon 8:42 AM  Mon 11:05 AM Mon 2:18 PM                                      │
  │                                                                             │
  │  In your order                                                              │
  │  ┌──────────────────────────────────────────────────────────────────────┐ │
  │  │ [thumb] <title>           $<price>                                     │ │
  │  │         <subtitle> · <location>   SKU <sku>                            │ │
  │  │ (demo: 2 items)                                                        │ │
  │  └──────────────────────────────────────────────────────────────────────┘ │
  │                                                                             │
  │  Pickup instructions                                                        │
  │  Pull around to the back load-bay door at 825 Washington St. Bring this     │
  │  order number and a photo ID. We'll forklift it to your trailer or strap    │
  │  it down in your truck bed. After-hours? Call ahead. We keep keys to the    │
  │  will-call locker on hand.                                                  │
  │                                                                             │
  │  Questions about this pickup?  (715) 848-3855      [Link: "Send us a note"] │
  └──────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```


# /builders-corner — Builders Corner Cabinetry & Design
> 🔗 **Open this page:** http://localhost:3002/builders-corner

```
[GLOBAL HEADER]  (brand=builders)
```

```
┌─ HERO (dark band, 12-col) ─────────────────────────────────────────────────────┐
│  [Builders Corner logo]                              (715) 848-3855  (md+)       │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  ┌─ COPY (7-col) ─────────────────────────────┐  ┌─ PHOTO (5-col) ───────────┐  │
│  │ The premium side of Price-Less             │  │ [crossfading hero deck of │  │
│  │ Premium custom cabinetry, designed and     │  │  6 kitchen/bath install   │  │
│  │ built in Wausau.                           │  │  photos]                  │  │
│  │ If you are thinking about a kitchen, a      │  │                           │  │
│  │ bath, or a built-in that is genuinely yours,│ │                           │  │
│  │ this is where to start. We sit down with you│ │                           │  │
│  │ in the showroom, draw your room out         │  │                           │  │
│  │ together, build the cabinets in our own     │  │                           │  │
│  │ shop, and the 4 Squared crew installs them. │  │                           │  │
│  │ There is no pressure to start big. Small    │  │                           │  │
│  │ projects are welcome too.                   │  │                           │  │
│  │ [Link: "Book a free consultation"]          │  │                           │  │
│  │ [Link: "Or call (715) 848-3855"]            │  │                           │  │
│  └─────────────────────────────────────────────┘  └───────────────────────────┘  │
│  ── STATS (3-col) ─────────────────────────────────────────────────────────────  │
│  1983                       4.8★                    MON–SAT                       │
│  Designing and building     On Google across all    Showroom open six days       │
│  cabinetry in Wausau.       three brands.           a week.                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ WHAT WE MAKE (muted bg) ──────────────────────────────────────────────────────┐
│  What we make.                                                                   │
│  Custom cabinetry for kitchens, baths, and the rest of the house. Designed and   │
│  built here, installed by the 4 Squared crew.                                    │
│                                                                                 │
│  (3-col service cards)                                                          │
│  ┌─────────────────┐┌─────────────────┐┌─────────────────────────────┐         │
│  │ [photo]         ││ [photo]         ││ [photo]                     │         │
│  │ Custom kitchens ││ Custom baths    ││ Built-ins for the rest of   │         │
│  │ Cabinets,       ││ Vanities, linen ││ the house                   │         │
│  │ islands,        ││ towers, quartz  ││ Pantries, mudrooms, home    │         │
│  │ integrated      ││ tops, full tile ││ offices, libraries, laundry │         │
│  │ panels, drawn to││ work. Designed  ││ runs. Same finish booth.    │         │
│  │ your room and   ││ in the showroom.││                             │         │
│  │ built locally.  ││                 ││                             │         │
│  └─────────────────┘└─────────────────┘└─────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ PROCESS (dark band, 4-col) ───────────────────────────────────────────────────┐
│  Four steps from idea to install.                                                │
│  01 [photo] Free consultation                                                    │
│     Showroom visit or we come to your home. Bring photos or just an idea.        │
│  02 [photo] Design with you                                                      │
│     We measure, draw your room, and walk you through real samples.               │
│  03 [photo] Build in the shop                                                    │
│     Doors, drawers, and finishes built locally in Wausau.                        │
│  04 [photo] Installed by 4 Squared                                               │
│     The install crew sets the cabinets and walks the punch list with you.        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ SHOWROOM GRID — "Recent rooms" ───────────────────────────────────────────────┐
│  Recent rooms.                                                                   │
│  A few directions to start from. Every photo is a real install.                  │
│  (asymmetric magazine grid; each photo has a tag badge + caption)               │
│   [Kitchen] White kitchen with a marble-top island.                             │
│   [Kitchen] White cabinetry with a warm wood island.                            │
│   [Kitchen] Rustic kitchen with a heavy wood island.                            │
│   [Kitchen] Dark-cabinet kitchen with quartz counters.                          │
│   [Kitchen] Classic white-shaker kitchen build.                                 │
│   [Bath]    Dark double-vanity bath with white counter.                         │
│   [Kitchen] Wood-cabinet kitchen with a center island and gas range.            │
│   [Bath]    Double-sink bath vanity, black cabinetry, framed mirrors.           │
│   [Kitchen] Wood cabinetry paired with granite countertops.                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ CONSULT INQUIRY FORM (id=consult) ────────────────────────────────────────────┐
│  Get in touch                                                                    │
│  Book a consultation.                                                            │
│  First consult is free. We'll meet you in the showroom at 825 Washington or come │
│  measure your space.                                                             │
│  [Input: Your name "Jane Hanson"]    [Input: Email "jane@example.com"]          │
│  [Input: Phone (optional) "(715) 555-0142"]                                     │
│  [Select: What do you need? *] options:                                          │
│     Custom kitchen design / Custom bath design / Cabinetry quote /               │
│     Installation / remodel / Schedule a walkthrough /                            │
│     In-store measuring & planning / General question / Other                     │
│  [Textarea: Tell us about the project — "Old galley kitchen, want to take out    │
│     the wall to the dining room. Two cooks, big island."]                        │
│  We don't share your info. Or just call (715) 848-3855.                         │
│  [Button: "Send to Builders Corner →"]   (while sending: "Sending…")            │
└─────────────────────────────────────────────────────────────────────────────────┘
  ┌─ [SUCCESS STATE — replaces form] ───────────────────────────────────────────┐
  │  Got it.                                                                     │
  │  Thanks. We'll be in touch within one business day.                         │
  │  Can't wait? Call (715) 848-3855.                                           │
  └──────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]  (brand=builders — "STUDIO" column variant)
```


# /four-squared — 4 Squared install crew
> 🔗 **Open this page:** http://localhost:3002/four-squared

```
[GLOBAL HEADER]  (brand=four-squared)
```

```
┌─ HERO (photo bg, dark overlay) ────────────────────────────────────────────────┐
│  [4 Squared logo card]                                                           │
│  The install side of 825 Washington Street                                       │
│  The install crew that finishes the job.   ("finishes the job." in emerald)     │
│  4 Squared handles the work. Kitchens, baths, doors, finish carpentry. We        │
│  install cabinets from Builders Corner, materials from the Price-Less floor, or  │
│  anything you bring on your own. One crew lead from demo through the final       │
│  walkthrough.                                                                    │
│  [Link: "Get a free estimate →"]   [Link: "Or call (715) 848-3855"]            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ MEET JOSH (white bg, photo + copy) ───────────────────────────────────────────┐
│  [Josh Nickel photo]  │ Voted Top 5 in Marathon County                          │
│                       │ Meet Josh Nickel.                                       │
│                       │ Josh is the face behind all three businesses under one  │
│                       │ roof, Price-Less, Builders Corner, and 4 Squared, with  │
│                       │ over 27 years in construction. He started his own       │
│                       │ company in Winona, Minnesota while training as an       │
│                       │ aviation mechanic, and has spent his career turning     │
│                       │ spaces into finished kitchens and baths that people     │
│                       │ love.                                                   │
│                       │ On the install side he runs the crew with Ty, from      │
│                       │ demo, plumbing, electrical, tile, and finish carpentry  │
│                       │ through the final walkthrough. His goal at Price-Less is │
│                       │ simple: beautiful, affordable, quality kitchens and     │
│                       │ bathrooms for Marathon County and beyond. The work has  │
│                       │ been recognized as a Top 5 remodeler in the county.     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ FACEBOOK (muted bg) ──────────────────────────────────────────────────────────┐
│  See the work on Facebook.                                                       │
│  Real finished 4 Squared projects, straight from the crew's own page.            │
│  [Facebook Page Plugin iframe — live feed]                                       │
│  [Link: "See all photos on Facebook →"]                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ PROCESS (dark band, 4-col) — "How a project runs" ────────────────────────────┐
│  How a project runs.                                                             │
│  Plain English, no fabricated timelines.                                         │
│  01 [photo] Consult                                                              │
│     Free walk-through at your house, or sit down at the showroom.                │
│  02 [photo] Estimate                                                             │
│     Line-item written estimate, broken out so nothing is buried.                 │
│  03 [photo] Build                                                                │
│     Same crew lead from demo through final. Floors and counters protected,       │
│     cleaned up daily.                                                            │
│  04 [photo] Walkthrough                                                          │
│     We walk the punch list together. Anything not right gets fixed before final  │
│     payment.                                                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ INQUIRY FORM ─────────────────────────────────────────────────────────────────┐
│  Project intake                                                                  │
│  Tell us about your project.                                                     │
│  Walkthroughs, estimates, design help. We read every one ourselves.             │
│  [Input: Your name "Jane Hanson"]    [Input: Email "jane@example.com"]          │
│  [Input: Phone (optional) "(715) 555-0142"]                                     │
│  [Select: What do you need? *] (same options as Builders Corner form)            │
│  [Textarea: Tell us about the project — "Old galley kitchen, want to take out    │
│     the wall to the dining room. Two cooks, big island."]                        │
│  We don't share your info. Or just call (715) 848-3855.                         │
│  [Button: "Send to 4 Squared"]   (while sending: "Sending…")                    │
└─────────────────────────────────────────────────────────────────────────────────┘
  ┌─ [SUCCESS STATE — replaces form] ───────────────────────────────────────────┐
  │  Got it.                                                                     │
  │  Thanks. We'll be in touch within one business day.                         │
  │  Can't wait? Call (715) 848-3855.                                           │
  └──────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]  (brand=priceless)
```


# /financing — Financing
> 🔗 **Open this page:** http://localhost:3002/financing

```
[GLOBAL HEADER]
```

```
┌─ HERO (photo bg, dark overlay) ────────────────────────────────────────────────┐
│  Financing · Synchrony & GreenSky   (pill)                                       │
│  BUY THE WHOLE PROJECT. PAY IT LIKE A BILL.                                      │
│  90 days same-as-cash on doors and hardware. 12 months 0% APR on full kitchens.  │
│  Extended 24–60 month plans for the big remodels. Apply from your phone, get a   │
│  decision in under a minute.                                                     │
│  [Link: "Apply now"]   [Link: "Talk to a person"]                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ TIERS (3-col) ────────────────────────────────────────────────────────────────┐
│  Three plans, every project                                                      │
│  Pick a payment shape that fits the job.                                         │
│  ┌─────────────────────┐┌─────────────────────┐┌─────────────────────┐         │
│  │ Most popular        ││ Big-project favorite││ Long term           │         │
│  │ 90 days same-as-cash││ 12 months, 0% APR   ││ 24–60 months extended│        │
│  │ 0% APR              ││ 0% APR              ││ from 7.99% APR      │         │
│  │ Pay it off inside   ││ Spread the cost of a││ Lock in a fixed     │         │
│  │ 90 days. No interest,││ full kitchen or    ││ monthly payment on  │         │
│  │ no fees, no math.   ││ window package      ││ jobs $5,000 and up. │         │
│  │ Great for fast      ││ across a year,      ││ Available through   │         │
│  │ remodels and small  ││ interest free.      ││ GreenSky for        │         │
│  │ projects under      ││ On purchases of     ││ qualifying          │         │
│  │ $2,500.             ││ $1,500 or more,     ││ contractors and     │         │
│  │ Best for: weekend   ││ with approved       ││ homeowners.         │         │
│  │ projects            ││ credit.             ││ Best for: gut       │         │
│  │ [Link: "Apply for   ││ Best for: kitchens  ││ remodels & additions│         │
│  │  this plan"]        ││ & full windows      ││ [Link: "Apply for   │         │
│  │                     ││ [Link: "Apply for   ││  this plan"]        │         │
│  │                     ││  this plan"]        ││                     │         │
│  └─────────────────────┘└─────────────────────┘└─────────────────────┘         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ HOW IT WORKS (dark bg, 3-col) ────────────────────────────────────────────────┐
│  How it works                                                                    │
│  From your phone to the load bay in one afternoon.                               │
│  01 Apply in minutes                                                             │
│     Soft credit check, no impact to your score until you accept an offer. Takes  │
│     about 90 seconds from your phone.                                            │
│  02 Get a decision on the spot                                                   │
│     Most applicants hear back inside 60 seconds. Show approval at the counter.    │
│     No paperwork to print.                                                       │
│  03 Use it like a card                                                           │
│     Approved? Your credit line works for every Price-Less purchase, in-store or  │
│     for jobsite delivery. Use it once or use it for the whole project.           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ FAQ ──────────────────────────────────────────────────────────────────────────┐
│  Frequently asked                                                                │
│  Common questions, real answers.                                                 │
│  (accordion of collapsible <details> rows, each with a "+" toggle)              │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─ [EXPANDABLE — FAQ accordion items, collapsed until "+" clicked] ───────────┐
  │ + Will applying hurt my credit score?                                       │
  │   No. Both Synchrony and GreenSky run a soft inquiry up front (the kind that │
  │   doesn't show on your credit report). Only if you accept an offer and the   │
  │   line is opened does a hard pull happen.                                    │
  │ + How fast does approval come back?                                          │
  │   Almost always under a minute. If something needs a manual review, you'll   │
  │   typically hear back the same business day.                                 │
  │ + What's the minimum purchase?                                              │
  │   $299 for the 90-day same-as-cash plan, $1,500 for the 12-month 0% APR plan,│
  │   and $5,000 for the extended 24–60 month plans.                            │
  │ + Can I use financing for delivery and labor?                              │
  │   Yes. Anything that lands on your Price-Less invoice qualifies. That        │
  │   includes jobsite delivery, will-call holds, and Builders Corner install    │
  │   fees if you're bundling cabinetry.                                         │
  │ + Do contractors get a different program?                                   │
  │   Yes. Licensed contractors signed up through our contractor program get     │
  │   net-30 account billing and a separate revolving line that doesn't touch    │
  │   personal credit. Ask at the counter or sign up on the contractors page.    │
  │ + What if I'm self-employed or new to credit?                              │
  │   Synchrony looks at more than just FICO. Income and tradelines matter. Most │
  │   central-Wisconsin self-employed contractors get approved. If you don't,    │
  │   we'll help you set up a layaway hold instead.                              │
  │ + Can I pay it off early?                                                   │
  │   Always. There's never an early-payoff penalty on any of our financing      │
  │   options.                                                                   │
  │ + What types of projects qualify?                                          │
  │   Anything you can buy at Price-Less or Builders Corner: doors, windows,     │
  │   full kitchens, vanities, hardware, countertops, lighting, trim. We've      │
  │   financed everything from a single front door to a $42,000 whole-home       │
  │   remodel package.                                                           │
  └──────────────────────────────────────────────────────────────────────────────┘

┌─ CTA (brand-red card) ─────────────────────────────────────────────────────────┐
│  Ready to apply?                                                                 │
│  Most decisions in under 60 seconds. No impact to your credit to check.          │
│  [Link: "Start application"]   [Link: "Talk to us first"]                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```


# /gift-cards — Gift cards
> 🔗 **Open this page:** http://localhost:3002/gift-cards

```
[GLOBAL HEADER]
```

```
┌─ HERO (photo bg, dark overlay) ────────────────────────────────────────────────┐
│  Gift cards                                                                      │
│  For the friend who's always renovating.                                         │
│  Good at Price-Less Building and Builders Corner. Never expires. Spend in-store   │
│  or online.                                                                      │
│  [Price-Less logo]  +  [Builders Corner logo]                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ PICK AN AMOUNT (form, 2-col) ─────────────┐  ┌─ PREVIEW CARD ─────────────────┐
│  Pick an amount                             │  │ [Price-Less logo]  GC-•••• 4429│
│  Digital card emailed instantly, or printed │  │ $ 100.00                       │
│  and mailed (free within Wisconsin).        │  │ For Aunt Diane, happy          │
│                                             │  │ renovating! ❤️                 │
│  AMOUNT (preset buttons + custom):          │  │ No expiration · Redeem in store│
│  [Button:$25][$50][$100][$250][$500]        │  │ or at checkout                 │
│  [Input: "Custom"]                          │  └────────────────────────────────┘
│                                             │
│  [Input: Your name]   [Input: Your email]   │
│  [Input: Recipient name]                    │
│  [Input: Recipient email or address]        │
│  [Textarea: Message — "A note to include    │
│    with the card"]                          │
│                                             │
│  DELIVERY:                                   │
│  [○ Email digital card · Instant]           │
│  [○ Mail printed card · Free in WI]         │
│                                             │
│  [Button: "Buy gift card · $<amount>"]      │
│  (toast on submit: "$<amount> gift card     │
│   queued. Confirmation email on the way")   │
└─────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```


# /contact — Contact & Visit
> 🔗 **Open this page:** http://localhost:3002/contact

```
[GLOBAL HEADER]
```

```
┌─ [BANNER — shown only after form submit] ──────────────────────────────────────┐
│  SUCCESS: Thanks — message sent. We'll get back to you within one business day.  │
│           For anything urgent please call (715) 848-3855.                        │
│  ERROR:   Couldn't send: <error message>                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ HERO (storefront photo bg, dark overlay, 12-col) ─────────────────────────────┐
│  ● Walk-ins welcome / Open Monday through Saturday / Coffee on the counter       │
│  Come see the warehouse.   ("warehouse." in accent)                             │
│  825 Washington St, Wausau, WI 54403. Easy parking out front, contractor load    │
│  bay around back, the red brick building with the white "PRICE-LESS" sign on     │
│  the roof.                                                                       │
│  [Link: "Call (715) 848-3855"]   [Link: "Get directions →"]                    │
│                                                  ┌─ aside ───────────────────┐  │
│                                                  │ When we're open           │  │
│                                                  │ Monday through Friday      │  │
│                                                  │ until 5:30 PM, Saturday    │  │
│                                                  │ morning until 12:30 PM.    │  │
│                                                  │ Full week shown below.     │  │
│                                                  │ [Link: "Jump to full       │  │
│                                                  │  hours →"]                 │  │
│                                                  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ VISIT INFO + HOURS (3-col) ───────────────────────────────────────────────────┐
│  VISIT               │ HOURS                  │ CONTRACTORS                       │
│  The address.        │ When we're open.       │ Coming in for a load?             │
│  825 Washington St   │ Sun  Closed            │ Call ahead and we'll have your    │
│  Wausau, WI 54403    │ Mon  8:30 AM–5:30 PM   │ will-call staged at the back bay. │
│  (715) 848-3855      │ Tue  8:30 AM–5:30 PM   │ Forklift on site, 72-hour holds,  │
│  Off the north end   │ Wed  8:30 AM–5:30 PM   │ net-30 terms available for        │
│  of Washington       │ Thu  8:30 AM–5:30 PM   │ licensed contractors.             │
│  Street, just past   │ Fri  8:30 AM–4:30 PM   │ Will-call & holds: (715) 848-3855 │
│  the rail crossing.  │ Sat  8:30 AM–12:30 PM  │ Contractor accounts:              │
│  The red brick       │ Closed Sundays. If we  │   pricelessbuildingcenter@gmail.com│
│  building with the   │ are not on the floor   │ Wholesale & bulk:                 │
│  white "PRICE-LESS"  │ when you walk in, ring │   pricelessbuildingcenter@gmail.com│
│  sign on the roof.   │ the bell at the counter.│                                  │
│  You can't miss it.  │                        │                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ MAP + FORM (2-col) ───────────────────────────────────────────────────────────┐
│  ┌─ MAP ──────────────────────────┐  ┌─ FORM ─────────────────────────────────┐ │
│  │ [Google Maps iframe]           │  │ Send us a note                         │ │
│  │ Drop a pin                     │  │ Got a project? Tell us.  ("Tell us." accent)│
│  │ Eight minutes from the freeway.│  │ Sourcing something specific? We'll     │ │
│  │ US-51 / I-39 sits eight minutes│  │ check the shelf and call you back       │ │
│  │ east, downtown Wausau ten      │  │ inside one business day. For urgent     │ │
│  │ minutes west, and roughly forty│  │ will-call, please use the phone instead.│ │
│  │ minutes pulls you in from      │  │ [Input: Your name "Pat Lindgren"]      │ │
│  │ Stevens Point, Antigo, and     │  │ [Input: Email "name@yourbusiness.com"] │ │
│  │ Merrill.                       │  │ [Input: Phone (optional) "(715)555-0123"]│
│  │ [Link: "Open in Google Maps →"]│  │ [Select: What are you looking for? *]   │ │
│  └────────────────────────────────┘  │   Choose a department… / Doors (interior,│
│                                       │   exterior, reclaimed) / Windows /      │ │
│                                       │   Cabinets / Vanities / Countertops /   │ │
│                                       │   Hardware / Lighting / Trim & millwork/│ │
│                                       │   Custom kitchen / bath (Builders       │ │
│                                       │   Corner) / Something else              │ │
│                                       │ [Textarea: Message "Tell us sizes,      │ │
│                                       │   finish, qty, when you need it…"]      │ │
│                                       │ We respond within one business day.     │ │
│                                       │ No marketing list. We hate them too.    │ │
│                                       │ [Button: "Send message"]               │ │
│                                       └────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ PHONE CTA (dark band) ────────────────────────────────────────────────────────┐
│  Faster than a form                                                              │
│  Pick up the phone.                                                              │
│  During warehouse hours, a real person on the floor answers every call. Tell us  │
│  what you need and we'll walk over and look at it for you.                        │
│  [Link: "(715) 848-3855"]                                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
[GLOBAL FOOTER]
```
