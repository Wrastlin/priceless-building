import { listAdminAll } from "@/lib/items/store";
import { DEFAULT_CATEGORIES, getCategory, getSubcategory } from "./taxonomy";

/** Mint next SKU like DR-EXT-0001 from taxonomy prefixes. */
export async function mintSku(categoryId: string, subcategoryId?: string): Promise<string> {
  const cat = getCategory(categoryId, DEFAULT_CATEGORIES);
  const sub = getSubcategory(categoryId, subcategoryId, DEFAULT_CATEGORIES);
  const prefix = `${cat?.prefix ?? "XX"}-${sub?.prefix ?? "GEN"}`;
  const all = await listAdminAll();
  let max = 0;
  const re = new RegExp(`^${prefix}-(\\d+)$`, "i");
  for (const it of all) {
    const m = re.exec(it.sku);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `${prefix}-${String(max + 1).padStart(4, "0")}`;
}
