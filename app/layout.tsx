import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter_Tight, Playfair_Display, JetBrains_Mono, Fraunces } from "next/font/google";
import { Toaster } from "sonner";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const display = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", style: ["normal", "italic"] });
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
// Fraunces. Builders Corner's primary display + emphasis face.
// Picked over Cormorant because Cormorant Light reads "thin elegance"
// (fragrance house) when we actually want "premium but warm"
// (designer kitchen studio). Fraunces ships an opsz axis so display
// sizes feel sculpted and body sizes feel friendly without swapping
// families.
const couture = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-couture",
  axes: ["opsz", "SOFT"],
});

const SITE_URL = "https://pricelessbuilding.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Price-Less Building Center · Wausau, WI",
    template: "%s · Price-Less Building",
  },
  description:
    "The Home Improvement Warehouse. Discount and surplus building materials in central Wisconsin. Doors, windows, cabinets, vanities and more.",
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
    title: "Price-Less Building Center · Wausau, WI",
    description:
      "Discount and surplus building materials in central Wisconsin. Doors, windows, cabinets, vanities and more — half off retail.",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable} ${couture.variable}`}>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--brand-priceless)] focus:shadow">Skip to main content</a>
        <SmoothScroll />
        <main id="main">{children}</main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
