import Link from "next/link";
import { notFound } from "next/navigation";
import { findBySku } from "@/lib/items/store";
import { formatCurrency } from "@/lib/utils";
import {
  DEFAULT_CATEGORIES,
  categoryLabel,
  subcategoryLabel,
} from "@/lib/intake/taxonomy";
import type { CatalogItem } from "@/lib/items/types";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

function allPhotos(item: CatalogItem): string[] {
  const list = [
    ...(item.photos ?? []),
    item.image,
    ...(item.gallery ?? []),
    item.staged,
  ].filter((u): u is string => typeof u === "string" && u.length > 0);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of list) {
    if (seen.has(u)) continue;
    seen.add(u);
    out.push(u);
  }
  return out;
}

function specRows(item: CatalogItem): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  const push = (label: string, value?: string | null) => {
    const v = value?.trim();
    if (!v) return;
    rows.push({ label, value: v });
  };
  push("Manufacturer", item.manufacturer);
  push("Model", item.modelNumber);
  push("Dimensions", item.dimensions);
  push("Material", item.material);
  push("Color", item.color);
  push("Condition", item.condition);
  push("Location", item.location);
  if (item.specs) {
    for (const [k, v] of Object.entries(item.specs)) {
      if (!v?.trim()) continue;
      const label = k.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      push(label, v);
    }
  }
  // De-dupe by lowercase label / value
  const seenL = new Set<string>();
  const seenV = new Set<string>();
  return rows.filter((r) => {
    const l = r.label.toLowerCase();
    const v = r.value.toLowerCase();
    if (seenL.has(l) || seenV.has(v)) return false;
    seenL.add(l);
    seenV.add(v);
    return true;
  });
}

