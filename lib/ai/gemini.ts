/**
 * Shared Gemini client for the admin AI routes.
 *
 * Centralizes what used to be copy-pasted across analyze-and-price,
 * classify-item, clean-background, and marketing-variants:
 *   - API key sent via the `x-goog-api-key` HEADER, not the `?key=` query
 *     string (the query string leaks into access/proxy/error logs).
 *   - A hard request timeout (AbortSignal.timeout) so a hung upstream
 *     socket can't bill the full serverless wall-clock.
 *   - One bounded retry on 429 / 5xx with a short backoff.
 *   - Uniform error mapping (typed result, never throws on a bad status).
 *   - Data-URL parsing + per-image size capping (cost + memory guard).
 *   - Inline-image extraction handling snake_case OR camelCase responses.
 *
 * Model strings are passed in by the caller. The text routes use
 * `gemini-3.1-pro-preview` (per the CLAUDE.md global rule); the image
 * routes use `gemini-3.1-flash-image-preview` (the only 3.1 image model;
 * the pro model cannot generate images).
 */

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_TIMEOUT_MS = 45_000;

/** Max decoded bytes for a single inbound image. */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
/** Max images accepted per request. */
export const MAX_IMAGES = 6;

export function geminiKey(): string | undefined {
  return process.env.GEMINI_API_KEY?.trim() || undefined;
}

export interface ParsedImage {
  mimeType: string;
  /** base64 payload with the `data:...;base64,` prefix stripped. */
  data: string;
}

const DATA_URL_RE = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/;

export function parseDataUrl(s: unknown): ParsedImage | null {
  if (typeof s !== "string") return null;
  const m = DATA_URL_RE.exec(s);
  if (!m) return null;
  return { mimeType: m[1], data: m[2] };
}

/** Approximate decoded byte length of a base64 string. */
export function base64Bytes(b64: string): number {
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - padding;
}

export function imageTooLarge(img: ParsedImage): boolean {
  return base64Bytes(img.data) > MAX_IMAGE_BYTES;
}

type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

export interface GeminiJson {
  candidates?: { content?: { parts?: unknown[] } }[];
}

export interface GeminiCallInput {
  model: string;
  parts: GeminiPart[];
  generationConfig?: Record<string, unknown>;
  timeoutMs?: number;
}

export type GeminiResult =
  | { ok: true; json: GeminiJson }
  | { ok: false; status: number; error: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function callGemini(input: GeminiCallInput): Promise<GeminiResult> {
  const apiKey = geminiKey();
  if (!apiKey) return { ok: false, status: 0, error: "GEMINI_API_KEY not configured" };

  const endpoint = `${BASE}/${input.model}:generateContent`;
  const payload = JSON.stringify({
    contents: [{ parts: input.parts }],
    ...(input.generationConfig ? { generationConfig: input.generationConfig } : {}),
  });
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  let lastError = "request failed";
  let lastStatus = 0;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: payload,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok) {
        return { ok: true, json: (await res.json()) as GeminiJson };
      }
      lastStatus = res.status;
      const txt = await res.text().catch(() => "");
      lastError = `Gemini ${res.status}: ${txt.slice(0, 200)}`;
      // Retry once on rate-limit / transient upstream errors only.
      if ((res.status === 429 || res.status >= 500) && attempt === 0) {
        await sleep(500);
        continue;
      }
      return { ok: false, status: res.status, error: lastError };
    } catch (err) {
      // Timeout / network error.
      lastError = err instanceof Error ? err.message : "request failed";
      lastStatus = 504;
      if (attempt === 0) {
        await sleep(500);
        continue;
      }
    }
  }
  return { ok: false, status: lastStatus || 502, error: lastError };
}

/** Pull the first non-empty ANSWER text part out of a Gemini response.
 *  Thinking models (gemini-3.1-pro) may emit reasoning parts flagged
 *  `thought: true` before the answer — those must be skipped or callers
 *  parse the reasoning instead of the JSON they asked for. */
export function extractText(json: GeminiJson): string | null {
  const parts = (json.candidates?.[0]?.content?.parts ?? []) as {
    text?: string;
    thought?: boolean;
  }[];
  for (const p of parts) {
    if (p.thought === true) continue;
    if (typeof p.text === "string" && p.text.trim()) return p.text;
  }
  return null;
}

/** Pull the first inline image out of a Gemini response as a data URL. */
export function extractInlineImage(json: GeminiJson): string | null {
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const blob = (part as {
      inline_data?: { mime_type?: string; mimeType?: string; data?: string };
      inlineData?: { mime_type?: string; mimeType?: string; data?: string };
    });
    const inline = blob.inline_data ?? blob.inlineData;
    const data = inline?.data;
    const mime = inline?.mime_type ?? inline?.mimeType;
    if (data && mime) return `data:${mime};base64,${data}`;
  }
  return null;
}
