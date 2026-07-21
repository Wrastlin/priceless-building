import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { hasAdminSession } from "@/lib/auth/session";
import { resolveActor, actorStamp } from "@/lib/auth/actor";
import { logCaptureEvent } from "@/lib/capture/events";
import { callGemini, extractText } from "@/lib/ai/gemini";
import { findBySku, updateItem } from "@/lib/items/store";
import type { CatalogItem } from "@/lib/items/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "gemini-3.1-pro-preview";

const VALID_CATEGORIES = [
  "doors",
  "windows",
  "cabinets",
  "vanities",
  "countertops",
  "hardware",
  "lighting",
  "trim",
] as const;

interface ChatResponse {
  title?: string;
  description?: string;
  dimensions?: string;
  category?: string;
  reply: string;
}

const CHAT_PROMPT = `You are a catalog assistant for a surplus building-materials warehouse in Wausau, Wisconsin. A staff member is refining an inventory item's catalog copy.

Given the current item fields and the staffer's message, respond with STRICT JSON only, no prose, no markdown fences:

{
  "title": string,        // include ONLY if you suggest changing the title
  "description": string,  // include ONLY if you suggest changing the description
  "dimensions": string,   // include ONLY if you suggest changing dimensions
  "category": "doors" | "windows" | "cabinets" | "vanities" | "countertops" | "hardware" | "lighting" | "trim",  // include ONLY if you suggest changing category
  "reply": string         // REQUIRED — conversational reply to the staffer explaining what you did or asking a clarifying question
}

Rules:
- reply is always required and should be concise (1-3 sentences).
- Only include title/description/dimensions/category keys when you are proposing a change.
- Never change or mention our resale price — pricing is staff-controlled.
- Be factual; do not invent model numbers or manufacturers unless the staffer provided them.`;

function clean(v?: string): string | undefined {
  if (!v) return undefined;
  const trimmed = v.trim();
  return trimmed || undefined;
}

function normalizeCategory(raw?: string): string | undefined {
  if (!raw) return undefined;
  return (VALID_CATEGORIES as readonly string[]).includes(raw) ? raw : undefined;
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ sku: string }> },
) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }

  const { sku } = await ctx.params;
  const actor = await resolveActor();
  const stamp = actor
    ? actorStamp(actor)
    : {
        createdBy: "Floor",
        actorId: null as string | null,
        actorName: null as string | null,
        loginEmail: null as string | null,
        loginRole: null as "owner" | "floor" | null,
      };
  const requestId = randomUUID();

  let body: { message?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const item = await findBySku(sku);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const userEntry = { role: "user" as const, content: message, at: now };
  const thread = [...(item.aiThread ?? []), userEntry];

  const contextText = [
    "Current item:",
    `Title: ${item.title}`,
    `Description: ${item.description ?? "(none)"}`,
    `Category: ${item.category}`,
    `Dimensions: ${item.dimensions ?? "(none)"}`,
    item.captureNote ? `Capture note: ${item.captureNote}` : "",
    "",
    `Staffer message: ${message}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const result = await callGemini({
    model: MODEL,
    parts: [{ text: `${CHAT_PROMPT}\n\n${contextText}` }],
    generationConfig: { temperature: 0.3, response_mime_type: "application/json" },
  });

  if (!result.ok) {
    await logCaptureEvent({
      source: "api",
      action: "item.chat.fail",
      requestId,
      path: `/api/admin/items/${sku}/chat`,
      itemId: item.id,
      sku,
      actorId: stamp.actorId,
      actorName: stamp.actorName,
      loginEmail: stamp.loginEmail,
      loginRole: stamp.loginRole,
      error: result.error,
    });
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  const text = extractText(result.json);
  if (!text) {
    await logCaptureEvent({
      source: "api",
      action: "item.chat.fail",
      requestId,
      path: `/api/admin/items/${sku}/chat`,
      itemId: item.id,
      sku,
      actorId: stamp.actorId,
      actorName: stamp.actorName,
      loginEmail: stamp.loginEmail,
      loginRole: stamp.loginRole,
      error: "No text in Gemini response",
    });
    return NextResponse.json({ error: "No response from model" }, { status: 502 });
  }

  let parsed: ChatResponse;
  try {
    parsed = JSON.parse(text) as ChatResponse;
  } catch {
    await logCaptureEvent({
      source: "api",
      action: "item.chat.fail",
      requestId,
      path: `/api/admin/items/${sku}/chat`,
      itemId: item.id,
      sku,
      actorId: stamp.actorId,
      actorName: stamp.actorName,
      loginEmail: stamp.loginEmail,
      loginRole: stamp.loginRole,
      error: "Gemini returned non-JSON",
    });
    return NextResponse.json({ error: "Invalid model response" }, { status: 502 });
  }

  const reply = clean(parsed.reply) ?? "Done.";
  const patch: Partial<CatalogItem> = {
    aiThread: [...thread, { role: "assistant", content: reply, at: new Date().toISOString() }],
  };

  const title = clean(parsed.title);
  const description = clean(parsed.description);
  const dimensions = clean(parsed.dimensions);
  const category = normalizeCategory(parsed.category);

  if (title) patch.title = title;
  if (description) patch.description = description;
  if (dimensions) patch.dimensions = dimensions;
  if (category) patch.category = category;

  const updated = await updateItem(sku, patch);

  await logCaptureEvent({
    source: "api",
    action: "item.chat",
    requestId,
    path: `/api/admin/items/${sku}/chat`,
    itemId: item.id,
    sku,
    actorId: stamp.actorId,
    actorName: stamp.actorName,
    loginEmail: stamp.loginEmail,
    loginRole: stamp.loginRole,
    payload: {
      messageLength: message.length,
      fieldsUpdated: [title && "title", description && "description", dimensions && "dimensions", category && "category"].filter(Boolean),
    },
  });

  return NextResponse.json({
    reply,
    item: {
      title: updated.title,
      description: updated.description,
      dimensions: updated.dimensions,
      category: updated.category,
    },
  });
}
