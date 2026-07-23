import Image from "next/image";
import type { CatalogItem } from "@/lib/items/types";
import { CategoryIcon } from "@/components/category-icon";

/**
 * Item thumbnail with a category-icon fallback when there's no real photo.
 * Shared across the admin (inventory rows/cards, dashboard queues) so a
 * missing photo always reads as a clear category glyph, never a blank box.
 */
export function ItemThumb({
  item,
  className,
  iconClass = "h-6 w-6",
}: {
  item: CatalogItem;
  className?: string;
  iconClass?: string;
}) {
  if (!item.image) {
    return (
      <div className={`flex items-center justify-center bg-[var(--muted)] text-muted-foreground ${className ?? ""}`}>
        <CategoryIcon category={item.category} className={iconClass} />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-[#f4f4f3] ${className ?? ""}`}>
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover"
        sizes="160px"
        quality={70}
        unoptimized={item.image.startsWith("data:")}
      />
    </div>
  );
}
