"use client";
// components/site/RefTracker.tsx — campaign source codes for WhatsApp leads.
// A visit that arrives with ?ref=IG (or ?ref=W1D3-IG-CCS008, up to 24 letters, digits and dashes)
// keeps that code for 30 days in this browser, and every WhatsApp chat started on the site then
// ends with "Ref: IG", so each lead shows which post brought it. Nothing is sent anywhere else.

import { useEffect } from "react";

const KEY = "z-ref";
const DAYS = 30;
export const cleanRef = (v: string | null | undefined): string => (v ?? "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 24);

/** The campaign code of this visit: from the address, or kept from an earlier visit (30 days). */
export function currentRef(): string {
  if (typeof window === "undefined") return "";
  const fromUrl = cleanRef(new URLSearchParams(window.location.search).get("ref"));
  if (fromUrl) return fromUrl;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null") as { ref?: string; at?: number } | null;
    if (saved?.ref && saved.at && Date.now() - saved.at < DAYS * 86_400_000) return cleanRef(saved.ref);
  } catch { /* storage blocked */ }
  return "";
}

export default function RefTracker() {
  useEffect(() => {
    const fromUrl = cleanRef(new URLSearchParams(window.location.search).get("ref"));
    if (fromUrl) { try { localStorage.setItem(KEY, JSON.stringify({ ref: fromUrl, at: Date.now() })); } catch { /* ignore */ } }
    // Add the code to the WhatsApp message just before the chat opens (left, middle or keyboard click).
    const tag = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='https://wa.me/']") as HTMLAnchorElement | null;
      const ref = currentRef();
      if (!a || !ref) return;
      const url = new URL(a.href);
      const text = url.searchParams.get("text") ?? "";
      if (/\bRef:/i.test(text)) return; // the X-Ray already writes its own reference
      a.href = `https://wa.me${url.pathname}?text=${encodeURIComponent(`${text}${text ? " " : ""}Ref: ${ref}`)}`;
    };
    document.addEventListener("click", tag, true);
    document.addEventListener("auxclick", tag, true);
    return () => { document.removeEventListener("click", tag, true); document.removeEventListener("auxclick", tag, true); };
  }, []);
  return null;
}