export default async function SellSheetPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const item = await findBySku(sku);
  if (!item) notFound();

  const cats = DEFAULT_CATEGORIES;
  const photos = allPhotos(item);
  const hero = item.staged || photos[0] || null;
  const gallery = photos.filter((p) => p !== hero).slice(0, 2);

  const price = item.price > 0 ? item.price : null;
  const compareAt =
    (item.compareAt && item.compareAt > 0 ? item.compareAt : null) ??
    (item.msrp && item.msrp > 0 ? item.msrp : null);
  const save =
    price && compareAt && compareAt > price
      ? Math.round((1 - price / compareAt) * 100)
      : 0;

  const sub = subcategoryLabel(item.category, item.subcategory, cats);
  const cat = categoryLabel(item.category, cats);
  const eyebrow = sub ? `${cat} · ${sub}` : cat;
  const specs = specRows(item);

  const tagAnchored =
    item.compareAtSource === "tag" && typeof item.listPrice === "number" && item.listPrice > 0;
  const proof = tagAnchored
    ? [{ source: "Manufacturer list price", price: item.listPrice as number }]
    : (item.comparables ?? [])
        .filter((c) => c.price >= (price ?? 0))
        .sort((a, b) => b.price - a.price)
        .slice(0, 3)
        .map((c) => ({ source: c.source, price: Math.round(c.price) }));

  return (
    <>
      <style>{`
        :root{--cream:#faf7f1;--navy:#132747;--navy2:#0f2140;--ink:#182a45;--muted:#54617a;--gold:#a97e2e;--sale:#b3261e;--line:#e4dccd;
          --serif:Georgia,"Iowan Old Style","Palatino Linotype",serif;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}
        *{box-sizing:border-box}
        body{margin:0;background:#e9e4d8;font-family:var(--sans);color:var(--ink)}
        .bar{max-width:8.5in;margin:0 auto;padding:14px 20px;display:flex;gap:12px;justify-content:flex-end;align-items:center}
        .btn{border:none;border-radius:999px;padding:10px 18px;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}
        .btn.primary{background:var(--navy);color:#fff}
        .btn.ghost{background:#fff;color:var(--ink);border:1px solid var(--line)}
        .sheet{width:8.5in;min-height:11in;margin:0 auto 30px;background:var(--cream);
          box-shadow:0 20px 60px -30px rgba(0,0,0,.5);overflow:hidden;display:flex;flex-direction:column}
        .head{display:flex;align-items:baseline;justify-content:space-between;padding:.5in .55in .28in}
        .wordmark{font-family:var(--serif);font-weight:600;font-size:19px;letter-spacing:.01em;color:var(--navy)}
        .head .sub{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);font-weight:700}
        .hero{margin:0 .55in;border-radius:12px;overflow:hidden;border:1px solid var(--line);aspect-ratio:16/10;background:#ddd}
        .hero img{width:100%;height:100%;object-fit:cover;display:block}
        .gallery{margin:.16in .55in 0;display:grid;grid-template-columns:1fr 1fr;gap:.16in}
        .gallery figure{margin:0;border-radius:10px;overflow:hidden;border:1px solid var(--line);aspect-ratio:4/3;background:#ddd}
        .gallery img{width:100%;height:100%;object-fit:cover;display:block}
        .body{padding:.32in .55in .2in;display:grid;grid-template-columns:1.35fr 1fr;gap:.5in;align-items:start}
        .eyebrow{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);font-weight:700;margin:0 0 6px}
        h1{font-family:var(--serif);font-size:30px;line-height:1.08;margin:0 0 10px;color:var(--navy);text-wrap:balance}
        .blurb{font-size:14px;line-height:1.5;color:var(--muted);margin:0 0 16px}
        .specs{list-style:none;padding:0;margin:0;border-top:1px solid var(--line)}
        .specs li{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--line);font-size:13px}
        .specs .k{color:var(--muted)}.specs .v{font-weight:600;text-align:right}
        .pricebox{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px}
        .pricebox .lab{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:700}
        .price{font-family:var(--serif);font-size:52px;line-height:1;color:var(--navy);margin:4px 0 2px;font-variant-numeric:tabular-nums}
        .cmp{font-size:15px;color:var(--muted);text-decoration:line-through;font-variant-numeric:tabular-nums}
        .save{display:inline-block;margin-top:12px;background:color-mix(in oklab,var(--sale) 12%,#fff);color:var(--sale);
          font-weight:800;font-size:14px;letter-spacing:.02em;padding:7px 13px;border-radius:999px}
        .proof{margin-top:16px}
        .proof .lab{font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:6px}
        .proof ul{list-style:none;margin:0;padding:0}
        .proof li{display:flex;justify-content:space-between;gap:8px;font-size:12px;padding:4px 0;color:var(--muted);border-top:1px solid var(--line)}
        .proof li b{color:var(--ink);font-weight:600;font-variant-numeric:tabular-nums}
        .foot{margin-top:auto;background:var(--navy2);color:#dbe2ee;display:flex;align-items:center;justify-content:space-between;
          gap:20px;padding:.3in .55in}
        .foot .qr{width:96px;height:96px;background:#fff;border-radius:8px;padding:6px;flex-shrink:0}
        .foot .qr img{width:100%;height:100%;object-fit:contain}
        .foot .info{font-size:12px;line-height:1.5}
        .foot .info b{color:#fff;font-family:var(--serif);font-size:16px;font-weight:600}
        .foot .scan{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#9fb0cc;font-weight:700}
        @media print{
          @page{size:letter;margin:0}
          body{background:#fff}
          .bar{display:none!important}
          .sheet{box-shadow:none;margin:0;width:100%;min-height:100vh}
        }
        html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
      `}</style>

      <div className="bar">
        <Link className="btn ghost" href={`/admin/inventory/${item.sku}`}>
          Back to item
        </Link>
        <PrintButton />
      </div>

      <div className="sheet">
        <div className="head">
          <span className="wordmark">Price-Less Building Center</span>
          <span className="sub">New Every Wednesday</span>
        </div>

        {hero ? (
          <div className="hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} alt="" />
          </div>
        ) : null}

        {gallery.length > 0 ? (
          <div className="gallery">
            {gallery.map((src) => (
              <figure key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
              </figure>
            ))}
          </div>
        ) : null}

        <div className="body">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{item.title}</h1>
            {item.description || item.subtitle ? (
              <p className="blurb">{item.description || item.subtitle}</p>
            ) : null}
            {specs.length > 0 ? (
              <ul className="specs">
                {specs.map((r) => (
                  <li key={r.label}>
                    <span className="k">{r.label}</span>
                    <span className="v">{r.value}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <div className="pricebox">
              <div className="lab">Our Price</div>
              <div className="price">{price !== null ? formatCurrency(price) : "Ask Staff"}</div>
              {compareAt !== null && compareAt !== price ? (
                <div className="cmp">Compare at {formatCurrency(compareAt)}</div>
              ) : null}
              {save > 0 && compareAt && price ? (
                <div className="save">
                  YOU SAVE {formatCurrency(compareAt - price)} · {save}% OFF
                </div>
              ) : null}
              {proof.length > 0 ? (
                <div className="proof">
                  <div className="lab">Comparable retail</div>
                  <ul>
                    {proof.map((c, i) => (
                      <li key={i}>
                        <span>{c.source}</span>
                        <b>{formatCurrency(c.price)}</b>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="foot">
          <div className="qr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/admin/intake/label/${encodeURIComponent(item.sku)}?type=qr`}
              alt="Scan for details"
            />
          </div>
          <div className="info">
            <b>825 Washington Street, Wausau, WI</b>
            <br />
            Family-owned since 1978 · Doors, windows, cabinets, vanities &amp; more
            <br />
            <span className="scan">Scan to see this item</span>
          </div>
          <div style={{ textAlign: "right", fontFamily: "var(--serif)", fontSize: 13, color: "#9fb0cc" }}>
            {item.sku}
          </div>
        </div>
      </div>
    </>
  );
}
