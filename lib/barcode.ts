/**
 * Lightweight Code 128 (subset B) encoder. We use it on price-tag SVGs
 * so the rendered barcode is actually scannable by the floor team's
 * iPad camera. Not a full Code 128 implementation (no auto-switching
 * between A/B/C, no checksum optimisation tricks), but good enough for
 * the alphanumeric SKUs we generate.
 *
 * Reference: https://en.wikipedia.org/wiki/Code_128 (subset B = ASCII
 * 32-127). Each character has a fixed 11-module-wide pattern; we
 * concatenate, prepend Start-B (104) and append Check + Stop.
 */

const PATTERNS = [
  "11011001100", "11001101100", "11001100110", "10010011000", "10010001100",
  "10001001100", "10011001000", "10011000100", "10001100100", "11001001000",
  "11001000100", "11000100100", "10110011100", "10011011100", "10011001110",
  "10111001100", "10011101100", "10011100110", "11001110010", "11001011100",
  "11001001110", "11011100100", "11001110100", "11101101110", "11101001100",
  "11100101100", "11100100110", "11101100100", "11100110100", "11100110010",
  "11011011000", "11011000110", "11000110110", "10100011000", "10001011000",
  "10001000110", "10110001000", "10001101000", "10001100010", "11010001000",
  "11000101000", "11000100010", "10110111000", "10110001110", "10001101110",
  "10111011000", "10111000110", "10001110110", "11101110110", "11010001110",
  "11000101110", "11011101000", "11011100010", "11011101110", "11101011000",
  "11101000110", "11100010110", "11101101000", "11101100010", "11100011010",
  "11101111010", "11001000010", "11110001010", "10100110000", "10100001100",
  "10010110000", "10010000110", "10000101100", "10000100110", "10110010000",
  "10110000100", "10011010000", "10011000010", "10000110100", "10000110010",
  "11000010010", "11001010000", "11110111010", "11000010100", "10001111010",
  "10100111100", "10010111100", "10010011110", "10111100100", "10011110100",
  "10011110010", "11110100100", "11110010100", "11110010010", "11011011110",
  "11011110110", "11110110110", "10101111000", "10100011110", "10001011110",
  "10111101000", "10111100010", "11110101000", "11110100010", "10111011110",
  "10111101110", "11101011110", "11110101110", "11010000100", "11010010000",
  "11010011100", "11000111010",
];
const START_B = 104;
const STOP = 106;

export function code128(value: string): { bits: string; width: number } {
  let checksum = START_B;
  let bits = PATTERNS[START_B];
  for (let i = 0; i < value.length; i++) {
    const v = value.charCodeAt(i) - 32;
    if (v < 0 || v >= 95) continue;
    bits += PATTERNS[v];
    checksum += v * (i + 1);
  }
  bits += PATTERNS[checksum % 103];
  bits += PATTERNS[STOP];
  bits += "11";
  return { bits, width: bits.length };
}

export function code128Svg(value: string, opts?: { height?: number; moduleWidth?: number; showText?: boolean }): string {
  const { bits, width } = code128(value);
  const moduleWidth = opts?.moduleWidth ?? 2;
  const height = opts?.height ?? 60;
  const showText = opts?.showText ?? true;
  const svgWidth = width * moduleWidth;
  const textPad = showText ? 18 : 0;
  let rects = "";
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === "1") rects += `<rect x="${i * moduleWidth}" y="0" width="${moduleWidth}" height="${height}"/>`;
  }
  const text = showText
    ? `<text x="${svgWidth / 2}" y="${height + textPad - 2}" font-family="ui-monospace, monospace" font-size="14" text-anchor="middle">${value}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${height + textPad}" width="${svgWidth}" height="${height + textPad}" fill="#000">${rects}${text}</svg>`;
}
