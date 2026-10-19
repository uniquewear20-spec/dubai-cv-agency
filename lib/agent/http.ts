// lib/agent/http.ts — server only. Small helpers shared by the agent's API routes.

import { NextResponse } from "next/server";
import type { AccessErrorCode } from "./types";

const STATUS: Record<AccessErrorCode, number> = {
  invalid: 400, "not-found": 404, "not-paid": 402, pending: 402, "not-eligible": 403, refunded: 403,
  "not-configured": 503, unavailable: 502, limit: 429, "ai-off": 503,
};

export const fail = (error: AccessErrorCode | string, status?: number, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ error, ...extra }, { status: status ?? STATUS[error as AccessErrorCode] ?? 400, headers: { "Cache-Control": "no-store" } });

export const ok = (data: unknown) => NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });

export const strings = (v: unknown, maxItems: number, maxLen: number): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").map(x => x.trim().slice(0, maxLen)).filter(Boolean).slice(0, maxItems) : [];

export const text = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function readJson<T>(req: Request, maxBytes = 200_000): Promise<T | null> {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > maxBytes) return null;
  try {
    const raw = await req.text();
    if (raw.length > maxBytes) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
