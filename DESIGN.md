# DESIGN.md — "Showroom Warmth" system

The 2026-07 redesign. Deep navy + brass gold on warm cream, Clarendon-model
serif display, pill buttons, photo-led sections. Owner-approved direction:
the feel of a premium local remodeler, executed as our own system.

## Color (OKLCH first, hex fallback noted)

Storefront tokens (globals.css :root):

- `--background: oklch(0.985 0.006 85)` warm cream white (~#fbf9f5)
- `--surface: oklch(0.962 0.012 85)` section band cream (~#f3efe7)
- `--foreground: oklch(0.24 0.035 255)` navy ink (~#16243c)
- `--muted-foreground: oklch(0.45 0.025 255)` slate (~#4c5a70)
- `--border: oklch(0.90 0.012 85)` warm hairline (~#e4dfd5)
- `--brand-navy: oklch(0.30 0.058 255)` primary navy (~#1b3a63)
- `--brand-navy-deep: oklch(0.235 0.05 257)` footer/hero navy (~#122844)
- `--brand-gold: oklch(0.72 0.115 78)` brass gold (~#c99c47)
- `--brand-gold-deep: oklch(0.63 0.115 72)` hover/AA-text gold (~#a97e2e)
- `--sale-red: oklch(0.5 0.19 28)` savings only (~#b3261e)
- Builders Corner keeps its navy/gold; 4 Squared inherits navy.

Strategy: Committed. Navy carries the header, hero overlay, footer, and stat
band. Gold is the action + emphasis color (buttons, stars, stat numerals,
eyebrows). Red appears ONLY on "% off" badges and slashed prices.

On navy surfaces: text is cream `oklch(0.96 0.01 85)`, gold for accents,
line-height +0.05.

## Typography

- Display: **Besley** (`--font-display`), weight 500-600, title case (never
  forced uppercase), tight leading 1.08, letter-spacing -0.01em. Hero and
  section headlines, stat numerals, footer wordmark.
- Body/UI: **Hanken Grotesk** (`--font-sans`), 400/500/600/700.
- Eyebrow labels: Hanken Grotesk 600, 12px, 0.18em tracking, uppercase,
  `--brand-gold-deep` on light, `--brand-gold` on navy.
- Mono: JetBrains Mono survives only for SKU/tag numbers and admin data.
- Fraunces (`--font-couture`) stays as the Builders Corner voice.
- Utopia fluid scale in globals.css is kept as-is.

## Shape and depth

- Buttons: pills (`border-radius: 999px`). Primary = gold bg, navy-ink text.
  Secondary = navy bg cream text. Outline = 1.5px current-color.
- Cards/images: `border-radius: 14px` storefront, `8px` admin.
- Shadows stay soft and warm-tinted; never harsh.

## Imagery

Full-bleed photography with a navy multiply/gradient overlay for hero
legibility. Real store photos (mural, warehouse, staff) preferred. Every
marketing page gets at least one photographic moment.

## Motion

Keep the existing [data-reveal] IntersectionObserver system and Lenis. Ease
out only. No bounce.

## Admin (product register)

Utilitarian, dense, sans-only (Hanken Grotesk), 8px radius, warm paper
background `#f7f5f1`. Accent = `--brand-navy` (active nav = navy tinted-bg
pill, NEVER a left border stripe). Primary buttons navy, danger red kept for
destructive actions. Focus rings navy at 15% alpha. Same table vocabulary as
before, retinted warm.
