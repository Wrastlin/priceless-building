import { AdminShell } from "@/components/admin-shell";
import { listCatalog } from "@/lib/catalog";
import { FeaturedManager } from "./featured-manager";

export const dynamic = "force-dynamic";

/**
 * Featured manager. Featured published items are the pool the home page
 * rotates through. We keep a recommended minimum in the pool so the
 * rotation always has enough to draw from.
 */
export default async function FeaturedPage() {
  const all = await listCatalog();
  const items = all.map((i) => ({
    sku: i.sku,
    title: i.title,
    image: i.image,
    category: i.category,
    price: i.price,
    featured: i.featured === true,
  }));
  const count = items.filter((i) => i.featured).length;
  return (
    <AdminShell active="featured" title={`Featured (${count})`}>
      <FeaturedManager items={items} minimum={30} />
    </AdminShell>
  );
}
