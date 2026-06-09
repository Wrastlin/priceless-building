import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { GiftCardForm } from "./gift-card-form";

const HERO = "/real-photos/mural-detail.webp";

export default function GiftCardsPage() {
  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="relative h-72 overflow-hidden border-b">
        <Image src={HERO} alt="Reclaimed door close-up" fill priority className="object-cover" quality={75} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end gap-2 px-6 pb-8 text-white">
          <div className="text-xs uppercase tracking-wider text-white/80">Gift cards</div>
          <h1 className="font-display text-4xl md:text-5xl">For the friend who's always renovating.</h1>
          <p className="max-w-xl text-sm text-white/85">Good at Price-Less Building and Builders Corner. Never expires. Spend in-store or online.</p>
          <div className="mt-3 flex items-center gap-5 rounded-md bg-white/90 px-4 py-2 backdrop-blur w-fit">
            <BrandLogo brand="priceless" size="sm" />
            <span className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--muted-foreground)]">+</span>
            <BrandLogo brand="builders" size="sm" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-display text-2xl">Pick an amount</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Digital card emailed instantly, or printed and mailed (free within Wisconsin).</p>
          <GiftCardForm />
        </div>
        <aside className="rounded-2xl border bg-white p-6 shadow-card">
          <div className="rounded-xl border-2 border-dashed border-[var(--brand-priceless)] bg-gradient-to-br from-white to-red-50 p-6">
            <div className="flex items-center justify-between">
              <BrandLogo brand="priceless" size="sm" />
              <span className="text-xs font-mono">GC-•••• 4429</span>
            </div>
            <div className="mt-6 font-display text-4xl">$ 100.00</div>
            <div className="mt-4 text-xs text-[var(--muted-foreground)]">For Aunt Diane, happy renovating! ❤️</div>
            <div className="mt-6 border-t pt-4 text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)]">No expiration · Redeem in store or at checkout</div>
          </div>
        </aside>
      </section>
      <SiteFooter brand="priceless" />
    </>
  );
}
