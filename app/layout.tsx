import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { SmoothScroll } from "@/components/smooth-scroll";
import { AuthErrorNotice } from "@/components/auth-error-notice";
import { gotham, utopia, mono } from "@/lib/fonts";
import "./globals.css";

const SITE_URL = "https://pricelessbuilding.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Price-Less Building Center · Discount materials, custom cabinetry, and remodels in Wausau, WI",
    template: "%s · Price-Less Building",
  },
  description:
    "Discount and surplus building materials, premium custom cabinetry, and a professional install crew under one roof in Wausau, WI. Doors, windows, cabinets, vanities, hardware. Full kitchen remodels, bath remodels, and home renovations across central Wisconsin.",
  keywords: [
    "discount building materials Wausau",
    "surplus building materials Wisconsin",
    "custom cabinetry Wausau",
    "kitchen remodel Wausau",
    "bath remodel Wausau",
    "home renovation Wausau",
    "remodeling contractor Marathon County",
    "interior design Wausau",
    "Builders Corner",
    "4 Squared",
    "Price-Less Building Center",
  ],
  applicationName: "Price-Less Building",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Price-Less",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Price-Less Building Center",
    locale: "en_US",
    url: SITE_URL,
    title:
      "Price-Less Building Center · Discount materials, custom cabinetry, and remodels in Wausau, WI",
    description:
      "Three local brands under one roof. Discount surplus materials, premium custom cabinetry, and a professional install crew. Get the materials and have them installed for a fraction of regional chain cost.",
    images: [
      {
        url: "/og-mural.jpg",
        width: 1200,
        height: 512,
        alt: "Build Your Future community mural on the side of Price-Less Building Center in Wausau, Wisconsin.",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og-mural.jpg"] },
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1818" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // --font-utopia / --font-couture alias Utopia so redesign preview +
  // Builders Corner .font-couture keep working without a second face.
  return (
    <html
      lang="en"
      className={`${gotham.variable} ${utopia.variable} ${mono.variable}`}
      style={
        {
          ["--font-utopia" as string]: "var(--font-display)",
          ["--font-couture" as string]: "var(--font-display)",
          ["--font-gotham" as string]: "var(--font-sans)",
        } as React.CSSProperties
      }
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual';}",
          }}
        />
        <link
          rel="preload"
          as="image"
          href="/real-photos/business/dark-base-cabinets-warehouse-row.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="font-sans font-light">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow"
        >
          Skip to main content
        </a>
        <SmoothScroll />
        <main id="main">{children}</main>
        <AuthErrorNotice />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
