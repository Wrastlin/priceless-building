/**
 * QR rendering via bwip-js. The QR encodes a link to the item's page, so
 * scanning it with any phone camera opens the item (photos, price, details)
 * with no dedicated scanner. The SKU is printed under the QR for humans.
 *
 * The QR content is a URL, which is permanent for the life of the item, so
 * the QR label is printed once and never reprinted when the price changes.
 */
import bwipjs from "bwip-js/node";

export async function qrPng(text: string, opts: { scale?: number } = {}): Promise<Buffer> {
  // eclevel defaults to "M" (medium) for QR, which still scans with a bit of
  // thermal-print wear, so we don't need to set it explicitly.
  return bwipjs.toBuffer({
    bcid: "qrcode",
    text,
    scale: opts.scale ?? 4,
    paddingwidth: 0,
    paddingheight: 0,
    backgroundcolor: "FFFFFF",
  });
}
