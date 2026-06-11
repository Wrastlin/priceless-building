import type { Metadata, Viewport } from "next";

/**
 * Admin-only layout. Overrides the storefront's metadata + manifest so
 * when the admin is added to an iOS home screen ("Share → Add to Home
 * Screen"), it installs as a separate PWA called "PL Admin" that opens
 * directly to /admin in standalone (full-screen) mode.
 *
 * Why a separate manifest from the storefront:
 *  - Different start_url (/admin vs /)
 *  - Different name + short_name on the home-screen badge
 *  - Different theme color appropriate for the admin chrome
 *
 * iOS Safari only honors the manifest's start_url + display when the
 * user installs from the page that links to it. Visiting /admin and
 * tapping "Add to Home Screen" picks up THIS manifest, not the
 * storefront's. The two PWAs coexist on the same domain.
 *
 * Auth: proxy.ts hard-locks /admin to authenticated Supabase users in
 * production. The installed home-screen app still goes through that
 * gate on every launch (the cookie may be present from a prior
 * Safari sign-in; if not, it redirects to /login).
 */

export const metadata: Metadata = {
  title: { default: "Admin · Price-Less", template: "%s · Admin" },
  description: "Document items, approve drafts, generate marketing. Staff only.",
  manifest: "/admin-manifest.json",
  applicationName: "PL Admin",
  appleWebApp: {
    capable: true,
    title: "PL Admin",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/admin-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/admin-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Keep admin out of the public index.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#b91c1c",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
