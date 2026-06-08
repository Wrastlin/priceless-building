import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "AI image test · Admin" };
export const dynamic = "force-dynamic";

const PROMPTS: Record<string, { ratio: string; prompt: string }> = {
  "01-interior-door-shaker": {
    ratio: "4:3",
    prompt:
      "White 5-panel shaker interior door on warehouse floor, 50mm f/4, daylight bay door, blurred steel racking.",
  },
  "02-exterior-door-black-steel": {
    ratio: "4:3",
    prompt:
      "Matte-black steel exterior door with chrome deadbolt, warehouse, 50mm f/4.5, cool fluorescent + daylight.",
  },
  "03-base-cabinet-white-shaker": {
    ratio: "1:1",
    prompt:
      "White shaker base cabinet, brushed-nickel cup pulls, 85mm f/5.6, softbox key + fill.",
  },
  "04-pantry-cabinet-walnut": {
    ratio: "3:4",
    prompt:
      "Walnut shaker pantry cabinet, hand-rubbed finish, satin-brass bar pulls, 50mm f/4 slight low angle.",
  },
  "05-vanity-single-marble-top": {
    ratio: "4:3",
    prompt:
      "Navy shaker 36-inch vanity, honed Carrara top, brushed-brass widespread, 85mm f/4.5 warm key light.",
  },
  "06-double-hung-window": {
    ratio: "3:4",
    prompt:
      "Double-hung white vinyl window leaning on concrete wall, 50mm f/4, fluorescent + daylight.",
  },
  "07-cabinet-hardware-brushed-brass": {
    ratio: "1:1",
    prompt:
      "Brushed-brass bar pulls + knobs in grid on linen, 100mm macro f/8, overhead softbox.",
  },
  "08-painted-trim-stack": {
    ratio: "16:9",
    prompt:
      "Stack of primed white MDF trim on a pallet, 35mm f/5.6, fluorescent + bay-door daylight.",
  },
  "09-faucet-matte-black": {
    ratio: "4:3",
    prompt:
      "Matte-black pull-down faucet on butcher-block walnut counter, 85mm f/4, soft warm window light.",
  },
  "10-flush-mount-light": {
    ratio: "1:1",
    prompt:
      "Matte-black 12-inch flush-mount ceiling light, frosted diffuser, 50mm f/5.6, studio softbox.",
  },
};

async function listImages() {
  const dir = path.join(process.cwd(), "public", "test-images");
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort()
      .map((f) => ({
        file: f,
        slug: f.replace(/\.[a-z]+$/i, ""),
      }));
  } catch {
    return [];
  }
}

export default async function TestImagesPage() {
  const images = await listImages();
  return (
    <AdminShell active="add" title="AI photography test">
      <p className="admin-help mb-5 max-w-3xl">
        Model: <span className="font-mono text-foreground">gemini-3-pro-image-preview</span> (Nano Banana Pro).
        Each prompt names the subject, material, lens, and light source in one paragraph. Files live in{" "}
        <span className="font-mono text-foreground">public/test-images/</span>. Regenerate with{" "}
        <span className="font-mono text-foreground">python3 scripts/gen-test-images.py</span>.{" "}
        <span className="text-foreground">{images.length} / 10 generated.</span>
      </p>

      {images.length === 0 ? (
        <div className="admin-card border-dashed bg-[#fafaf9] p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No images yet. Run{" "}
            <span className="font-mono text-foreground">
              GEMINI_API_KEY=… python3 scripts/gen-test-images.py
            </span>{" "}
            from the project root.
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map(({ file, slug }) => {
            const meta = PROMPTS[slug];
            return (
              <li key={slug} className="admin-card overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f4f4f3]">
                  <Image
                    src={`/test-images/${file}`}
                    alt={slug}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="border-t border-border p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-mono text-xs text-foreground">{slug}</div>
                    <div className="text-xs text-muted-foreground">{meta?.ratio ?? ""}</div>
                  </div>
                  {meta ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{meta.prompt}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}
