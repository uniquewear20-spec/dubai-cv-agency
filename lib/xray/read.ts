// lib/xray/read.ts — browser only. Reads a CV for the CV X-Ray: its text, the way the agent's reader
// does (lib/agent/extract.ts), plus the layout facts that decide how screening software reads it:
// side-by-side columns, Word tables and text boxes, contact details kept in a header, characters
// that don't come out as text. Nothing leaves the device: pdf.js and the Word unzip run in the page.

import { MAX_CV_BYTES } from "@/lib/agent/extract";
import { decodeEntities } from "@/lib/agent/text";

export interface Layout {
  kind: "pdf" | "docx" | "txt";
  pages: number | null;
  /** Text set side by side (a sidebar or two columns): PDF rows, or Word section columns. */
  columns: boolean;
  tables: number;
  textBoxes: number;
  images: number;
  /** An email or phone number that appears only in the Word header or footer. */
  headerOnlyContact: boolean;
  /** An email / a phone number in the Word header or footer (whether or not the body repeats it). */
  headerEmail: boolean;
  headerPhone: boolean;
  /** Characters that don't come out as text: icon fonts, private-use glyphs, broken encodings. */
  oddChars: number;
}

export type ReadFailure = "too-big" | "old-doc" | "scanned" | "unreadable" | "not-cv";
export type ReadResult = { ok: true; text: string; layout: Layout } | { ok: false; reason: ReadFailure; kind?: "pdf" | "docx" };

const MAX_XML = 20 * 1024 * 1024;
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}/i;
const PHONE = /(?:\+|00)?\d[\d\s().-]{6,}\d/g;
const ODD = /[-�]|\(cid:\d+\)/g;

const blank = (kind: Layout["kind"]): Layout => ({
  kind, pages: null, columns: false, tables: 0, textBoxes: 0, images: 0, headerOnlyContact: false, headerEmail: false, headerPhone: false, oddChars: 0,
});

async function sniff(file: File): Promise<"pdf" | "zip" | "ole" | "other"> {
  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  if (String.fromCharCode(...head).includes("%PDF-")) return "pdf";
  if (head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04) return "zip";
  if (head[0] === 0xd0 && head[1] === 0xcf && head[2] === 0x11 && head[3] === 0xe0) return "ole";
  return "other";
}

function tidy(s: string): string {
  return s
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 40_000);
}

const countOf = (s: string, re: RegExp): number => s.match(re)?.length ?? 0;

export async function readCv(file: File): Promise<ReadResult> {
  if (file.size > MAX_CV_BYTES) return { ok: false, reason: "too-big" };
  const name = file.name.toLowerCase();
  try {
    const kind = await sniff(file);
    if (name.endsWith(".pdf") || file.type === "application/pdf") return kind === "pdf" ? await readPdf(file) : { ok: false, reason: "not-cv" };
    if (name.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return kind === "zip" ? await readDocx(file) : { ok: false, reason: "not-cv" };
    }
    if (name.endsWith(".doc") || file.type === "application/msword") return { ok: false, reason: "old-doc" };
    if (name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/")) {
      if (kind !== "other") return { ok: false, reason: "not-cv" };
      const text = tidy(await file.text());
      return text ? { ok: true, text, layout: blank("txt") } : { ok: false, reason: "unreadable" };
    }
    return { ok: false, reason: "unreadable" };
  } catch {
    return { ok: false, reason: "unreadable" };
  }
}

// ── PDF ──────────────────────────────────────────────────────────────────────

interface Run { x: number; y: number; w: number; h: number; s: string }

const wordsIn = (s: string): number => s.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
/** A date, a short label or a page number: text that sits at the right of a one-column CV without making it two columns. */
const minor = (s: string): boolean => wordsIn(s) < 3 || (/(19|20)\d{2}|present|current|now|aujourd|حتى|الآن/i.test(s) && wordsIn(s) <= 7);

/** Groups a page's runs into visual rows (same baseline), each split where the horizontal gap is wide. */
function rowsOf(runs: Run[], width: number): { segments: { x: number; s: string }[] }[] {
  const sorted = [...runs].sort((a, b) => b.y - a.y || a.x - b.x);
  const rows: Run[][] = [];
  for (const r of sorted) {
    const row = rows[rows.length - 1];
    if (row && Math.abs(row[0].y - r.y) <= Math.max(2, Math.min(row[0].h, r.h) * 0.45)) row.push(r);
    else rows.push([r]);
  }
  return rows.map(row => {
    row.sort((a, b) => a.x - b.x);
    const segments: { x: number; s: string }[] = [];
    let end = -Infinity;
    for (const r of row) {
      const last = segments[segments.length - 1];
      if (last && r.x - end < width * 0.05) last.s += (r.x - end > r.h * 0.18 ? " " : "") + r.s;
      else segments.push({ x: r.x, s: r.s });
      end = Math.max(end, r.x + r.w);
    }
    return { segments };
  });
}

/**
 * Two signs of side-by-side text on a page: rows that carry a second block of real text far to the
 * right of their first (a sidebar beside the experience), or lines that start at two distant left
 * margins. Dates and short labels at the right of a line don't count: one-column CVs have those.
 */
