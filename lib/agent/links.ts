// lib/agent/links.ts — browser helpers: searches on job sites that have no open API, calendar
// reminders (.ics) and email drafts (mailto:). Nothing here sends anything by itself.

import { countryByCode } from "./countries";

const slug = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const INDEED: Record<string, string> = {
  AE: "ae", SA: "sa", QA: "qa", KW: "kw", BH: "bh", OM: "om", EG: "eg", MA: "ma", FR: "fr", GB: "uk", DE: "de", CA: "ca", IN: "in",
  AU: "au", NL: "nl", BE: "be", CH: "ch", ES: "es", IT: "it", IE: "ie", SG: "sg", US: "www",
};
const BAYT: Record<string, string> = {
  AE: "uae", SA: "saudi-arabia", QA: "qatar", KW: "kuwait", BH: "bahrain", OM: "oman", EG: "egypt", JO: "jordan", LB: "lebanon", MA: "morocco",
};
const NAUKRIGULF: Record<string, string> = { AE: "uae", SA: "saudi-arabia", QA: "qatar", KW: "kuwait", BH: "bahrain", OM: "oman" };

export interface ExternalSearch { name: string; url: string }

export function externalSearches(role: string, country: string | null): ExternalSearch[] {
  const q = encodeURIComponent(role);
  const c = country ? countryByCode(country) : undefined;
  const where = c ? encodeURIComponent(c.en) : "";
  const out: ExternalSearch[] = [
    { name: "LinkedIn", url: `https://www.linkedin.com/jobs/search/?keywords=${q}${where ? `&location=${where}` : ""}` },
    { name: "Indeed", url: `https://${(c && INDEED[c.code]) || "www"}.indeed.com/jobs?q=${q}${c && !INDEED[c.code] ? `&l=${where}` : ""}` },
  ];
  if (!c || BAYT[c.code]) out.push({ name: "Bayt", url: `https://www.bayt.com/en/${c ? BAYT[c.code] : "international"}/jobs/${slug(role)}-jobs/` });
  if (!c || NAUKRIGULF[c.code]) out.push({ name: "Naukrigulf", url: `https://www.naukrigulf.com/${slug(role)}-jobs${c ? `-in-${NAUKRIGULF[c.code]}` : ""}` });
  if (!c || ["AE", "SA", "QA", "KW", "BH", "OM"].includes(c.code)) out.push({ name: "GulfTalent", url: `https://www.gulftalent.com/jobs/search?search_keyword=${q}` });
  return out;
}

// ── Calendar ─────────────────────────────────────────────────────────────────

const icsEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, m => `\\${m}`);
const fold = (line: string) => line.match(/.{1,70}/g)!.join("\r\n ");

/** An all-day calendar event (with a 9:00 reminder) as an .ics file. date is YYYY-MM-DD. */
export function icsFile(o: { uid: string; date: string; title: string; body: string; url?: string }): Blob {
  const d = o.date.replace(/-/g, "");
  const next = new Date(`${o.date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const end = next.toISOString().slice(0, 10).replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Zenith Dubai CV//AI job agent//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${o.uid}@zenithdubaicv.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${icsEscape(o.title)}`, `DESCRIPTION:${icsEscape(o.body)}`, ...(o.url ? [`URL:${o.url}`] : []),
    "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${icsEscape(o.title)}`, "TRIGGER:PT9H", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ];
  return new Blob([lines.map(fold).join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
}

export function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** mailto: link with subject and body. Long bodies are cut, because mail apps limit link length. */
export function mailto(to: string, subject: string, body: string): string {
  const b = body.length > 1800 ? `${body.slice(0, 1800)}…` : body;
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(b)}`;
}

export const addDays = (days: number, from = new Date()): string => {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const today = (): string => addDays(0);
