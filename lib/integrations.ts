/**
 * Connections catalogue — the single source of truth for the guided
 * /admin/connections form. Each integration says exactly WHERE to go to
 * get credentials, WHAT to paste back, and (where relevant) what URL to
 * paste INTO the platform. Sandbox/test-first: nothing here moves real
 * money or publishes to a live profile until you turn it on.
 *
 * To wire a new connection, add an entry here — the form renders from
 * this config, and the app reads the resulting env vars.
 */
export const SITE_ORIGIN = "https://pricelessbuilding.com";

export type Field = {
  /** Env var the value maps to (shown to the user + used by the app). */
  env: string;
  label: string;
  placeholder?: string;
  /** Secret value — masked in the UI. */
  secret?: boolean;
  /** Short format hint, e.g. "starts with pk_test_". */
  hint?: string;
};

/** A value WE provide that the user pastes INTO the external platform. */
export type ProvideValue = { label: string; value: string; note?: string };

export type Status = "recommended" | "optional" | "connected" | "manual" | "skip";

export type Integration = {
  key: string;
  name: string;
  blurb: string;
  status: Status;
  /** Where to go to get the credentials. */
  dashboardUrl?: string;
  dashboardLabel?: string;
  /** Numbered setup steps. */
  steps?: string[];
  /** URLs/values to paste into the platform during setup. */
  provide?: ProvideValue[];
  /** Credentials to paste back here. */
  fields?: Field[];
  /** One-line sandbox reassurance. */
  sandboxNote?: string;
};

export type IntegrationGroup = { id: string; title: string; blurb: string; items: Integration[] };

