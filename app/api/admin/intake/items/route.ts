import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { hasAdminSession } from "@/lib/auth/session";
import { resolveActor, actorStamp } from "@/lib/auth/actor";
import { logCaptureEvent } from "@/lib/capture/events";
import { createDraft } from "@/lib/items/store";
import { storeItemPhotos, photoStorageConfigured } from "@/lib/items/photos";
import { mintSku } from "@/lib/intake/sku";
import { renderQrLabel } from "@/lib/intake/labels";
import { printLabel } from "@/lib/intake/printer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }

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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    await logCaptureEvent({
      source: "api",
      action: "intake.save_rejected",
      requestId,
      path: "/api/admin/intake/items",
      actorId: stamp.actorId,
      actorName: stamp.actorName,
      loginEmail: stamp.loginEmail,
      loginRole: stamp.loginRole,
      error: "title required",
    });
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  // Soft nudge: if no Who-is-working selected on employee login, still save
  // but log it so we can see unattributed volume.
  if (stamp.loginRole === "floor" && !stamp.actorId) {
    await logCaptureEvent({
      source: "api",
      action: "intake.missing_actor",
      requestId,
      path: "/api/admin/intake/items",
      loginEmail: stamp.loginEmail,
      loginRole: stamp.loginRole,
    });
  }

  const category = typeof body.category === "string" ? body.category : "other";
  const subcategory = typeof body.subcategory === "string" ? body.subcategory : undefined;
  const price = Number(body.price) || 0;
  const compareAt = body.compareAt != null ? Number(body.compareAt) : undefined;
  const quantity = Math.max(1, Number(body.quantity) || 1);
  const photosIn = Array.isArray(body.photos)
    ? body.photos.filter((p): p is string => typeof p === "string")
    : [];
  const doPrint = body.print === true;

  const sku = await mintSku(category, subcategory);
  const id = randomUUID();

  let photoUrls: string[] = [];
  if (photosIn.length && photoStorageConfigured()) {
    try {
      photoUrls = await storeItemPhotos(sku.toLowerCase(), photosIn);
    } catch {
      photoUrls = photosIn.slice(0, 1);
    }
  } else if (photosIn.length) {
    photoUrls = photosIn.slice(0, 1);
  }

  const now = new Date().toISOString();
  const comparablesIn = Array.isArray(body.comparables)
    ? body.comparables
        .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
        .map((c) => ({
          source: String(c.source ?? "Retail"),
          title: String(c.title ?? ""),
          price: Number(c.price) || 0,
          url: String(c.url ?? ""),
          image: typeof c.image === "string" ? c.image : undefined,
          capturedAt: now,
        }))
        .filter((c) => c.price > 0)
    : [];

  const cover = photoUrls[0] ?? "";
  const top = comparablesIn[0];
  const item = await createDraft({
    id,
    sku,
    brand: "priceless",
    category,
    subcategory,
    title,
    subtitle: [body.manufacturer, body.dimensions].filter(Boolean).join(" · "),
    price,
    compareAt: Number.isFinite(compareAt) ? compareAt : undefined,
    compareAtSource: Number.isFinite(compareAt) ? "market" : undefined,
    msrp: Number.isFinite(compareAt) ? compareAt : undefined,
    image: cover,
    gallery: photoUrls.slice(1),
    photos: photoUrls,
    inStock: quantity,
    manufacturer: typeof body.manufacturer === "string" ? body.manufacturer : undefined,
    dimensions: typeof body.dimensions === "string" ? body.dimensions : undefined,
    captureNote: typeof body.note === "string" ? body.note : undefined,
    inventoriedAt: now,
    createdBy: stamp.createdBy,
    comparables: comparablesIn.length ? comparablesIn : undefined,
    comparable: top
      ? { retailer: top.source, price: top.price, url: top.url || undefined }
      : undefined,
    fulfillment: { pickup: true, localDelivery: true, ships: false },
  });

  await logCaptureEvent({
    source: "api",
    action: "intake.save",
    requestId,
    path: "/api/admin/intake/items",
    itemId: item.id,
    sku: item.sku,
    actorId: stamp.actorId,
    actorName: stamp.actorName,
    loginEmail: stamp.loginEmail,
    loginRole: stamp.loginRole,
    payload: {
      title,
      category,
      photoCount: photoUrls.length,
      quantity,
      print: doPrint,
      hasNote: typeof body.note === "string" && body.note.trim().length > 0,
      hasDimensions: typeof body.dimensions === "string" && body.dimensions.trim().length > 0,
    },
  });

  let printResult: { ok: boolean; message: string; jobId?: string } | undefined;
  if (doPrint) {
    try {
      const png = await renderQrLabel(item);
      printResult = await printLabel(png, 1);
      await logCaptureEvent({
        source: "api",
        action: printResult.ok ? "intake.print_ok" : "intake.print_fail",
        requestId,
        sku: item.sku,
        actorId: stamp.actorId,
        actorName: stamp.actorName,
        loginEmail: stamp.loginEmail,
        loginRole: stamp.loginRole,
        payload: printResult,
        error: printResult.ok ? null : printResult.message,
      });
    } catch (e) {
      printResult = {
        ok: false,
        message: e instanceof Error ? e.message : "Print failed",
      };
      await logCaptureEvent({
        source: "api",
        action: "intake.print_fail",
        requestId,
        sku: item.sku,
        actorId: stamp.actorId,
        actorName: stamp.actorName,
        loginEmail: stamp.loginEmail,
        loginRole: stamp.loginRole,
        error: printResult.message,
      });
    }
  }

  return NextResponse.json({ ok: true, sku: item.sku, id: item.id, print: printResult });
}
