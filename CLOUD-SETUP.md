# Cloud / mobile dev — full backend access in 3 steps

Bring up this app in a fresh cloud box (or a mobile cloud session) with the
**real Supabase backend**, **owner admin**, and the **AI intake pipeline** —
no interactive Google sign-in required.

`.env.local` is gitignored, so a fresh clone starts with **zero** secrets.
That's the whole job: give the box the right env, then verify.

## 1. Create `.env.local`

```bash
cp .env.cloud.example .env.local
```

Fill in the values from the store Mac's `.env.local` (or your secret store).
The required set is small:

| Var | Why | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | points at the real project (reads/writes/auth) | public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | anon key, other half of the gate | public |
| `SUPABASE_SERVICE_ROLE_KEY` | server writes + locked staff/cost tables, **no login** | **secret** |
| `GEMINI_API_KEY` | the entire AI intake pipeline | **secret** |
| `DEV_ADMIN_BYPASS=1` | owner role with no OAuth (dev-only, can't unlock prod) | flag |
| `SERPAPI_KEY` | live comparable prices (else door-price fixtures) | secret, recommended |

Everything else is optional (see `.env.cloud.example`). Label printing and
the on-disk ad-kit library stay Mac-only and are simply absent in the cloud.

## 2. Verify

```bash
npm install
npm run check-env
```

This confirms every required var is set **and live-pings the backend** (reads
the `items` table with the service-role key) and the Gemini key. It exits
non-zero and tells you exactly what's missing if the box isn't ready — so a
misconfigured environment fails loudly instead of silently serving stub data.

## 3. Run

```bash
npm run cloud     # next dev on :3002 (NODE_ENV=development → owner bypass active)
```

Open `/admin` → you're an owner against the real 62-SKU catalog.

---

### Why `next dev`, not a prod build
`DEV_ADMIN_BYPASS` is hard-gated to `NODE_ENV !== "production"` in code, so it
can never open a live deploy. In a cloud **dev** box it grants owner instantly.
If you ever must run a production build instead, you'd need `ALLOWED_EMAILS` +
`PUBLIC_ADMIN_ENABLED=1` + a real Google session — avoid that for dev work.

### What stays on the Mac (not needed in cloud)
- `PRINTER_QUEUE` / `LABEL_ROLL` / `APP_BASE_URL` — USB Brother QL-800 labels.
  On-screen labels still render; only physical printing is unavailable.
- `MARKETING_DELIVERABLES_DIR` — the `PRICE-LESS DELIVERABLES/` ad-kit library
  lives on the Mac. The item page's marketing panel shows "not mounted here"
  in the cloud until that library is synced to storage (a planned follow-on).

### Security
`.env.local`, `.env.cloud`, and any real-value env file stay gitignored. Never
commit secret values. `check-env` prints only whether a name is set (plus the
public Supabase host) — never the values themselves.
