import Link from "next/link";
import Image from "next/image";
import { AdminShell } from "@/components/admin-shell";
import { listPublished } from "@/lib/items/store";
import { findBySku } from "@/lib/items/store";
import { MarketingCompose } from "./marketing-compose";

export const dynamic = "force-dynamic";

/**
 * Marketing generator. Two modes:
 *
 *   - No ?sku → grid of published items. Pick one to compose.
 *   - With ?sku → compose view: Facebook Marketplace, Instagram caption,
 *     floor flyer, and Craigslist body. Each block is copy-to-clipboard.
 *
 * Copy is generated deterministically from item fields by
 * `lib/marketing/templates.ts`. No AI dependency for v1; "Rewrite with
 * AI" is a planned add-on.
 */
export default async function MarketingPage({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string }>;
}) {
  const sp = await searchParams;
  const [item, items] = await Promise.all([
    sp.sku ? findBySku(sp.sku) : Promise.resolve(null),
    listPublished(),
  ]);

  if (item && item.status === "published") {
    return (
      <AdminShell
        active="marketing"
        title={`Marketing · ${item.title}`}
        crumbs={[
          { label: "Generate post", href: "/admin/marketing" },
          { label: item.sku },
        ]}
      >
        <MarketingCompose item={item} />
      </AdminShell>
    );
  }

  return (
    <AdminShell active="marketing" title="Generate post">
      <p className="admin-help mb-5 max-w-2xl">
        Pick a live item to generate ready-to-post copy for Facebook Marketplace,
        Instagram, a floor flyer, or Craigslist. Each block is copy-to-clipboard.
      </p>

      {items.length === 0 ? (
        <div className="admin-card p-6 text-sm text-muted-foreground">
          No published items yet. Approve a draft in{" "}
          <Link href="/admin/staging" className="text-[var(--brand-priceless)] hover:underline">
            staging
          </Link>{" "}
          to start posting.
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <li key={it.id}>
              <Link
                href={`/admin/marketing?sku=${it.sku}`}
                className="admin-card group block overflow-hidden transition hover:border-[var(--brand-priceless)] hover:shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full bg-[#f7f7f6]">
                  <Image
                    src={it.image}
                    alt={it.title}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                    className="object-cover"
                    quality={75}
                  />
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 text-sm font-medium text-foreground">
                    {it.title}
                  </div>
                  <div className="mt-1 flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{it.sku}</span>
                    <span className="font-semibold tabular-nums text-foreground">
                      ${it.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