export const INTEGRATION_GROUPS: IntegrationGroup[] = [
  {
    id: "payments",
    title: "Take payment on the site",
    blurb: "Let the storefront charge cards. Use TEST keys first — no real money moves.",
    items: [
      {
        key: "stripe",
        name: "Stripe",
        status: "recommended",
        blurb: "Card payments + the “Card · Stripe” option already in checkout. Start in Test mode.",
        dashboardUrl: "https://dashboard.stripe.com/test/apikeys",
        dashboardLabel: "Stripe test API keys",
        sandboxNote: "Use TEST keys (pk_test_ / sk_test_). No real charges happen.",
        steps: [
          "Create a free Stripe account and keep the “Test mode” toggle ON (top-right).",
          "Developers → API keys: copy the Publishable key and Secret key into the fields below.",
          "Developers → Webhooks → Add endpoint: paste the webhook URL below into Stripe.",
          "Copy the resulting “Signing secret” back into the field below.",
        ],
        provide: [
          { label: "Webhook endpoint URL — paste into Stripe → Webhooks", value: `${SITE_ORIGIN}/api/webhooks/stripe` },
        ],
        fields: [
          { env: "STRIPE_PUBLISHABLE_KEY", label: "Publishable key", hint: "pk_test_…" },
          { env: "STRIPE_SECRET_KEY", label: "Secret key", secret: true, hint: "sk_test_…" },
          { env: "STRIPE_WEBHOOK_SECRET", label: "Webhook signing secret", secret: true, hint: "whsec_…" },
        ],
      },
    ],
  },
  {
    id: "channels",
    title: "Sell on other sales channels",
    blurb: "List the catalog where buyers already are. Facebook + eBay are the highest-ROI for a Wausau surplus warehouse.",
    items: [
      {
        key: "meta",
        name: "Facebook + Instagram Shop",
        status: "recommended",
        blurb: "Free local-pickup is native. Highest-ROI channel — start here. Syncs via a product feed.",
        dashboardUrl: "https://business.facebook.com/commerce",
        dashboardLabel: "Meta Commerce Manager",
        sandboxNote: "Nothing shows on your live Page until you switch the feed on inside Commerce Manager.",
        steps: [
          "In Meta Business Suite, create a Commerce account + a Catalog for the store.",
          "Catalog → Data sources → add a scheduled feed pointing at the feed URL below.",
          "(API posting, optional) Create a Meta app + System User token, then paste the Catalog ID, App ID and token below.",
        ],
        provide: [
          { label: "Product feed URL — add in Commerce Manager → Data sources", value: `${SITE_ORIGIN}/api/feeds/meta.xml`, note: "Generated from your published catalog." },
        ],
        fields: [
          { env: "META_CATALOG_ID", label: "Catalog ID" },
          { env: "META_APP_ID", label: "App ID" },
          { env: "META_ACCESS_TOKEN", label: "System User access token", secret: true },
        ],
      },
      {
        key: "ebay",
        name: "eBay Store",
        status: "recommended",
        blurb: "Best for shippable items — hardware, lighting, smaller trim. Use the Sandbox keyset first.",
        dashboardUrl: "https://developer.ebay.com/my/keys",
        dashboardLabel: "eBay developer keys",
        sandboxNote: "Use the Sandbox keyset — sandbox listings are not public.",
        steps: [
          "Create an eBay developer account, then create a Sandbox keyset.",
          "Paste the App ID (Client ID), Cert ID (Client Secret), and Dev ID below.",
          "Under “User tokens (OAuth)”, set the redirect/accept URL to the URL below.",
        ],
        provide: [
          { label: "OAuth redirect URL — set as your RuName accept URL", value: `${SITE_ORIGIN}/api/ebay/callback` },
        ],
        fields: [
          { env: "EBAY_APP_ID", label: "App ID (Client ID)" },
          { env: "EBAY_CERT_ID", label: "Cert ID (Client Secret)", secret: true },
          { env: "EBAY_DEV_ID", label: "Dev ID" },
        ],
      },
      {
        key: "google-merchant",
        name: "Google Shopping",
        status: "optional",
        blurb: "Free product listings across Google. Syncs via the same kind of product feed.",
        dashboardUrl: "https://merchants.google.com",
        dashboardLabel: "Google Merchant Center",
        steps: [
          "Create a Merchant Center account and verify pricelessbuilding.com as your website.",
          "Products → Feeds → add a feed pointing at the feed URL below.",
          "Paste your Merchant ID below.",
        ],
        provide: [
          { label: "Product feed URL — add in Merchant Center → Feeds", value: `${SITE_ORIGIN}/api/feeds/google.xml` },
        ],
        fields: [{ env: "GOOGLE_MERCHANT_ID", label: "Merchant ID" }],
      },
      {
        key: "offerup-craigslist",
        name: "OfferUp + Craigslist",
        status: "manual",
        blurb: "No API to connect — list manually for bulk one-offs and dead stock, or pair with a cross-lister like Vendoo. Nothing to enter here.",
      },
    ],
  },
  {
    id: "leads",
    title: "Leads & email",
    blurb: "Make the estimate / inquiry forms actually deliver to your inbox.",
    items: [
      {
        key: "resend",
        name: "Resend (inquiry email)",
        status: "recommended",
        blurb: "The estimate forms on Four Squared / Builders Corner email leads through Resend. Without it they log silently in production.",
        dashboardUrl: "https://resend.com/api-keys",
        dashboardLabel: "Resend API keys",
        sandboxNote: "Use onboarding@resend.dev as the From address for testing before you verify a domain.",
        steps: [
          "Sign up at resend.com (free tier covers this volume).",
          "Verify your sending domain, or use onboarding@resend.dev for testing.",
          "Create an API key, then paste it + the from/to addresses below.",
        ],
        fields: [
          { env: "RESEND_API_KEY", label: "API key", secret: true, hint: "re_…" },
          { env: "INQUIRY_FROM_EMAIL", label: "From address", placeholder: "Price-Less Building <inquiries@yourdomain.com>" },
          { env: "INQUIRY_TO_EMAIL", label: "Send leads to", placeholder: "pricelessbuildingcenter@gmail.com" },
        ],
      },
    ],
  },
  {
    id: "data",
    title: "Data & AI (supporting)",
    blurb: "Optional. The catalog + staff login already run on Supabase; the rest are nice-to-haves.",
    items: [
      {
        key: "supabase",
        name: "Supabase (catalog + staff login)",
        status: "connected",
        blurb: "Already connected — the live catalog and admin sign-in run on it.",
        dashboardUrl: "https://supabase.com/dashboard",
        dashboardLabel: "Supabase dashboard",
        fields: [
          { env: "NEXT_PUBLIC_SUPABASE_URL", label: "Project URL" },
          { env: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", label: "Publishable (anon) key", secret: true },
        ],
      },
      {
        key: "serpapi",
        name: "SerpApi (comparable pricing)",
        status: "optional",
        blurb: "Powers the “comparable retail price” lookup in Add Item. Falls back to a fixture without it.",
        dashboardUrl: "https://serpapi.com/manage-api-key",
        dashboardLabel: "SerpApi key",
        fields: [{ env: "SERPAPI_KEY", label: "API key", secret: true }],
      },
      {
        key: "google-places",
        name: "Google Places (live reviews)",
        status: "optional",
        blurb: "Pulls fresh Google reviews into the reviews section. Uses the curated set without it.",
        dashboardUrl: "https://console.cloud.google.com/apis/library/places-backend.googleapis.com",
        dashboardLabel: "Google Cloud · Places API",
        fields: [
          { env: "GOOGLE_PLACES_API_KEY", label: "API key", secret: true },
          { env: "GOOGLE_PLACES_ID", label: "Place ID", hint: "ChIJ…" },
        ],
      },
      {
        key: "gemini",
        name: "Gemini (AI photo staging)",
        status: "optional",
        blurb: "Used by the marketing / AI staging tools.",
        dashboardUrl: "https://aistudio.google.com/app/apikey",
        dashboardLabel: "Google AI Studio key",
        fields: [{ env: "GEMINI_API_KEY", label: "API key", secret: true }],
      },
    ],
  },
];

/** Every field across every integration (for the .env export). */
export function allFields(): Field[] {
  return INTEGRATION_GROUPS.flatMap((g) => g.items.flatMap((i) => i.fields ?? []));
}
