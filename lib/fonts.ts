import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

/**
 * Site-wide type. Gotham (UI / body) + Utopia (display / headlines),
 * matched to rejuvenation.com. Licensed faces — fine for this build;
 * production should confirm licenses or swap to licensed equivalents.
 *
 * CSS variables:
 *   --font-sans     → Gotham (body, nav, UI)
 *   --font-display  → Utopia (headlines; also aliased as --font-utopia)
 *   --font-couture  → Utopia (Builders Corner display voice)
 *   --font-mono     → JetBrains Mono (admin / code)
 */

export const gotham = localFont({
  src: [
    { path: "../app/fonts/gotham/Gotham-Light.otf", weight: "300", style: "normal" },
    { path: "../app/fonts/gotham/Gotham-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../app/fonts/gotham/Gotham-Book.otf", weight: "400", style: "normal" },
    { path: "../app/fonts/gotham/Gotham-BookItalic.otf", weight: "400", style: "italic" },
    { path: "../app/fonts/gotham/Gotham-Medium.otf", weight: "500", style: "normal" },
    { path: "../app/fonts/gotham/Gotham-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../app/fonts/gotham/Gotham-Bold.otf", weight: "700", style: "normal" },
    { path: "../app/fonts/gotham/Gotham-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const utopia = localFont({
  src: [
    { path: "../app/fonts/utopia/Utopia-n4.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/utopia/Utopia-i4.woff2", weight: "400", style: "italic" },
    { path: "../app/fonts/utopia/Utopia-n6.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/utopia/Utopia-n7.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
