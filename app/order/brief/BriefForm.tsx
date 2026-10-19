"use client";
// app/order/brief/BriefForm.tsx — the brief form. Posts to /api/brief, which checks the order
// with PayPal (when a PayPal token is present) and emails the brief to Zenith.
// Photos are resized in the browser before upload so a request stays under 4 MB.

import Link from "next/link";
import React, { useEffect, useId, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { TierKey } from "@/lib/checkout/catalog";
import { packageByKey } from "@/lib/packages";
import { CONTACT_EMAIL, LANGS, pick, waLink, type L10n, type Lang } from "@/lib/site";

export interface BriefOrder {
  token: string;
  ref: string;
  tier: TierKey | null;
  items: number;
  lang: Lang;
  email: string;
  name: string;
}

const MAX_CV = 3 * 1024 * 1024;
const MAX_TOTAL = 4 * 1024 * 1024;

const T: Record<string, L10n> = {
  h1: { en: "Send your brief", fr: "Envoyez votre brief", ar: "أرسل معلوماتك" },
  intro: {
    en: "Tell us where you are and where you want to go next. We start as soon as we receive this, and your first draft arrives within 48 hours.",
    fr: "Dites-nous où vous en êtes et ce que vous visez. Nous commençons dès réception, et le premier jet arrive sous 48 heures.",
    ar: "أخبرنا أين أنت الآن وإلى أين تريد الوصول. نبدأ فور استلام هذه المعلومات، وتصلك المسودة الأولى خلال 48 ساعة.",
  },
  verified: { en: "Order {ref}: {pkg}. Payment confirmed.", fr: "Commande {ref} : {pkg}. Paiement confirmé.", ar: "الطلب {ref}: {pkg}. تم تأكيد الدفع." },
  unverifiedNote: {
    en: "Paid through Gumroad? Enter the order number from your Gumroad receipt and the email you used at checkout.",
    fr: "Payé via Gumroad ? Indiquez le numéro de commande de votre reçu Gumroad et l'e-mail utilisé lors du paiement.",
    ar: "دفعت عبر Gumroad؟ أدخل رقم الطلب من إيصال Gumroad والبريد الذي استخدمته عند الدفع.",
  },
  badToken: {
    en: "We couldn't confirm that PayPal order automatically. You can still send your brief: add your order reference below and we'll match it.",
    fr: "Nous n'avons pas pu confirmer automatiquement cette commande PayPal. Vous pouvez tout de même envoyer votre brief : indiquez votre référence ci-dessous.",
    ar: "لم نتمكن من تأكيد طلب PayPal تلقائياً. يمكنك إرسال معلوماتك مع كتابة رقم الطلب أدناه وسنطابقه.",
  },
  orderNo: { en: "Order number or reference", fr: "Numéro ou référence de commande", ar: "رقم الطلب أو مرجعه" },
  name: { en: "Full name", fr: "Nom complet", ar: "الاسم الكامل" },
  email: { en: "Email", fr: "E-mail", ar: "البريد الإلكتروني" },
  phone: { en: "WhatsApp number (optional)", fr: "Numéro WhatsApp (facultatif)", ar: "رقم واتساب (اختياري)" },
  roles: { en: "Roles you are targeting", fr: "Postes visés", ar: "الوظائف التي تستهدفها" },
  rolesPh: { en: "e.g. Director of Food & Beverage, Hotel Manager", fr: "ex. Directeur de la restauration, Directeur d'hôtel", ar: "مثال: مدير الأغذية والمشروبات، مدير فندق" },
  places: { en: "Countries or cities", fr: "Pays ou villes", ar: "الدول أو المدن" },
  placesPh: { en: "e.g. UAE, Saudi Arabia, Qatar", fr: "ex. Émirats, Arabie saoudite, France", ar: "مثال: الإمارات، السعودية، قطر" },
  languages: { en: "Languages your CV should be in", fr: "Langues souhaitées pour le CV", ar: "اللغات المطلوبة للسيرة" },
  notes: { en: "Anything else we should know (optional)", fr: "Autre chose à nous dire (facultatif)", ar: "أي معلومات أخرى (اختياري)" },
  notesPh: {
    en: "Achievements you're proud of, employers to avoid, notice period, salary expectations…",
    fr: "Réalisations dont vous êtes fier, employeurs à éviter, préavis, prétentions salariales…",
    ar: "إنجازات تفخر بها، جهات لا تريد العمل لديها، فترة الإشعار، الراتب المتوقع…",
  },
  cv: { en: "Your current CV: PDF or Word, up to 3 MB", fr: "Votre CV actuel : PDF ou Word, 3 Mo max.", ar: "سيرتك الحالية: PDF أو Word حتى 3 ميغابايت" },
  noCv: { en: "I don't have a CV. I've described my experience in the notes.", fr: "Je n'ai pas de CV ; j'ai décrit mon parcours dans les notes.", ar: "ليست لدي سيرة ذاتية؛ وصفت خبرتي في الملاحظات." },
  photo: { en: "A recent photo for LinkedIn enhancement (optional)", fr: "Une photo récente pour l'amélioration LinkedIn (facultatif)", ar: "صورة حديثة لتحسين صورة لينكدإن (اختياري)" },
  consent: {
    en: "I agree that Zenith Dubai CV uses these details and files only to deliver my order, as described in the privacy policy.",
    fr: "J'accepte que Zenith Dubai CV utilise ces informations et fichiers uniquement pour exécuter ma commande, comme décrit dans la politique de confidentialité.",
    ar: "أوافق على أن تستخدم Zenith Dubai CV هذه المعلومات والملفات فقط لتنفيذ طلبي، كما توضح سياسة الخصوصية.",
  },
  privacy: { en: "Privacy policy", fr: "Politique de confidentialité", ar: "سياسة الخصوصية" },
  submit: { en: "Send my brief", fr: "Envoyer mon brief", ar: "أرسل معلوماتي" },
  sending: { en: "Sending…", fr: "Envoi…", ar: "جارٍ الإرسال…" },
  done: { en: "Brief received.", fr: "Brief reçu.", ar: "تم استلام معلوماتك." },
  doneBody: {
    en: "Thank you. We've emailed you a confirmation. Your first draft arrives within 48 hours; if anything is missing, we'll ask by email or WhatsApp.",
    fr: "Merci. Nous vous avons envoyé une confirmation par e-mail. Votre premier jet arrive sous 48 heures ; s'il manque quelque chose, nous vous le demanderons.",
    ar: "شكراً لك. أرسلنا إليك تأكيداً بالبريد. تصلك المسودة الأولى خلال 48 ساعة، وإن نقصت معلومة سنسألك عبر البريد أو واتساب.",
  },
  errRequired: { en: "Please complete the fields marked as required.", fr: "Merci de remplir les champs obligatoires.", ar: "يرجى إكمال الحقول المطلوبة." },
  errEmail: { en: "Enter a valid email address.", fr: "Saisissez une adresse e-mail valide.", ar: "أدخل بريداً إلكترونياً صحيحاً." },
  errCv: { en: "Attach your CV, or tick the box and describe your experience in the notes (50 characters or more).", fr: "Joignez votre CV, ou cochez la case et décrivez votre parcours dans les notes (50 caractères minimum).", ar: "أرفق سيرتك، أو حدّد المربع وصف خبرتك في الملاحظات (50 حرفاً على الأقل)." },
  errCvType: { en: "The CV must be a PDF or Word file of 3 MB or less.", fr: "Le CV doit être un PDF ou un fichier Word de 3 Mo maximum.", ar: "يجب أن تكون السيرة ملف PDF أو Word بحجم 3 ميغابايت أو أقل." },
  errSize: { en: "Your files are larger than 4 MB together. Send a smaller file, or share it on WhatsApp.", fr: "Vos fichiers dépassent 4 Mo au total. Envoyez un fichier plus léger, ou partagez-le sur WhatsApp.", ar: "حجم ملفاتك معاً يتجاوز 4 ميغابايت. أرسل ملفاً أصغر أو شاركه عبر واتساب." },
  errConsent: { en: "Please confirm the privacy statement.", fr: "Merci de confirmer la mention de confidentialité.", ar: "يرجى تأكيد بيان الخصوصية." },
  errSend: { en: "Your brief wasn't sent. Try again, or send it to us on WhatsApp.", fr: "Votre brief n'a pas été envoyé. Réessayez, ou envoyez-le sur WhatsApp.", ar: "لم تُرسل معلوماتك. حاول مجدداً أو أرسلها عبر واتساب." },
  whatsapp: { en: "Open WhatsApp", fr: "Ouvrir WhatsApp", ar: "فتح واتساب" },
  required: { en: "required", fr: "obligatoire", ar: "مطلوب" },
};
const t = (k: string, l: Lang) => pick(T[k], l);
const validEmail = (v: string) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(v.trim());
const CV_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

/** Resizes a photo to at most 1600 px on its longest side, as JPEG. Falls back to the original. */
async function shrinkPhoto(file: File): Promise<File> {
  if (file.size < 900 * 1024 || !file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.88));
    return blob ? new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file;
  }
}

