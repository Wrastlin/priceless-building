# Brand Motion Styles — Price-Less · Builders Corner

**Direction:** Light, luxurious, Kohler-adjacent. Product is the sole hero. Animated cutouts in designed worlds — not warehouse pans.

**Artifacts**
- Interactive planner: Cursor canvas `brand-motion-styles.canvas.tsx`
- Visual styleboard: [`styles/brand-motion-styleboard.html`](styles/brand-motion-styleboard.html)
- Type specimen: [`styles/kohler-weight-stack.html`](styles/kohler-weight-stack.html) (300/700 locked)
- Remotion mocks: `motion-remotion/` — see [`SCENE-CATALOG.md`](SCENE-CATALOG.md)
- Reference playlist: [`references/KOHLER-PRODUCT-SHORTS.md`](references/KOHLER-PRODUCT-SHORTS.md)
- Workflow: [`REMOTION-HIGGSFIELD-WORKFLOW.md`](REMOTION-HIGGSFIELD-WORKFLOW.md)

---

## Brand jobs

| Brand | Job | Visual mood | Accent |
|-------|-----|-------------|--------|
| **Builders Corner** | Premier brands for real remodels | Parchment, brass, porcelain, calm serif | Brass `#b08d57` |
| **Price-Less** | Liquidation finds, verified savings | Same craft quality on cream; honest type | Rust `#d04727` on price only |
| **4 Squared** | Install craft | Warm daylight, material macros | Ink labels |
| **One Roof** | 60s stitch | Chapter flips cream ↔ ink | Rust only in PL chapters |

Do not mash brands in a single micro. Shared end card for the roof film:

```
PRICE-LESS BUILDING CENTER
825 Washington St · Wausau, WI
PricelessBuilding.com
(715) 848-3855
```

---

## Palette

| Token | Hex | Role |
|-------|-----|------|
| Ink | `#1a1818` | Primary text, dark grounds |
| Cream | `#f7f5f1` | Default light ground |
| Rust | `#d04727` | Price-Less price / urgency ≤10% |
| Soft | `#57534f` | Secondary text |
| Brass | `#b08d57` | Builders Corner metal accent |
| Parchment | `#f3eee6` | Builders Corner warm ground |
| Porcelain | `#f8f6f3` | Fixture highlight field |
| Sage wash | `#e8ebe4` | Optional calm bath ground |

---

## Six named styles

### 01 — Claude Console
- **Lane:** Product as furniture
- **Brands:** Builders Corner primary; Price-Less twin OK
- **Length:** 8–14s
- **Refs:** [Claude Console Sink](https://youtube.com/shorts/4byKWSv9OXY), Claude Vanity, Signature Hardware centerpiece
- **Beats:** Hero center → brand lockup → detail (legs/rim/hardware) → Introducing + name + CATEGORY → hold
- **Motion:** Slow push-in, light sweep, elegant type fade (not slam)

### 02 — Sunrise Archive
- **Lane:** Color / finish is the world
- **Length:** 8–12s
- **Refs:** [Kohler Sunrise](https://youtube.com/shorts/D42X0kToWDM), GROHE finish Shorts
- **Beats:** Optional metaphor → finish title → monochrome field + product silhouette → one honest line

### 03 — Form Fetish
- **Lane:** Apple Air / Neo grammar
- **Length:** 15–35s
- **Refs:** iPhone Air, MacBook Neo 35s
- **Beats:** Cream/ink void → edge light → macro edge → verified dims → category claim → end card
- **Motion:** Outline trace, edge-light sweep, mono data lines

### 04 — Finish Fetish
- **Lane:** Metal / porcelain closeup
- **Brand:** Builders Corner
- **Length:** 12–21s
- **Refs:** Brizo Allaria/Kintsu, AXOR One
- **Beats:** Extreme closeup → finish name → pull to 3/4 → collection line

### 05 — Price Micro
- **Lane:** Liquidation honesty on luxury craft
- **Brand:** Price-Less
- **Length:** 1.5–8s
- **Beats:** Isolated product on cream → verified price in rust → PRICE-LESS → optional Wausau
- **Rule:** Same cutout quality as Builders Corner; never ugly clearance energy

### 06 — Craft Close
- **Lane:** Install detail
- **Brand:** 4 Squared
- **Length:** 8–15s
- **Beats:** Material macro → finished vignette → 4 Squared lockup

---

## Type

### Kohler weight-stack (locked — softened)

Sans-serif only. Same geometric family. Hierarchy from **weight**, not from mixing serif/sans.

**Not a Kohler clone:** contrast is softer than the reference.

| Line | Weight | Example |
|------|--------|---------|
| Lead-in | Light **300** (was 200 — a little less skinny) | THE BOLD · LOOK OF |
| Brand lock | Bold **700** (was 900 — a little less heavy) | PRICE-LESS · BUILDERS CORNER |

```
THE BOLD          ← 300
LOOK OF           ← 300, often indented
PRICE-LESS        ← 700
```

Faces: Gotham / Montserrat / Neue Haas Grotesk — **Light 300 + Bold 700** of the same family.

Specimen: [`styles/kohler-weight-stack.html`](styles/kohler-weight-stack.html)

### Other roles

| Role | Face |
|------|------|
| Brand seal / wordmark | Official logo assets when needed |
| Product name (optional) | Same sans Black, or Light for secondary |
| Price / dims | JetBrains Mono or Gotham Medium |
| Never | Inter, Roboto, Arial · serif for this lockup |

---

## Pipeline (every style)

1. Select real photo (hi-res, least occlusion)
2. Cutout + cream studio master (`/api/clean-background`)
3. Verify finish, dims, price, brand
4. Pick style recipe 01–06
5. Animate (Vibe Motion / Remotion) — type, light, micro product move
6. End card

**Forbidden:** Kling aisle pans as the ad; AI people; unverified 40% off.

---

## First productions

1. **BC-claude-console-v1** — Remotion mock live in `motion-remotion/` (placeholder product)
2. **PL-claude-console-twin-v1** / **PL-price-micro-v1** / **PL-sunrise-archive-v1** / **PL-form-fetish-door-v1**
3. Swap placeholders for real cutouts, then Higgsfield only for approved product plates

See [`SCENE-CATALOG.md`](SCENE-CATALOG.md) · [`REMOTION-HIGGSFIELD-WORKFLOW.md`](REMOTION-HIGGSFIELD-WORKFLOW.md)
