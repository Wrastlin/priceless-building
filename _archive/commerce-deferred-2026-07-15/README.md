# Deferred: customer accounts + digital commerce

Archived 2026-07-15. Price-Less is inventorying and promoting real floor stock
online, but is **not** selling digitally yet — no customer accounts, cart,
checkout, gift cards, or order tracking on the live storefront.

## What's here
- `app/cart`, `app/checkout`, `app/account` — former storefront routes
- `app/gift-cards`, `app/track` — digital gift cards + mock order tracker
- `components/cart-button`, `account-button`, `add-to-cart-button`
- `lib/cart.ts` — client cart (localStorage)

## When to restore
When Stripe (or equivalent) and customer auth are ready for online holds/orders:
1. Move these folders/files back to their original paths
2. Re-wire SiteHeader / MainMenu / SiteFooter / PDP CTAs / mobile tab bar
3. Set `NEXT_PUBLIC_CATALOG_LIVE=1` once tagged inventory is published

Admin inventory capture, barcodes, staging, and AI promotional scenes stay live
under `/admin` — only customer-facing digital commerce was deferred.