export default function BriefForm({ order, tokenGiven }: { order: BriefOrder | null; tokenGiven: boolean }) {
  const uid = useId();
  const [lang, setLang] = useState<Lang>(order?.lang ?? "en");
  const [f, setF] = useState({
    orderNo: "", name: order?.name ?? "", email: order?.email ?? "", phone: "", roles: "", places: "",
    langs: { en: true, fr: false, ar: false } as Record<Lang, boolean>, notes: "", noCv: false, consent: false, website: "",
  });
  const [cv, setCv] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF(p => ({ ...p, [k]: v }));
  const pkgName = order?.tier ? pick(packageByKey(order.tier).name, lang) : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    if (!f.name.trim() || !f.roles.trim() || !f.places.trim() || (!order && !f.orderNo.trim())) return setError(t("errRequired", lang));
    if (!validEmail(f.email)) return setError(t("errEmail", lang));
    if (!cv && !(f.noCv && f.notes.trim().length >= 50)) return setError(t("errCv", lang));
    if (cv && (!CV_TYPES.includes(cv.type) || cv.size > MAX_CV)) return setError(t("errCvType", lang));
    if (!f.consent) return setError(t("errConsent", lang));
    setError(null);
    setState("sending");
    const small = photo ? await shrinkPhoto(photo) : null;
    if ((cv?.size ?? 0) + (small?.size ?? 0) > MAX_TOTAL) { setState("idle"); return setError(t("errSize", lang)); }
    const fd = new FormData();
    if (order) fd.append("token", order.token);
    fd.append("orderNo", f.orderNo.trim());
    fd.append("name", f.name.trim());
    fd.append("email", f.email.trim());
    fd.append("phone", f.phone.trim());
    fd.append("roles", f.roles.trim());
    fd.append("places", f.places.trim());
    fd.append("languages", (Object.keys(f.langs) as Lang[]).filter(l => f.langs[l]).join(","));
    fd.append("notes", f.notes.trim());
    fd.append("lang", lang);
    fd.append("website", f.website);
    if (cv) fd.append("cv", cv);
    if (small) fd.append("photo", small);
    try {
      const res = await fetch("/api/brief/", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
      window.scrollTo({ top: 0 });
    } catch {
      setState("error");
      setError(t("errSend", lang));
    }
  }

  const busy = state === "sending";
  const req = <span className="bf-req">({t("required", lang)})</span>;

  return (
    <div className="zs" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <style href="zenith-brief" precedence="medium">{CSS}</style>
      <header className="ok-top z-wrap">
        <Link href="/" aria-label="Zenith Dubai CV">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" width={92} height={52} className="ok-logo" />
        </Link>
        <div className="hd-lang" role="group" aria-label="Language">
          {LANGS.map(l => <button key={l.code} type="button" lang={l.code} aria-pressed={lang === l.code} aria-label={l.name} onClick={() => setLang(l.code)}>{l.label}</button>)}
        </div>
      </header>

      <main className="z-wrap bf-main">
        {state === "done" ? (
          <div className="bf-done" role="status">
            <CheckCircle size={30} aria-hidden="true" />
            <h1 className="z-h2">{t("done", lang)}</h1>
            <p className="z-lede">{t("doneBody", lang)}</p>
            <p className="z-small"><Link className="z-link" href="/">Zenith Dubai CV</Link> · <a className="z-link" href={`mailto:${CONTACT_EMAIL}`} dir="ltr">{CONTACT_EMAIL}</a></p>
          </div>
        ) : (
          <>
            <h1 className="z-h2">{t("h1", lang)}</h1>
            <p className="z-lede" style={{ marginTop: 14 }}>{t("intro", lang)}</p>
            {order ? (
              <p className="bf-verified"><CheckCircle size={16} aria-hidden="true" />{t("verified", lang).replace("{ref}", order.ref).replace("{pkg}", pkgName ?? `${order.items}`)}</p>
            ) : (
              <p className="bf-note">{tokenGiven ? t("badToken", lang) : t("unverifiedNote", lang)}</p>
            )}

            <form className="bf-form" onSubmit={submit} noValidate>
              {!order && (
                <div className="bf-field">
                  <label htmlFor={`${uid}-o`}>{t("orderNo", lang)} {req}</label>
                  <input id={`${uid}-o`} dir="ltr" value={f.orderNo} onChange={e => set("orderNo", e.target.value)} maxLength={80} required disabled={busy} />
                </div>
              )}
              <div className="bf-two">
                <div className="bf-field">
                  <label htmlFor={`${uid}-n`}>{t("name", lang)} {req}</label>
                  <input id={`${uid}-n`} autoComplete="name" value={f.name} onChange={e => set("name", e.target.value)} maxLength={120} required disabled={busy} />
                </div>
                <div className="bf-field">
                  <label htmlFor={`${uid}-e`}>{t("email", lang)} {req}</label>
                  <input id={`${uid}-e`} type="email" dir="ltr" autoComplete="email" value={f.email} onChange={e => set("email", e.target.value)} maxLength={160} required disabled={busy} />
                </div>
              </div>
              <div className="bf-field">
                <label htmlFor={`${uid}-p`}>{t("phone", lang)}</label>
                <input id={`${uid}-p`} type="tel" dir="ltr" autoComplete="tel" value={f.phone} onChange={e => set("phone", e.target.value)} maxLength={40} disabled={busy} />
              </div>
              <div className="bf-field">
                <label htmlFor={`${uid}-r`}>{t("roles", lang)} {req}</label>
                <input id={`${uid}-r`} value={f.roles} onChange={e => set("roles", e.target.value)} placeholder={t("rolesPh", lang)} maxLength={300} required disabled={busy} />
              </div>
              <div className="bf-field">
                <label htmlFor={`${uid}-c`}>{t("places", lang)} {req}</label>
                <input id={`${uid}-c`} value={f.places} onChange={e => set("places", e.target.value)} placeholder={t("placesPh", lang)} maxLength={300} required disabled={busy} />
              </div>
              <fieldset className="bf-field bf-langs">
                <legend>{t("languages", lang)}</legend>
                {LANGS.map(l => (
                  <label key={l.code} className="bf-check">
                    <input type="checkbox" checked={f.langs[l.code]} onChange={e => set("langs", { ...f.langs, [l.code]: e.target.checked })} disabled={busy} />
                    <span lang={l.code}>{l.name}</span>
                  </label>
                ))}
              </fieldset>
              <div className="bf-field">
                <label htmlFor={`${uid}-cv`}>{t("cv", lang)}</label>
                <input id={`${uid}-cv`} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e => setCv(e.target.files?.[0] ?? null)} disabled={busy} />
                <label className="bf-check">
                  <input type="checkbox" checked={f.noCv} onChange={e => set("noCv", e.target.checked)} disabled={busy} />
                  <span>{t("noCv", lang)}</span>
                </label>
              </div>
              <div className="bf-field">
                <label htmlFor={`${uid}-t`}>{t("notes", lang)}</label>
                <textarea id={`${uid}-t`} rows={5} value={f.notes} onChange={e => set("notes", e.target.value)} placeholder={t("notesPh", lang)} maxLength={4000} disabled={busy} />
              </div>
              <div className="bf-field">
                <label htmlFor={`${uid}-ph`}>{t("photo", lang)}</label>
                <input id={`${uid}-ph`} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPhoto(e.target.files?.[0] ?? null)} disabled={busy} />
              </div>
              <div className="z-sr" aria-hidden="true">
                <label htmlFor={`${uid}-w`}>Website</label>
                <input id={`${uid}-w`} tabIndex={-1} autoComplete="off" value={f.website} onChange={e => set("website", e.target.value)} />
              </div>
              <label className="bf-check bf-consent">
                <input type="checkbox" checked={f.consent} onChange={e => set("consent", e.target.checked)} disabled={busy} />
                <span>{t("consent", lang)} <Link className="z-link" href="/privacy/" target="_blank" rel="noopener">{t("privacy", lang)}</Link></span>
              </label>

              {error && (
                <div className="eq-err" role="alert">
                  <AlertCircle size={16} aria-hidden="true" />
                  <div>
                    <p>{error}</p>
                    {state === "error" && <a className="z-link" href={waLink(`Hello Zenith Dubai CV. My brief did not go through.${order ? ` Order ${order.ref}.` : ""}`)} target="_blank" rel="noopener noreferrer">{t("whatsapp", lang)}</a>}
                  </div>
                </div>
              )}
              <button type="submit" className="z-btn z-btn-primary" disabled={busy} aria-busy={busy}>
                {busy ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />{t("sending", lang)}</> : t("submit", lang)}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

const CSS = `
.ok-top{display:flex;justify-content:space-between;align-items:center;height:72px}
.ok-logo{width:92px;height:auto;border-radius:6px}
html[data-theme="light"] .ok-logo{filter:brightness(0) saturate(0)}
.hd-lang{display:flex;padding:3px;border:1px solid var(--z-rule-strong);border-radius:999px}
.hd-lang button{min-width:36px;height:32px;padding:0 10px;border:0;border-radius:999px;background:transparent;color:var(--z-fg-2);font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.hd-lang button[aria-pressed="true"]{background:var(--z-fg);color:var(--z-bg)}
.bf-main{max-width:760px;padding-block:40px 96px}
.bf-verified{display:flex;align-items:center;gap:8px;margin-top:22px;padding:12px 16px;border-radius:12px;border:1px solid rgba(200,169,110,.45);background:var(--z-gold-wash);color:var(--z-fg);font-size:15px}
.bf-verified svg{color:var(--z-gold-text);flex:none}
.bf-note{margin-top:22px;padding:12px 16px;border-radius:12px;border:1px dashed var(--z-rule-strong);color:var(--z-fg-2);font-size:15px}
.bf-form{display:grid;gap:18px;margin-top:30px}
.bf-two{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media (max-width:620px){.bf-two{grid-template-columns:1fr}}
.bf-field{display:grid;gap:8px;border:0;margin:0;padding:0;min-width:0}
.bf-field label,.bf-field legend{font-size:15px;font-weight:500;color:var(--z-fg)}
.bf-req{font-weight:400;font-size:13px;color:var(--z-fg-3)}
.bf-field input:not([type=checkbox]):not([type=file]),.bf-field textarea{width:100%;min-height:48px;padding:10px 14px;border-radius:12px;border:1px solid var(--z-rule-strong);background:var(--z-surface);color:var(--z-fg);font:inherit;font-size:16px}
.bf-field textarea{resize:vertical;line-height:1.55}
.bf-field input[type=file]{font-size:15px;color:var(--z-fg-2)}
.bf-field input:focus,.bf-field textarea:focus{outline:2px solid var(--z-focus);outline-offset:1px}
.bf-langs{display:flex;flex-wrap:wrap;gap:8px 22px}
.bf-langs legend{margin-bottom:8px;width:100%}
.bf-check{display:flex;align-items:flex-start;gap:10px;font-size:15px;line-height:1.5;color:var(--z-fg-2);cursor:pointer}
.bf-check input{width:18px;height:18px;margin-top:3px;flex:none;accent-color:#c8a96e}
.bf-consent{padding-top:6px}
.bf-form .z-btn{justify-self:start}
.bf-done{display:grid;gap:14px;padding-top:30px}
.bf-done svg{color:var(--z-gold-text)}
.eq-err{display:flex;gap:10px;padding:12px 14px;border-radius:12px;border:1px solid color-mix(in srgb,var(--z-error) 45%,transparent);color:var(--z-error);font-size:14px;line-height:1.5}
.eq-err svg{flex:none;margin-top:2px}
`;
