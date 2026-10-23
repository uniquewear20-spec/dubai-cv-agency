"use client";
// components/site/EnquiryModal.tsx — the contact form, posting to /api/contact (email to the
// Zenith inbox). Files are optional; together they must stay under 4 MB, below the hosting
// platform's request limit.

import React, { useEffect, useId, useRef, useState } from "react";
import { AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
import { CONTACT_EMAIL, pick, waLink, type L10n, type Lang } from "@/lib/site";

const MAX_TOTAL = 4 * 1024 * 1024;

const SUBJECTS: L10n[] = [
  { en: "General enquiry", fr: "Demande générale", ar: "استفسار عام" },
  { en: "CV Essentials", fr: "CV Essentiel", ar: "أساسيات السيرة الذاتية" },
  { en: "Career Automation", fr: "Carrière Automatisée", ar: "أتمتة المسار المهني" },
  { en: "Advanced Career Support", fr: "Accompagnement Carrière Avancé", ar: "الدعم المهني المتقدّم" },
  { en: "Executive Career Suite", fr: "Suite Carrière Exécutive", ar: "الباقة التنفيذية المتكاملة" },
  { en: "Portfolio website", fr: "Site portfolio", ar: "موقع تعريفي" },
  { en: "Zenith AI", fr: "Zenith AI", ar: "Zenith AI" },
];

const T: Record<string, L10n> = {
  title: { en: "Send us a message", fr: "Envoyez-nous un message", ar: "أرسل لنا رسالة" },
  sub: { en: "We reply within 24 hours.", fr: "Nous répondons sous 24 heures.", ar: "نرد خلال 24 ساعة." },
  email: { en: "Your email", fr: "Votre e-mail", ar: "بريدك الإلكتروني" },
  subject: { en: "Subject", fr: "Sujet", ar: "الموضوع" },
  message: { en: "Message", fr: "Message", ar: "الرسالة" },
  placeholder: {
    en: "Your current role, the roles and countries you are targeting, and your question.",
    fr: "Votre poste actuel, les postes et pays visés, et votre question.",
    ar: "منصبك الحالي، والوظائف والدول التي تستهدفها، وسؤالك.",
  },
  cv: { en: "Current CV (optional): PDF or Word", fr: "CV actuel (facultatif) : PDF ou Word", ar: "السيرة الحالية (اختياري): PDF أو Word" },
  photo: { en: "Profile photo (optional): JPG, PNG or WebP", fr: "Photo de profil (facultatif) : JPG, PNG ou WebP", ar: "صورة شخصية (اختياري): JPG أو PNG أو WebP" },
  filesNote: { en: "Up to 4 MB in total.", fr: "4 Mo maximum au total.", ar: "حتى 4 ميغابايت إجمالاً." },
  send: { en: "Send message", fr: "Envoyer le message", ar: "إرسال الرسالة" },
  sending: { en: "Sending…", fr: "Envoi…", ar: "جارٍ الإرسال…" },
  sent: { en: "Message sent.", fr: "Message envoyé.", ar: "تم إرسال الرسالة." },
  sentBody: { en: "We'll reply to {email} within 24 hours.", fr: "Nous répondrons à {email} sous 24 heures.", ar: "سنرد على {email} خلال 24 ساعة." },
  close: { en: "Close", fr: "Fermer", ar: "إغلاق" },
  errEmail: { en: "Enter a valid email address.", fr: "Saisissez une adresse e-mail valide.", ar: "أدخل بريداً إلكترونياً صحيحاً." },
  errMessage: { en: "Write at least 10 characters.", fr: "Écrivez au moins 10 caractères.", ar: "اكتب 10 أحرف على الأقل." },
  errFiles: { en: "Your files are larger than 4 MB in total. Send a smaller file, or share it on WhatsApp.", fr: "Vos fichiers dépassent 4 Mo au total. Envoyez un fichier plus léger ou partagez-le sur WhatsApp.", ar: "حجم ملفاتك يتجاوز 4 ميغابايت. أرسل ملفاً أصغر أو شاركه عبر واتساب." },
  errSend: { en: "The message wasn't sent. Try again, or reach us on WhatsApp.", fr: "Le message n'a pas été envoyé. Réessayez ou contactez-nous sur WhatsApp.", ar: "لم تُرسل الرسالة. حاول مجدداً أو تواصل معنا عبر واتساب." },
  whatsapp: { en: "Open WhatsApp", fr: "Ouvrir WhatsApp", ar: "فتح واتساب" },
};
const t = (k: string, l: Lang) => pick(T[k], l);
const validEmail = (v: string) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(v.trim());

export default function EnquiryModal({ open, onClose, lang, initialSubject = 0 }: { open: boolean; onClose: () => void; lang: Lang; initialSubject?: number }) {
  const uid = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const trap = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("input,select,textarea,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const f = [...dialogRef.current.querySelectorAll<HTMLElement>("input:not([tabindex='-1']),select,textarea,button:not([disabled]),a[href]")];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); opener?.focus?.(); };
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    if (!validEmail(email)) return setError(t("errEmail", lang));
    if (message.trim().length < 10) return setError(t("errMessage", lang));
    if ((cv?.size ?? 0) + (photo?.size ?? 0) > MAX_TOTAL) return setError(t("errFiles", lang));
    setError(null);
    setState("sending");
    try {
      const fd = new FormData();
      fd.append("senderEmail", email.trim());
      fd.append("subject", SUBJECTS[subject].en);
      fd.append("message", message.trim());
      fd.append("website", trap.current?.value ?? "");
      if (cv) fd.append("cv", cv);
      if (photo) fd.append("photo", photo);
      const res = await fetch("/api/contact/", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
    } catch {
      setState("error");
      setError(t("errSend", lang));
    }
  }

  const busy = state === "sending";

  return (
    <div className="eq" role="dialog" aria-modal="true" aria-labelledby={`${uid}-t`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <style href="zenith-enquiry" precedence="medium">{CSS}</style>
      <div className="eq-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="eq-panel" ref={dialogRef}>
        <div className="eq-head">
          <div>
            <h2 id={`${uid}-t`} className="z-h3">{t("title", lang)}</h2>
            <p className="z-small">{t("sub", lang)}</p>
          </div>
          <button type="button" className="hd-icon" onClick={onClose} aria-label={t("close", lang)}><X size={18} /></button>
        </div>

        {state === "sent" ? (
          <div className="eq-done" role="status">
            <CheckCircle size={28} aria-hidden="true" />
            <p className="z-h3">{t("sent", lang)}</p>
            <p className="z-small">{t("sentBody", lang).replace("{email}", email.trim())}</p>
            <button type="button" className="z-btn z-btn-primary" onClick={onClose}>{t("close", lang)}</button>
          </div>
        ) : (
          <form className="eq-form" onSubmit={submit} noValidate>
            <label htmlFor={`${uid}-e`}>{t("email", lang)}</label>
            <input id={`${uid}-e`} type="email" autoComplete="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} required disabled={busy} />

            <label htmlFor={`${uid}-s`}>{t("subject", lang)}</label>
            <select id={`${uid}-s`} value={subject} onChange={e => setSubject(Number(e.target.value))} disabled={busy}>
              {SUBJECTS.map((s, i) => <option key={s.en} value={i}>{pick(s, lang)}</option>)}
            </select>

            <label htmlFor={`${uid}-m`}>{t("message", lang)}</label>
            <textarea id={`${uid}-m`} rows={5} maxLength={5000} value={message} onChange={e => setMessage(e.target.value)} placeholder={t("placeholder", lang)} required disabled={busy} />

            <label htmlFor={`${uid}-cv`}>{t("cv", lang)}</label>
            <input id={`${uid}-cv`} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e => setCv(e.target.files?.[0] ?? null)} disabled={busy} />
            <label htmlFor={`${uid}-ph`}>{t("photo", lang)}</label>
            <input id={`${uid}-ph`} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPhoto(e.target.files?.[0] ?? null)} disabled={busy} />
            <p className="z-micro">{t("filesNote", lang)}</p>

            {/* Spam trap: people never see or fill this field. */}
            <div className="z-sr" aria-hidden="true">
              <label htmlFor={`${uid}-w`}>Website</label>
              <input id={`${uid}-w`} ref={trap} type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            {error && (
              <div className="eq-err" role="alert">
                <AlertCircle size={16} aria-hidden="true" />
                <div>
                  <p>{error}</p>
                  {state === "error" && <a className="z-link" href={waLink("Hello Zenith Dubai CV. My message through the website did not go through.")} target="_blank" rel="noopener noreferrer">{t("whatsapp", lang)}</a>}
                </div>
              </div>
            )}

            <button type="submit" className="z-btn z-btn-primary z-btn-block" disabled={busy} aria-busy={busy}>
              {busy ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />{t("sending", lang)}</> : t("send", lang)}
            </button>
            <p className="z-micro" style={{ textAlign: "center" }} dir="ltr">{CONTACT_EMAIL}</p>
          </form>
        )}
      </div>
    </div>
  );
}

const CSS = `
.eq{position:fixed;inset:0;z-index:90;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:5vh 16px}
.eq-backdrop{position:fixed;inset:0;background:rgba(6,5,4,.78);backdrop-filter:blur(10px)}
.eq-panel{position:relative;width:100%;max-width:480px;background:var(--z-surface);color:var(--z-fg);border:1px solid var(--z-rule);border-radius:20px;padding:24px;box-shadow:0 40px 100px -30px rgba(0,0,0,.8)}
.eq-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:18px}
.eq-form{display:grid;gap:8px}
.eq-form label{font-size:14px;font-weight:500;color:var(--z-fg);margin-top:8px}
.eq-form input[type=email],.eq-form select,.eq-form textarea{width:100%;min-height:46px;padding:10px 14px;border-radius:12px;border:1px solid var(--z-rule-strong);background:var(--z-bg);color:var(--z-fg);font:inherit;font-size:15px}
.eq-form textarea{resize:vertical;min-height:120px;line-height:1.55}
.eq-form input[type=file]{font-size:14px;color:var(--z-fg-2)}
.eq-form input:focus,.eq-form select:focus,.eq-form textarea:focus{outline:2px solid var(--z-focus);outline-offset:1px}
.eq-form .z-btn{margin-top:14px}
.eq-err{display:flex;gap:10px;padding:12px 14px;border-radius:12px;border:1px solid color-mix(in srgb,var(--z-error) 45%,transparent);color:var(--z-error);font-size:14px;line-height:1.5}
.eq-err svg{flex:none;margin-top:2px}
.eq-done{display:grid;justify-items:center;gap:10px;text-align:center;padding:20px 0 6px;color:var(--z-fg)}
.eq-done svg{color:var(--z-gold-text)}
`;
