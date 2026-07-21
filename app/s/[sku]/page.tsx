import { redirect, notFound } from "next/navigation";

/**
 * QR landing for printed floor labels (`/s/<sku>`).
 * Product pages on the public shop are deferred — labels send scanners into
 * inventory detail (auth gate). No public catalog lookup here.
 */
export default async function SkuRedirect({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const clean = sku?.trim();
  if (!clean) notFound();
  redirect(`/admin/inventory/${encodeURIComponent(clean)}`);
}
