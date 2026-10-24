"use client";
// components/agent/ShareButton.tsx — share a public page of the agent: the device's share sheet
// where there is one, otherwise the link is copied (or shown to copy by hand). Only the page's
// public address is shared: never a profile, CV, report, purchase or session detail.

import React, { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import type { Lang } from "./context";

export type SharePage = "agent" | "coach";

const COPY: Record<Lang, { share: string; copied: string; manual: string; pages: Record<SharePage, { title: string; text: string }> }> = {
  en: {
    share: "Share",
    copied: "Link copied",
    manual: "Copy this link:",
    pages: {
      agent: { title: "Zenith AI job agent", text: "Search public job listings for any role, in any country, free." },
      coach: { title: "Zenith AI interview coach", text: "Practise a job interview out loud with an animated interviewer and get a scored report. Included in Zenith packages 2 to 4." },
    },
  },
  fr: {
    share: "Partager",
    copied: "Lien copié",
    manual: "Copiez ce lien :",
    pages: {
      agent: { title: "Agent emploi IA Zenith", text: "Recherchez gratuitement des offres d'emploi publiques, pour tout métier et dans tout pays." },
      coach: { title: "Coach d'entretien IA Zenith", text: "Entraînez-vous à voix haute avec un recruteur animé et recevez un rapport noté. Inclus dans les formules Zenith 2 à 4." },
    },
  },
  ar: {
    share: "مشاركة",
    copied: "تم نسخ الرابط",
    manual: "انسخ هذا الرابط:",
    pages: {
      agent: { title: "وكيل الوظائف بالذكاء الاصطناعي من زينيث", text: "ابحث مجاناً في إعلانات الوظائف العامة لأي مهنة وفي أي بلد." },
      coach: { title: "مدرّب المقابلات بالذكاء الاصطناعي من زينيث", text: "تدرّب على مقابلة العمل بصوتك مع محاوِر متحرك واحصل على تقرير بالدرجات. مشمول في باقات زينيث من 2 إلى 4." },
    },
  },
};

/** The public address of each page (the live site's, so a link shared from a preview still works). */
export const SHARE_URL: Record<SharePage, string> = {
  agent: `${SITE_URL}/agent/`,
  coach: `${SITE_URL}/agent/#interview`,
};

export default function ShareButton({ page, lang, compact = false }: { page: SharePage; lang: Lang; compact?: boolean }) {
  const c = COPY[lang];
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const timer = useRef<number | undefined>(undefined);
  const field = useRef<HTMLInputElement>(null);
  const url = SHARE_URL[page];

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { if (state === "manual") field.current?.select(); }, [state]);

  const flash = (s: "copied" | "manual") => {
    setState(s);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), s === "copied" ? 2600 : 12000);
  };

  const share = async () => {
    const data = { title: c.pages[page].title, text: c.pages[page].text, url };
    if (typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return; // closed the share sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("copied");
    } catch {
      flash("manual");
    }
  };

  return (
    <span className="za-share">
      <button type="button" className={compact ? "za-icon-btn" : "z-btn z-btn-quiet z-btn-small"} onClick={() => void share()} aria-label={compact ? c.share : undefined}>
        {state === "copied" ? <Check size={compact ? 18 : 15} aria-hidden /> : <Share2 size={compact ? 18 : 15} aria-hidden />}
        {!compact && <span>{c.share}</span>}
      </button>
      <span className="za-share-msg" role="status" aria-live="polite">
        {state === "copied" && c.copied}
        {state === "manual" && (
          <>
            {c.manual}{" "}
            <input ref={field} className="za-input za-share-url" readOnly value={url} dir="ltr" aria-label={c.manual} onFocus={e => e.currentTarget.select()} />
          </>
        )}
      </span>
    </span>
  );
}
