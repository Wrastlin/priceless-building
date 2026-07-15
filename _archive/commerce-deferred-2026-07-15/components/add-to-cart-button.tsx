"use client";

import { toast } from "sonner";
import { useCart } from "@/lib/cart";

export function AddToCartButton({ sku, title, className }: { sku: string; title: string; className?: string }) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={() => {
        add(sku, 1);
        toast.success(`Added · ${title}`);
      }}
      className={className ?? "btn btn-priceless"}
    >
      Add to cart
    </button>
  );
}
