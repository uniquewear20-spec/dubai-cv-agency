// lib/agent/extract.ts — browser only. Reads the text of a CV file on the visitor's device:
// PDF with pdf.js (worker served from /pdf.worker.min.mjs), Word .docx by unzipping it, or plain text.
// A file must be what its name says (its first bytes are checked), at most 5 MB, and a Word file
// may not unpack to more than 20 MB of text.

import { decodeEntities } from "./text";

export type ExtractResult =
  | { ok: true; text: string; kind: "pdf" | "docx" | "txt"; pages?: number }
  | { ok: false; reason: "too-big" | "old-doc" | "scanned" | "unreadable" | "not-cv" };

export const MAX_CV_BYTES = 5 * 1024 * 1024;
const MAX_DOCX_XML = 20 * 1024 * 1024;

/** What the file's first bytes say it is, whatever its name. */
async function sniff(file: File): Promise<"pdf" | "zip" | "ole" | "other"> {
  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  const ascii = String.fromCharCode(...head);
  if (ascii.includes("%PDF-")) return "pdf";
  if (head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04) return "zip";
  if (head[0] === 0xd0 && head[1] === 0xcf && head[2] === 0x11 && head[3] === 0xe0) return "ole";
  return "other";
}

export async function extractCv(file: File): Promise<ExtractResult> {
  if (file.size > MAX_CV_BYTES) return { ok: false, reason: "too-big" };
  const name = file.name.toLowerCase();
  try {
    const kind = await sniff(file);
    if (name.endsWith(".pdf") || file.type === "application/pdf") return kind === "pdf" ? await pdf(file) : { ok: false, reason: "not-cv" };
    if (name.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return kind === "zip" ? await docx(file) : { ok: false, reason: "not-cv" };
    if (name.endsWith(".doc") || file.type === "application/msword") return { ok: false, reason: "old-doc" };
    if (name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/")) {
      if (kind !== "other") return { ok: false, reason: "not-cv" };
      const text = tidy(await file.text());
      return text ? { ok: true, text, kind: "txt" } : { ok: false, reason: "unreadable" };
    }
    return { ok: false, reason: "unreadable" };
  } catch {
    return { ok: false, reason: "unreadable" };
  }
}

function tidy(s: string): string {
  return s
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 30_000);
}

async function pdf(file: File): Promise<ExtractResult> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    disableFontFace: true,
    // Font metrics and character maps, copied from pdfjs-dist into /public/pdfjs, for PDFs whose fonts aren't embedded.
    standardFontDataUrl: "/pdfjs/standard_fonts/",
    cMapUrl: "/pdfjs/cmaps/",
    cMapPacked: true,
  });
  const doc = await task.promise;
  const pages: string[] = [];
  for (let i = 1; i <= Math.min(doc.numPages, 12); i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    let lastY: number | null = null;
    let lastEnd: number | null = null;
    const lines: string[] = [];
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const [, , , scaleY, x, y] = item.transform as number[];
      if (lastY !== null && Math.abs(y - lastY) > 2 && line.trim()) { lines.push(line.trim()); line = ""; lastEnd = null; }
      // A space only where the text has a visible gap, so words split into several runs stay whole.
      const gap = lastEnd === null ? 0 : x - lastEnd;
      const needsSpace = line && !line.endsWith(" ") && item.str && !item.str.startsWith(" ") && (item.dir === "rtl" || gap > Math.abs(scaleY || 10) * 0.18);
      line += (needsSpace ? " " : "") + item.str;
      lastEnd = x + (item.width ?? 0);
      if (item.hasEOL) { lines.push(line.trim()); line = ""; lastY = null; lastEnd = null; continue; }
      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());
    pages.push(lines.filter(Boolean).join("\n"));
  }
  await task.destroy();
  const text = tidy(pages.join("\n\n"));
  if (text.replace(/\s/g, "").length < 80) return { ok: false, reason: "scanned" };
  return { ok: true, text, kind: "pdf", pages: pages.length };
}

async function docx(file: File): Promise<ExtractResult> {
  const { unzipSync, strFromU8 } = await import("fflate");
  let tooLarge = false;
  const files = unzipSync(new Uint8Array(await file.arrayBuffer()), {
    filter: f => {
      if (f.name !== "word/document.xml") return false;
      if (f.originalSize > MAX_DOCX_XML) { tooLarge = true; return false; }
      return true;
    },
  });
  if (tooLarge) return { ok: false, reason: "unreadable" };
  const xml = files["word/document.xml"];
  if (!xml) return { ok: false, reason: "unreadable" };
  const text = tidy(
    decodeEntities(
      strFromU8(xml)
        .replace(/<w:tab\/>/g, "\t")
        .replace(/<w:br[^>]*\/>/g, "\n")
        .replace(/<\/w:p>/g, "\n")
        .replace(/<[^>]+>/g, ""),
    ),
  );
  return text ? { ok: true, text, kind: "docx" } : { ok: false, reason: "unreadable" };
}
