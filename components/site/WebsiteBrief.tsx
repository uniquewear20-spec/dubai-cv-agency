"use client";
// components/site/WebsiteBrief.tsx — the brief for a business website: what the site is for, its
// pages and features, languages, examples, budget and timing, plus the logo and a brand document.
// Sent through the site's contact form (/api/contact), so it reaches info@zenithdubaicv.com.
import React, { useEffect, useId, useState } from "react";
import { AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
import { CONTACT_EMAIL, pick, type L10n, type Lang } from "@/lib/site";
import { ENQUIRY_CSS } from "./EnquiryModal";

const L = (en: string, fr: string, ar: string): L10n => ({ en, fr, ar });
const T = {
  title: L("Your website brief", "Le brief de votre site", "ملخص موقعك"),
  sub: L("Answer what you can; we reply within 24 hours with a quote and a timeline.", "Répondez à ce que vous pouvez ; nous répondons sous 24 heures avec un devis et un délai.", "أجب عمّا تستطيع، وسنرد خلال 24 ساعة بعرض سعر وجدول زمني."),
  email: L("Your email", "Votre e-mail", "بريدك الإلكتروني"),
  business: L("Business or brand name", "Nom de l'entreprise ou de la marque", "اسم النشاط أو العلامة التجارية"),
  phone: L("WhatsApp number (optional)", "Numéro WhatsApp (facultatif)", "رقم واتساب (اختياري)"),
  type: L("Type of website", "Type de site", "نوع الموقع"),
  current: L("Current website, if any", "Site actuel, s'il existe", "موقعك الحالي إن وجد"),
  pages: L("Pages you need", "Pages nécessaires", "الصفحات المطلوبة"),
  features: L("Features", "Fonctionnalités", "الخصائص"),
  styles: L("Style and effects", "Style et effets", "الأسلوب والمؤثرات"),
  langs: L("Website languages", "Langues du site", "لغات الموقع"),
  likes: L("Websites you like, and why", "Sites que vous aimez, et pourquoi", "مواقع تعجبك، ولماذا"),
  budget: L("Budget", "Budget", "الميزانية"),
  when: L("When do you need it?", "Pour quand ?", "متى تحتاجه؟"),
  domain: L("Domain name", "Nom de domaine", "اسم النطاق"),
  about: L("Tell us about the project", "Parlez-nous du projet", "حدّثنا عن المشروع"),
  logo: L("Logo (optional): JPG, PNG or WebP", "Logo (facultatif) : JPG, PNG ou WebP", "الشعار (اختياري): JPG أو PNG أو WebP"),
  doc: L("Brief or brand document (optional): PDF or Word", "Brief ou charte (facultatif) : PDF ou Word", "ملف الملخص أو الهوية (اختياري): PDF أو Word"),
  files: L("Up to 4 MB in total. Send more files by email after we reply.", "4 Mo au total. Envoyez d'autres fichiers par e-mail après notre réponse.", "حتى 4 ميغابايت إجمالاً. أرسل ملفات أخرى بالبريد بعد ردّنا."),
  send: L("Send my brief", "Envoyer mon brief", "أرسل الملخص"),
  sending: L("Sending…", "Envoi…", "جارٍ الإرسال…"),
  sent: L("Brief received", "Brief reçu", "تم استلام الملخص"),
  sentBody: L("Thank you. We reply to {email} within 24 hours.", "Merci. Nous répondons à {email} sous 24 heures.", "شكراً لك. سنرد على {email} خلال 24 ساعة."),
  close: L("Close", "Fermer", "إغلاق"),
  needEmail: L("Enter a valid email address.", "Saisissez une adresse e-mail valide.", "أدخل بريداً إلكترونياً صحيحاً."),
  failed: L("The brief could not be sent. Try again, or email us.", "Le brief n'a pas pu être envoyé. Réessayez ou écrivez-nous.", "تعذّر إرسال الملخص. أعد المحاولة أو راسلنا بالبريد."),
};
const TYPES = ["Real estate", "Beauty & salon", "Restaurant & café", "Hotel & travel", "Clinic & healthcare", "Online store", "Law & consulting", "Fitness & wellness", "Construction & interiors", "Events & weddings", "Landing page", "Booking website", "Other"];
const PAGES = ["Home", "About", "Services", "Gallery / portfolio", "Prices", "Booking", "Shop", "Blog / news", "FAQ", "Contact"];
const FEATURES = ["Online booking", "Online payments", "WhatsApp button", "Contact form", "Google Maps", "Property or product listings", "Customer accounts", "Newsletter sign-up", "Reviews"];
const LANGS = ["English", "Arabic", "French", "Other"];
export const STYLES = ["3D & interactive", "Scroll animations", "Luxury minimal", "Bold & editorial", "Video background", "Dark & elegant", "Arabic & English (RTL)", "E-commerce with payments", "AI chat assistant", "Custom illustrations"];
const BUDGETS = ["AED 1,000 – 2,000", "AED 2,000 – 5,000", "AED 5,000 – 10,000", "AED 10,000 +", "Not sure yet"];
const WHEN = ["Within 2 weeks", "Within a month", "In 1 – 3 months", "Flexible"];
const DOMAINS = ["I have a domain", "I need a domain", "Not sure"];

export default function WebsiteBrief({ open, onClose, lang, preset, style }: { open: boolean; onClose: () => void; lang: Lang; preset?: string; style?: string }) {
  const uid = useId();
  const t = (k: keyof typeof T) => pick(T[k], lang);
  const [f, setF] = useState({ email: "", business: "", phone: "", type: preset ?? TYPES[0], current: "", likes: "", budget: BUDGETS[0], when: WHEN[3], domain: DOMAINS[2], about: "" });
  const [pages, setPages] = useState<string[]>(["Home", "About", "Services", "Contact"]);
  const [features, setFeatures] = useState<string[]>(["WhatsApp button", "Contact form"]);
  const [langs, setLangs] = useState<string[]>(["English"]);
  const [styles, setStyles] = useState<string[]>(style ? [style] : []);
  const [logo, setLogo] = useState<File | null>(null);
  const [doc, setDoc] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;

  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const busy = state === "sending";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) { setError(t("needEmail")); return; }
    setError(null);
    setState("sending");
    const message = [
      `Business: ${f.business || "-"}`, `WhatsApp: ${f.phone || "-"}`, `Type of website: ${f.type}`, `Current website: ${f.current || "-"}`,
      `Pages: ${pages.join(", ") || "-"}`, `Features: ${features.join(", ") || "-"}`, `Style and effects: ${styles.join(", ") || "-"}`, `Languages: ${langs.join(", ") || "-"}`,
      `Websites they like: ${f.likes || "-"}`, `Budget: ${f.budget}`, `Timing: ${f.when}`, `Domain: ${f.domain}`, "", `About the project:`, f.about || "-",
    ].join("\n").slice(0, 4900);
    const fd = new FormData();
    fd.append("senderEmail", f.email.trim());
    fd.append("subject", `Website project: ${f.type}${f.business ? ` for ${f.business}` : ""}`.slice(0, 150));
    fd.append("message", message);
    fd.append("website", "");
    if (doc) fd.append("cv", doc);
    if (logo) fd.append("photo", logo);
    try {
      const res = await fetch("/api/contact/", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
    } catch {
      setState("error");
      setError(t("failed"));
    }
  };

  const Checks = ({ items, value, set }: { items: string[]; value: string[]; set: (v: string[]) => void }) => (
    <div className="wb-checks">{items.map(i => (
      <label key={i} className="wb-check"><input type="checkbox" checked={value.includes(i)} onChange={() => toggle(value, set, i)} disabled={busy} /> {i}</label>
    ))}</div>
  );
  const field = (k: keyof typeof f) => ({ value: f[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value }), disabled: busy });

  return (
    <div className="eq" role="dialog" aria-modal="true" aria-labelledby={`${uid}-t`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <style href="zenith-enquiry" precedence="medium">{ENQUIRY_CSS}</style>
      <style href="zenith-website-brief" precedence="medium">{CSS}</style>
      <div className="eq-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="eq-panel">
        <div className="eq-head">
          <div>
            <h2 id={`${uid}-t`} className="z-h3">{t("title")}</h2>
            <p className="z-small">{t("sub")}</p>
          </div>
          <button type="button" className="hd-icon" onClick={onClose} aria-label={t("close")}><X size={18} /></button>
        </div>
        {state === "sent" ? (
          <div className="eq-done" role="status">
            <CheckCircle size={28} aria-hidden="true" />
            <p className="z-h3">{t("sent")}</p>
            <p className="z-small">{t("sentBody").replace("{email}", f.email.trim())}</p>
            <button type="button" className="z-btn z-btn-primary" onClick={onClose}>{t("close")}</button>
          </div>
        ) : (
          <form className="eq-form" onSubmit={submit} noValidate>
            <label htmlFor={`${uid}-e`}>{t("email")}</label>
            <input id={`${uid}-e`} type="email" autoComplete="email" dir="ltr" required {...field("email")} />
            <label htmlFor={`${uid}-b`}>{t("business")}</label>
            <input id={`${uid}-b`} type="text" maxLength={120} {...field("business")} />
            <label htmlFor={`${uid}-p`}>{t("phone")}</label>
            <input id={`${uid}-p`} type="tel" dir="ltr" maxLength={30} {...field("phone")} />
            <label htmlFor={`${uid}-ty`}>{t("type")}</label>
            <select id={`${uid}-ty`} {...field("type")}>{TYPES.map(x => <option key={x}>{x}</option>)}</select>
            <label htmlFor={`${uid}-c`}>{t("current")}</label>
            <input id={`${uid}-c`} type="url" dir="ltr" placeholder="https://" maxLength={200} {...field("current")} />
            <p className="wb-l">{t("pages")}</p><Checks items={PAGES} value={pages} set={setPages} />
            <p className="wb-l">{t("features")}</p><Checks items={FEATURES} value={features} set={setFeatures} />
            <p className="wb-l">{t("styles")}</p><Checks items={STYLES} value={styles} set={setStyles} />
            <p className="wb-l">{t("langs")}</p><Checks items={LANGS} value={langs} set={setLangs} />
            <label htmlFor={`${uid}-li`}>{t("likes")}</label>
            <textarea id={`${uid}-li`} rows={2} maxLength={600} {...field("likes")} />
            <div className="wb-row">
              <div><label htmlFor={`${uid}-bu`}>{t("budget")}</label><select id={`${uid}-bu`} {...field("budget")}>{BUDGETS.map(x => <option key={x}>{x}</option>)}</select></div>
              <div><label htmlFor={`${uid}-w`}>{t("when")}</label><select id={`${uid}-w`} {...field("when")}>{WHEN.map(x => <option key={x}>{x}</option>)}</select></div>
            </div>
            <label htmlFor={`${uid}-d`}>{t("domain")}</label>
            <select id={`${uid}-d`} {...field("domain")}>{DOMAINS.map(x => <option key={x}>{x}</option>)}</select>
            <label htmlFor={`${uid}-a`}>{t("about")}</label>
            <textarea id={`${uid}-a`} rows={4} maxLength={2500} {...field("about")} />
            <label htmlFor={`${uid}-lo`}>{t("logo")}</label>
            <input id={`${uid}-lo`} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setLogo(e.target.files?.[0] ?? null)} disabled={busy} />
            <label htmlFor={`${uid}-do`}>{t("doc")}</label>
            <input id={`${uid}-do`} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e => setDoc(e.target.files?.[0] ?? null)} disabled={busy} />
            <p className="z-micro">{t("files")}</p>
            {error && <div className="eq-err" role="alert"><AlertCircle size={16} aria-hidden="true" /><div><p>{error}</p></div></div>}
            <button type="submit" className="z-btn z-btn-primary z-btn-block" disabled={busy} aria-busy={busy}>
              {busy ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />{t("sending")}</> : t("send")}
            </button>
            <p className="z-micro" style={{ textAlign: "center" }} dir="ltr">{CONTACT_EMAIL}</p>
          </form>
        )}
      </div>
    </div>
  );
}

const CSS = `
.wb-l{margin-top:14px;font-size:14px;font-weight:600;color:var(--z-fg)}
.wb-checks{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.wb-check{display:inline-flex!important;align-items:center;gap:6px;padding:7px 12px;border:1px solid var(--z-rule-strong);border-radius:999px;font-size:13.5px!important;font-weight:400!important;cursor:pointer;margin:0!important}
.wb-check:has(input:checked){border-color:var(--z-gold);background:var(--z-gold-wash);color:var(--z-gold-text)}
.wb-check input{width:auto!important;margin:0;accent-color:var(--z-gold)}
.wb-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.wb-row select{width:100%}
@media (max-width:520px){.wb-row{grid-template-columns:1fr}}
`;
