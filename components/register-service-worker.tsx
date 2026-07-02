"use client";

import { useEffect } from "react";

/**
 * Registers the admin service worker (scoped to /admin) so the admin
 * installs as a real PWA on Android / Chrome / Edge. Rendered only inside
 * the admin layout, so it never runs on the public storefront. iOS doesn't
 * need this (it installs from the manifest), but registering is harmless
 * there. Failures are swallowed — a missing SW must never break the admin.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/admin" }).catch(() => {
        // Non-fatal: the admin still works, it just isn't installable.
      });
    };
    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
