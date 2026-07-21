/**
 * Print bridge to the Brother QL-800. Sends a rendered label PNG to a CUPS
 * queue via `lp`. The queue name comes from PRINTER_QUEUE (set once the
 * official Brother driver + queue are installed on this Mac).
 *
 * Until the queue exists, printLabel throws a clear, catchable error so the
 * UI shows the on-screen label and tells the user printing isn't wired yet,
 * rather than silently failing.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

export function printerQueue(): string | undefined {
  return process.env.PRINTER_QUEUE?.trim() || undefined;
}

function run(cmd: string, args: string[]): Promise<{ code: number; out: string; err: string }> {
  return new Promise((resolve) => {
    const p = spawn(cmd, args);
    let out = "";
    let err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => resolve({ code: code ?? -1, out, err }));
    p.on("error", (e) => resolve({ code: -1, out, err: String(e) }));
  });
}

export interface PrintResult {
  ok: boolean;
  queue?: string;
  jobId?: string;
  message: string;
}

export async function printLabel(png: Buffer, copies = 1): Promise<PrintResult> {
  const queue = printerQueue();
  if (!queue) {
    return {
      ok: false,
      message:
        "Printer not set up yet. Install the Brother QL-800 driver + CUPS queue and set PRINTER_QUEUE.",
    };
  }

  const file = path.join(os.tmpdir(), `pl-label-${crypto.randomUUID()}.png`);
  await fs.writeFile(file, png);
  try {
    const args = [
      "-d", queue,
      "-n", String(copies),
      "-o", "fit-to-page",
      file,
    ];
    const { code, out, err } = await run("lp", args);
    if (code !== 0) {
      return { ok: false, queue, message: err.trim() || out.trim() || `lp exited ${code}` };
    }
    const m = /request id is (\S+)/.exec(out);
    return { ok: true, queue, jobId: m?.[1], message: out.trim() || "Sent to printer" };
  } finally {
    fs.unlink(file).catch(() => {});
  }
}
