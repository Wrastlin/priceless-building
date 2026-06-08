import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { KitchenBuilder } from "./kitchen-builder";

export const metadata: Metadata = {
  title: "Build your kitchen · Builders Corner Cabinetry & Design",
  description:
    "Swap door, finish, hardware, and countertop to see what a kitchen costs. Save the spec and bring it to the showroom.",
};

export default function BuildKitchen() {
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO. Studio voice, restrained */}
      <section className="border-b border-[var(--border)] bg-[#0b1729] text-white">
        <div className="mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="border-b border-white/15 pb-7">
            <span className="font-couture text-base italic text-white/80 md:text-lg">
              Spec builder
            </span>
          </div>

          <div className="grid gap-x-12 gap-y-6 py-16 md:grid-cols-12 md:py-20">
            <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:col-span-7 md:text-6xl">
              Build a kitchen, <span className="text-[var(--brand-builders-gold)]">piece by piece.</span>
            </h1>
            <div className="md:col-span-5 md:pt-3">
              <p className="max-w-md text-base leading-[1.7] text-white/90 md:text-lg">
                Swap door, finish, hardware, countertop. Save the spec and bring it in. Final picks happen in person, with real samples.
              </p>
            </div>
          </div>
        </div>
      </section>

      <KitchenBuilder />
      <SiteFooter brand="builders" />
    </>
  );
}