function sideBySide(runs: Run[], width: number): boolean {
  const rows = rowsOf(runs, width);
  let paired = 0;
  const starts: number[] = [];
  for (const { segments } of rows) {
    const first = segments[0];
    if (segments.slice(1).some(seg => seg.x - first.x > width * 0.25 && !minor(seg.s) && !minor(first.s))) paired++;
    for (const seg of segments) if (!minor(seg.s)) starts.push(seg.x);
  }
  if (paired >= 5) return true;
  if (starts.length < 10) return false;
  const bucket = width * 0.04;
  const counts = new Map<number, number>();
  for (const x of starts) counts.set(Math.round(x / bucket), (counts.get(Math.round(x / bucket)) ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2);
  if (top.length < 2) return false;
  const need = Math.max(4, starts.length * 0.15);
  return top[1][1] >= need && Math.abs(top[0][0] - top[1][0]) * bucket > width * 0.25;
}

async function readPdf(file: File): Promise<ReadResult> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    disableFontFace: true,
    standardFontDataUrl: "/pdfjs/standard_fonts/",
    cMapUrl: "/pdfjs/cmaps/",
    cMapPacked: true,
  });
  const doc = await task.promise;
  const layout = blank("pdf");
  layout.pages = doc.numPages;
  const pages: string[] = [];
  for (let i = 1; i <= Math.min(doc.numPages, 12); i++) {
    const page = await doc.getPage(i);
    const width = Math.abs(page.view[2] - page.view[0]) || 595;
    const content = await page.getTextContent();
    const runs: Run[] = [];
    // The page's text, line by line, built exactly as lib/agent/extract.ts does.
    let line = "";
    let lastY: number | null = null;
    let lastEnd: number | null = null;
    const lines: string[] = [];
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const [, , , scaleY, x, y] = item.transform as number[];
      if (item.str.trim()) runs.push({ x, y, w: item.width ?? 0, h: Math.abs(scaleY || 10), s: item.str });
      if (lastY !== null && Math.abs(y - lastY) > 2 && line.trim()) { lines.push(line.trim()); line = ""; lastEnd = null; }
      const gap = lastEnd === null ? 0 : x - lastEnd;
      const needsSpace = line && !line.endsWith(" ") && item.str && !item.str.startsWith(" ") && (item.dir === "rtl" || gap > Math.abs(scaleY || 10) * 0.18);
      line += (needsSpace ? " " : "") + item.str;
      lastEnd = x + (item.width ?? 0);
      if (item.hasEOL) { lines.push(line.trim()); line = ""; lastY = null; lastEnd = null; continue; }
      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());
    pages.push(lines.filter(Boolean).join("\n"));
    if (!layout.columns && sideBySide(runs, width)) layout.columns = true;
  }
  await task.destroy();
  const raw = pages.join("\n\n");
  layout.oddChars = countOf(raw, ODD);
  const text = tidy(raw.replace(ODD, " "));
  if (text.replace(/\s/g, "").length < 80) return { ok: false, reason: "scanned", kind: "pdf" };
  return { ok: true, text, layout };
}

// ── Word (.docx) ─────────────────────────────────────────────────────────────

function xmlText(xml: string): string {
  return decodeEntities(
    xml
      .replace(/<w:tab\/>/g, "\t")
      .replace(/<w:br[^>]*\/>/g, "\n")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<\/w:tc>/g, "\t")
      .replace(/<[^>]+>/g, ""),
  );
}

const digitsOf = (s: string): string => s.replace(/\D/g, "");

function phonesIn(s: string): string[] {
  return [...s.matchAll(PHONE)].map(m => digitsOf(m[0])).filter(d => d.length >= 8 && d.length <= 15);
}

async function readDocx(file: File): Promise<ReadResult> {
  const { unzipSync, strFromU8 } = await import("fflate");
  let tooLarge = false;
  const files = unzipSync(new Uint8Array(await file.arrayBuffer()), {
    filter: f => {
      if (!/^word\/(document|header\d*|footer\d*)\.xml$/.test(f.name)) return false;
      if (f.originalSize > MAX_XML) { tooLarge = true; return false; }
      return true;
    },
  });
  const docXml = files["word/document.xml"];
  if (tooLarge || !docXml) return { ok: false, reason: "unreadable", kind: "docx" };
  const xml = strFromU8(docXml);
  // A text box is stored twice (the modern shape and an old fallback copy): read the modern one only.
  const body = xml.replace(/<mc:Fallback>[\s\S]*?<\/mc:Fallback>/g, "");
  const text = tidy(xmlText(body));
  if (!text) return { ok: false, reason: "unreadable", kind: "docx" };

  const layout = blank("docx");
  layout.tables = countOf(body, /<w:tbl[\s>]/g);
  layout.textBoxes = Math.max(countOf(xml, /<wps:txbx[\s>]/g), countOf(xml, /<v:textbox[\s>]/g));
  layout.images = countOf(body, /<pic:pic[\s>]/g);
  layout.columns = [...body.matchAll(/<w:cols\b[^>]*w:num="(\d+)"/g)].some(m => Number(m[1]) >= 2);
  layout.oddChars = countOf(text, ODD);

  const edges = Object.entries(files).filter(([n]) => n !== "word/document.xml").map(([, d]) => xmlText(strFromU8(d))).join("\n");
  const email = edges.match(EMAIL)?.[0]?.toLowerCase();
  const bodyDigits = digitsOf(text);
  const edgePhones = phonesIn(edges);
  layout.headerEmail = Boolean(email);
  layout.headerPhone = edgePhones.length > 0;
  layout.headerOnlyContact = Boolean(
    (email && !text.toLowerCase().includes(email)) || edgePhones.some(p => !bodyDigits.includes(p)),
  );
  return { ok: true, text, layout };
}
