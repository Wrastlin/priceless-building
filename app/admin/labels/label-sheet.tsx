"use client";

/**
 * DK-1201 label layout + print CSS.
 *
 * Each label is exactly 90mm × 29mm (Brother DK-1201 die-cut). In the print
 * dialog choose the QL printer with DK-1201 media, margins none; every label
 * becomes its own page and the QL's auto-cutter separates them. On screen the
 * same labels render as a preview grid.
 */

export interface UnitLabel {
  sku: string;
  unit?: number;
  title: string;
  dimensions?: string;
  price: number;
}

export function LabelSheet({ labels }: { labels: UnitLabel[] }) {
  if (labels.length === 0) {
    return (
      <div className="admin-card p-8 text-center text-sm text-muted-foreground">
        No items selected. Open with ?skus=PL-000001,PL-000002 or capture items first.
      </div>
    );
  }
  return (
    <div>
      <div className="mb-4 flex items-center gap-3 print:hidden">
        <button type="button" onClick={() => window.print()} className="admin-btn admin-btn-primary">
          🖨 Print {labels.length} sticker{labels.length === 1 ? "" : "s"}
        </button>
        <span className="text-xs text-muted-foreground">
          Printer: Brother QL-800 · Media: DK-1201 (1.1&quot; × 3.5&quot;) · Margins: none
        </span>
      </div>

      <style>{`
        .dk-label {
          width: 90mm;
          height: 29mm;
          overflow: hidden;
          display: grid;
          grid-template-columns: 24mm 1fr;
          align-items: center;
          gap: 2mm;
          padding: 1.5mm 3mm;
          box-sizing: border-box;
          background: #fff;
          color: #000;
        }
        @media print {
          @page { size: 90mm 29mm; margin: 0; }
          body { background: #fff !important; }
          .dk-label { page-break-after: always; border: none !important; }
        }
      `}</style>

      <div className="flex flex-wrap gap-3 print:block print:gap-0">
        {labels.map((l, i) => (
          <div key={`${l.sku}-${l.unit ?? i}`} className="dk-label rounded border border-border print:rounded-none">
            <div className="flex h-full flex-col items-center justify-center leading-none">
              {l.unit !== undefined ? (
                <div style={{ fontSize: "9mm", fontWeight: 800 }}>#{l.unit}</div>
              ) : null}
              <div style={{ fontSize: l.unit !== undefined ? "4.5mm" : "7mm", fontWeight: 700, marginTop: "1mm" }}>
                {l.price > 0 ? `$${l.price}` : " "}
              </div>
            </div>
            <div className="flex h-full min-w-0 flex-col justify-between py-[1mm]">
              <div
                style={{ fontSize: "3.2mm", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {l.title}
                {l.dimensions && !l.title.includes(l.dimensions) ? ` · ${l.dimensions}` : ""}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/barcode/${l.sku}.svg`}
                alt={`Barcode ${l.sku}`}
                style={{ height: "13mm", width: "100%", objectFit: "contain", objectPosition: "left" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
