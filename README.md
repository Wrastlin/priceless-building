# Price-Less Building Center

E-commerce + back-office for **Price-Less Building Center**, **Builders Corner
Cabinetry & Design**, and **Four Squared** — three sister businesses run by
the same family out of 825 Washington Street in Wausau, Wisconsin.

> **One project. Three brands. One inventory.** Customers buy materials at
> Price-Less, hire Builders Corner to design a custom kitchen or bath, and
> Four Squared installs it. The whole thing lives in this repo.

---

## What's in here

```
priceless-building/
├── app/                     Next.js 16 App Router pages
│   ├── (Price-Less storefront)     /, /shop, /shop/[category], /shop/item/[sku]
│   ├── builders-corner/            /builders-corner, /kitchens, /baths, /gallery, /process,
│   │                               /finishes, /door-styles, /consultation, /portfolio/[slug],
│   │                               /showroom, /build-your-kitchen, /shop
│   ├── four-squared/               /four-squared (install crew brand site)
│   ├── admin/                      Internal back-office (POS, inventory, tags, receiving,
│   │                               sales channels, schedule, audit log, etc.)
│   ├── api/                        /api/comparables, /api/barcode/[sku].svg
│   └── cart, checkout, contact, about, tour, aisle-map, search …
├── components/              Site header, footer, product card, admin shell, cart, etc.
├── lib/
│   ├── catalog.ts                  Catalog data + types (CatalogItem, CATEGORIES)
│   ├── brands.ts                   Address, phone, hours, social — single source of truth
│   ├── cart.ts                     Client-side cart (localStorage)
│   ├── comparable-search.ts        SerpApi adapter (live retail benchmark)
│   ├── barcode.ts                  Code 128 SVG generator (server-side, scannable)
│   ├── utils.ts                    formatCurrency, formatSKU, cn
│   └── actions/                    Server actions (leads, claims, etc.)
├── public/images/           Static assets
└── .research/               Internal research notes (gitignored)
```

## Self-contained

This project is **fully independent** of every other repo on this machine:

- Its own `package.json`, `node_modules`, `tsconfig.json`, `next.config.ts`
- Zero imports from any sibling project (verified via `grep -r "shield-web-v2"`)
- Zero absolute paths in source code
- Single env var optional in dev (`SERPAPI_KEY`); everything else falls back to
  deterministic fixtures so the app boots without secrets

You can `cp -r` the directory anywhere, run `npm install && npm run dev`,
and the whole site renders.

## Tech stack

- **Next.js 16** (App Router, Turbopack, Server Components)
- **React 19**
- **Tailwind v4** with **Utopia FYI** fluid type scale baked into globals
- **Fraunces** (Builders Corner), **Bebas Neue** (Price-Less), **Inter Tight** (body),
  **JetBrains Mono** (chrome) — all via `next/font/google`
- **SerpApi** for live comparable-price search (graceful fallback to fixtures)

## Run it

```bash
npm install
cp .env.example .env.local      # optional — see file for what's available
npm run dev                     # http://localhost:3002
```

## Auth

Staff login uses Supabase + Google OAuth. The proxy (`proxy.ts`) refreshes
the session cookie on every request and redirects unauthenticated traffic
away from `/admin/*`. Every Server Action and Route Handler that touches
inventory should additionally call `requireAuth()` from `lib/auth/`
(defense-in-depth — proxy is not a security boundary).

Sign-out is a Server Action (`signOutAction` in `lib/actions/auth.ts`)
rendered in the AdminShell top bar.

**Dev mode:** when `NEXT_PUBLIC_SUPABASE_URL` is absent, both proxy and
AdminShell skip the auth check entirely so designers can iterate on
`/admin` without secrets.

**Production:** set the two `NEXT_PUBLIC_SUPABASE_*` env vars per
`.env.example`, restrict access via Supabase RLS + an `allowed_emails`
table (recommended pattern from the parent project), and enable Google as
an auth provider in the Supabase dashboard with `…/auth/callback` in the
redirect allowlist.

## Routes (smoke-tested, all 200)

### Price-Less storefront — public
`/` `/shop` `/shop/[category]` `/shop/item/[sku]` `/tour` `/aisle-map`
`/search` `/cart` `/checkout` `/about` `/contact` `/track` `/financing`
`/contractors` `/reviews` `/compare` `/gift-cards` `/blog` `/blog/[slug]`
`/policies/returns` `/sitemap.xml` `/robots.txt`

### Builders Corner — custom cabinetry brand
`/builders-corner` `/kitchens` `/baths` `/gallery` `/process` `/finishes`
`/door-styles` `/consultation` `/showroom` `/build-your-kitchen` `/shop`
`/portfolio/[project]`

### Four Squared — install crew
`/four-squared`

### Admin — internal operations
`/admin` (dashboard) · `/admin/pos` (register) · `/admin/schedule` ·
`/admin/inventory` · `/admin/inventory/new` (photo + comparable + SKU + tag) ·
`/admin/inventory/[sku]` · `/admin/receiving` · `/admin/tags` ·
`/admin/pricing-rules` · `/admin/returns` · `/admin/customers` ·
`/admin/customers/[id]` · `/admin/suppliers` · `/admin/audit-log` ·
`/admin/sales-channels` · `/admin/reports` · `/admin/settings`

## What's real vs. what's stubbed

| Feature                       | Status                                              |
| ----------------------------- | --------------------------------------------------- |
| Photo capture                 | ✓ live (camera capture on iPad/iPhone)              |
| Comparable retail search      | ✓ live (SerpApi) with fixture fallback              |
| Code 128 barcode SVGs         | ✓ live, server-rendered, scannable                  |
| Cart + checkout               | ✓ client-side cart, server-action checkout stub     |
| Inventory tracking (margin, location, days-on-floor) | ✓ rendered from `lib/catalog.ts`     |
| AI product staging            | ▲ data shape ready, model not wired (pending research) |
| Stripe payments               | ▲ not wired — pending compliance research           |
| Wisconsin sales tax           | ▲ not wired — pending tax-stack research            |
| Auth on admin                 | ▲ open in dev; add before production                |
| Real photography              | ▲ Unsplash placeholders; replace with real shots    |

## Brand voice

- **Price-Less** — utility / warehouse / discount. Bebas display, mono chrome,
  brand red `#b91c1c`.
- **Builders Corner** — premium / custom / approachable. Fraunces serif, soft
  warm voice, navy `#1c3a5e` + gold `#b08945`.
- **Four Squared** — install crew, family-owned voice, emerald accent.

Every page sits on the Utopia FYI fluid type scale (16→18px body cap,
~85px max display) so nothing overflows.
