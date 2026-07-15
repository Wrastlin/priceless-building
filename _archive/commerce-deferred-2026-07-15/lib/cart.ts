/**
 * Client-side shopping cart. Persisted to localStorage so customers can
 * add to cart, leave, and resume. We sync across tabs via the storage
 * event so reopening a tab reflects what was just added.
 */

"use client";

import { useCallback, useSyncExternalStore } from "react";

export type CartLine = { sku: string; qty: number; addedAt: number };
const KEY = "priceless-cart-v1";

const EMPTY: CartLine[] = [];
let cache: CartLine[] = EMPTY;

function load(): CartLine[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function getSnapshot(): CartLine[] {
  return cache;
}
function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

const subscribers = new Set<() => void>();
function notify() {
  subscribers.forEach((f) => f());
}

function write(lines: CartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(lines));
  cache = lines;
  notify();
  window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
}

if (typeof window !== "undefined") {
  cache = load();
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      cache = load();
      notify();
    }
  });
}

export function useCart() {
  const subscribe = useCallback((cb: () => void) => {
    subscribers.add(cb);
    return () => { subscribers.delete(cb); };
  }, []);
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((sku: string, qty = 1) => {
    const cur = [...load()];
    const existing = cur.find((l) => l.sku === sku);
    if (existing) existing.qty += qty;
    else cur.push({ sku, qty, addedAt: Date.now() });
    write(cur);
  }, []);
  const remove = useCallback((sku: string) => write(load().filter((l) => l.sku !== sku)), []);
  const setQty = useCallback((sku: string, qty: number) => {
    if (qty <= 0) return remove(sku);
    const cur = [...load()];
    const existing = cur.find((l) => l.sku === sku);
    if (existing) existing.qty = qty;
    write(cur);
  }, [remove]);
  const clear = useCallback(() => write([]), []);

  return { lines, add, remove, setQty, clear };
}

export function useCartCount() {
  const { lines } = useCart();
  return lines.reduce((s, l) => s + l.qty, 0);
}
