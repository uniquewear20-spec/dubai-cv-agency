"use client";
// components/review/ReviewApp.tsx — clients tell us how their order went. Publishing is opt-in:
// the consent box is unticked by default, and nothing appears on the site until a person has
// matched the statement to a real order (see lib/testimonials.ts).

import React, { useState } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/ContactFooter";
import { useSitePrefs } from "@/components/site/useSitePrefs";
import { pick, type L10n } from "@/lib/site";
import { CONSENT_TEXT, REVIEW_LIMITS, REVIEW_SERVICES, type ReviewDisplay, type ReviewService } from "@/lib/review";

type L = L10n;

const T = {
  skip: { en: "Skip to content", fr: "Aller au contenu", ar: "انتقل إلى المحتوى" } as L,
  h1: { en: "Share your experience", fr: "Partagez votre expérience", ar: "شارك تجربتك" } as L,
  intro: {
    en: "If Zenith worked on your CV, profile or applications, tell us how it went. We read every message. Nothing is published unless you tick the consent box, and we confirm with you first.",
    fr: "Si Zenith a travaillé sur votre CV, votre profil ou vos candidatures, dites-nous comment cela s'est passé. Nous lisons chaque message. Rien n'est publié sans que vous cochiez la case d'accord, et nous vous le confirmons avant.",
    ar: "إذا عملت Zenith على سيرتك أو ملفك أو طلباتك، أخبرنا كيف كانت التجربة. نقرأ كل رسالة. لا يُنشر شيء ما لم تحدد خانة الموافقة، ونتأكد معك قبل النشر.",
  } as L,
  name: { en: "Your name", fr: "Votre nom", ar: "اسمك" } as L,
  email: { en: "Email used for your order", fr: "E-mail utilisé pour votre commande", ar: "البريد الإلكتروني المستخدم في طلبك" } as L,
  order: { en: "Order reference (optional)", fr: "Référence de commande (facultatif)", ar: "رقم الطلب (اختياري)" } as L,
  service: { en: "What we worked on", fr: "Ce sur quoi nous avons travaillé", ar: "ما الذي عملنا عليه" } as L,
  role: { en: "Your role and target market (optional)", fr: "Votre poste et marché visé (facultatif)", ar: "دورك والسوق المستهدف (اختياري)" } as L,
  rolePh: { en: "e.g. Finance manager, moving to Canada", fr: "ex. Responsable financier, projet au Canada", ar: "مثال: مدير مالي، أنتقل إلى كندا" } as L,
  message: { en: "Your experience", fr: "Votre expérience", ar: "تجربتك" } as L,
  messageHint: {
    en: "What did you need, what did we do, and what changed for you?",
    fr: "De quoi aviez-vous besoin, qu'avons-nous fait, et qu'est-ce qui a changé pour vous ?",
    ar: "ماذا كنت تحتاج، وماذا فعلنا، وما الذي تغيّر بالنسبة لك؟",
  } as L,
  display: { en: "If we publish it, show my name as", fr: "En cas de publication, afficher mon nom ainsi", ar: "في حال النشر، يظهر اسمي هكذا" } as L,
  full: { en: "Full name", fr: "Nom complet", ar: "الاسم الكامل" } as L,
  initial: { en: "First name and initial", fr: "Prénom et initiale", ar: "الاسم الأول والحرف الأول من اسم العائلة" } as L,
  anonymous: { en: "Don't show my name", fr: "Ne pas afficher mon nom", ar: "لا تُظهر اسمي" } as L,
  consentTitle: { en: "Permission to publish", fr: "Autorisation de publication", ar: "الإذن بالنشر" } as L,
  privacy: {
    en: "We use these details only to check your order and, if you agree, to publish your statement as you chose.",
    fr: "Nous utilisons ces informations uniquement pour vérifier votre commande et, si vous l'acceptez, publier votre témoignage comme vous l'avez choisi.",
    ar: "نستخدم هذه البيانات فقط للتحقق من طلبك، ولنشر رأيك بالطريقة التي اخترتها إذا وافقت.",
  } as L,
  privacyLink: { en: "Privacy policy", fr: "Politique de confidentialité", ar: "سياسة الخصوصية" } as L,
  send: { en: "Send", fr: "Envoyer", ar: "إرسال" } as L,
  sending: { en: "Sending…", fr: "Envoi…", ar: "جارٍ الإرسال…" } as L,
  sent: { en: "Thank you. Your message has reached us.", fr: "Merci. Votre message nous est bien parvenu.", ar: "شكراً لك. وصلتنا رسالتك." } as L,
  sentPublish: {
    en: "Before anything is published, we'll check it against your order and confirm with you by email.",
    fr: "Avant toute publication, nous la rapprocherons de votre commande et vous le confirmerons par e-mail.",
    ar: "قبل نشر أي شيء، سنطابقها مع طلبك ونتأكد معك عبر البريد الإلكتروني.",
  } as L,
  required: { en: "required", fr: "obligatoire", ar: "إلزامي" } as L,
  chars: { en: "characters", fr: "caractères", ar: "حرفاً" } as L,
};

const SERVICE_LABEL: Record<ReviewService, L> = {
  cv: { en: "CV writing or design", fr: "Rédaction ou design de CV", ar: "كتابة السيرة أو تصميمها" },
  linkedin: { en: "LinkedIn profile", fr: "Profil LinkedIn", ar: "ملف LinkedIn" },
  package: { en: "A package", fr: "Une formule", ar: "باقة" },
  "ai-tools": { en: "AI job agent or interview coach", fr: "Agent emploi IA ou coach d'entretien", ar: "وكيل الوظائف أو مدرّب المقابلات" },
  website: { en: "A website", fr: "Un site web", ar: "موقع إلكتروني" },
  other: { en: "Something else", fr: "Autre chose", ar: "شيء آخر" },
};

const ERRORS: Record<string, L> = {
  missing: { en: "Please fill in your name, email and experience.", fr: "Merci d'indiquer votre nom, votre e-mail et votre expérience.", ar: "يرجى إدخال اسمك وبريدك الإلكتروني وتجربتك." },
  email: { en: "Check the email address: it doesn't look complete.", fr: "Vérifiez l'adresse e-mail : elle semble incomplète.", ar: "تحقق من البريد الإلكتروني؛ يبدو غير مكتمل." },
  short: { en: `Write at least ${REVIEW_LIMITS.messageMin} characters about your experience.`, fr: `Écrivez au moins ${REVIEW_LIMITS.messageMin} caractères sur votre expérience.`, ar: `اكتب ${REVIEW_LIMITS.messageMin} حرفاً على الأقل عن تجربتك.` },
  rate: { en: "Too many messages from this connection. Try again in an hour, or email info@zenithdubaicv.com.", fr: "Trop de messages depuis cette connexion. Réessayez dans une heure, ou écrivez à info@zenithdubaicv.com.", ar: "رسائل كثيرة من هذا الاتصال. حاول بعد ساعة أو راسلنا على info@zenithdubaicv.com." },
  unavailable: { en: "The form can't send right now. Email info@zenithdubaicv.com and we'll take it from there.", fr: "Le formulaire ne peut pas envoyer pour le moment. Écrivez à info@zenithdubaicv.com.", ar: "لا يمكن الإرسال الآن. راسلنا على info@zenithdubaicv.com." },
  invalid: { en: "Something in the form isn't valid. Check each field and send again.", fr: "Un champ n'est pas valide. Vérifiez chaque champ et renvoyez.", ar: "أحد الحقول غير صالح. تحقق من الحقول وأعد الإرسال." },
};

export default function ReviewApp() {
  const { dark, lang, setLang, toggleTheme } = useSitePrefs();
  const p = (v: L) => pick(v, lang);
  const [form, setForm] = useState({ name: "", email: "", order: "", service: "cv" as ReviewService, role: "", message: "", display: "initial" as ReviewDisplay, publish: false, website: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { setState("error"); setError("missing"); return; }
    if (form.message.trim().length < REVIEW_LIMITS.messageMin) { setState("error"); setError("short"); return; }
    setState("sending");
    try {
      const r = await fetch("/api/review/", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, lang }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setState("sent"); return; }
      setState("error"); setError(typeof d.error === "string" && ERRORS[d.error] ? d.error : "unavailable");
    } catch {
      setState("error"); setError("unavailable");
    }
  }

  return (
    <div className="zs rv" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <style href="zenith-review" precedence="medium">{CSS}</style>
      <a href="#main" className="z-skip">{p(T.skip)}</a>
      <SiteHeader lang={lang} setLang={setLang} dark={dark} toggleTheme={toggleTheme} onHome={false} />
      <main id="main" tabIndex={-1}>
        <header className="rv-hero">
          <div className="z-wrap">
            <h1 className="z-h1 rv-h1">{p(T.h1)}</h1>
            <p className="rv-intro">{p(T.intro)}</p>
          </div>
        </header>
        <section className="rv-paper">
          <div className="z-wrap">
            {state === "sent" ? (
              <div className="rv-done" role="status">
                <p className="rv-done-h">{p(T.sent)}</p>
                {form.publish && <p>{p(T.sentPublish)}</p>}
              </div>
            ) : (
              <form className="rv-form" onSubmit={submit} noValidate>
                <div className="rv-row">
                  <label className="rv-field">
                    <span>{p(T.name)} <abbr title={p(T.required)}>*</abbr></span>
                    <input value={form.name} onChange={e => set("name", e.target.value)} maxLength={REVIEW_LIMITS.name} autoComplete="name" required />
                  </label>
                  <label className="rv-field">
                    <span>{p(T.email)} <abbr title={p(T.required)}>*</abbr></span>
                    <input type="email" dir="ltr" value={form.email} onChange={e => set("email", e.target.value)} maxLength={REVIEW_LIMITS.email} autoComplete="email" required />
                  </label>
                </div>
                <div className="rv-row">
                  <label className="rv-field">
                    <span>{p(T.service)}</span>
                    <select value={form.service} onChange={e => set("service", e.target.value as ReviewService)}>
                      {REVIEW_SERVICES.map(s => <option key={s} value={s}>{p(SERVICE_LABEL[s])}</option>)}
                    </select>
                  </label>
                  <label className="rv-field">
                    <span>{p(T.order)}</span>
                    <input value={form.order} onChange={e => set("order", e.target.value)} maxLength={REVIEW_LIMITS.order} dir="ltr" />
                  </label>
                </div>
                <label className="rv-field">
                  <span>{p(T.role)}</span>
                  <input value={form.role} onChange={e => set("role", e.target.value)} maxLength={REVIEW_LIMITS.role} placeholder={p(T.rolePh)} />
                </label>
                <label className="rv-field">
                  <span>{p(T.message)} <abbr title={p(T.required)}>*</abbr></span>
                  <small id="rv-msg-hint">{p(T.messageHint)}</small>
                  <textarea value={form.message} onChange={e => set("message", e.target.value)} rows={7} maxLength={REVIEW_LIMITS.messageMax} aria-describedby="rv-msg-hint rv-msg-count" required />
                  <small id="rv-msg-count" className="rv-count">{form.message.length} / {REVIEW_LIMITS.messageMax} {p(T.chars)}</small>
                </label>
                <fieldset className="rv-set">
                  <legend>{p(T.display)}</legend>
                  {(["full", "initial", "anonymous"] as ReviewDisplay[]).map(d => (
                    <label key={d} className="rv-choice">
                      <input type="radio" name="display" value={d} checked={form.display === d} onChange={() => set("display", d)} />
                      <span>{p(T[d])}</span>
                    </label>
                  ))}
                </fieldset>
                <fieldset className="rv-set">
                  <legend>{p(T.consentTitle)}</legend>
                  <label className="rv-choice rv-consent">
                    <input type="checkbox" checked={form.publish} onChange={e => set("publish", e.target.checked)} />
                    <span>{p(CONSENT_TEXT)}</span>
                  </label>
                </fieldset>
                <div className="rv-trap" aria-hidden="true">
                  <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => set("website", e.target.value)} /></label>
                </div>
                <p className="rv-privacy">{p(T.privacy)} <a href="/privacy/">{p(T.privacyLink)}</a></p>
                <div className="rv-actions">
                  <button type="submit" className="z-btn z-btn-primary" disabled={state === "sending"}>{state === "sending" ? p(T.sending) : p(T.send)}</button>
                  <p className="rv-error" role="alert">{state === "error" ? p(ERRORS[error] ?? ERRORS.unavailable) : ""}</p>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} onHome={false} />
    </div>
  );
}

const CSS = `
.rv-hero{padding-block:clamp(64px,9vw,120px) clamp(40px,5vw,64px)}
.rv-h1{max-width:14ch}
.rv-intro{margin-top:20px;font-size:clamp(17px,1.4vw,19px);line-height:1.65;color:var(--z-fg-2);max-width:60ch}
.rv-paper{--ink:#1A1410;--ink2:#4C4037;--ink3:#6B5D52;--rule:rgba(26,20,16,.22);background:#F5F1EB;color:var(--ink);padding-block:clamp(56px,7vw,96px)}
html[data-theme="light"] .rv-paper{background:#ECE4D8}
.rv-form{display:grid;gap:24px;max-width:760px}
.rv-row{display:grid;gap:24px}
@media (min-width:720px){.rv-row{grid-template-columns:1fr 1fr}}
.rv-field{display:grid;gap:8px}
.rv-field>span,.rv-set legend{font-size:15px;font-weight:600;color:var(--ink)}
.rv-field abbr{text-decoration:none;color:#7D5F22}
.rv-field small{font-size:14px;color:var(--ink3)}
.rv-field input,.rv-field select,.rv-field textarea{font:inherit;font-size:16px;color:var(--ink);background:#FFFDF9;border:1px solid var(--rule);border-radius:6px;padding:12px 14px;min-height:48px;width:100%}
.rv-field textarea{resize:vertical;line-height:1.6}
.rv-field input:focus-visible,.rv-field select:focus-visible,.rv-field textarea:focus-visible,.rv-choice input:focus-visible{outline:2px solid #7D5F22;outline-offset:2px}
.rv-count{text-align:end}
.rv-set{border:0;margin:0;padding:0;display:grid;gap:10px}
.rv-set legend{margin-bottom:10px}
.rv-choice{display:flex;gap:12px;align-items:flex-start;font-size:15.5px;line-height:1.55;color:var(--ink2);cursor:pointer}
.rv-choice input{width:20px;height:20px;margin-top:2px;accent-color:#7D5F22;flex:none}
.rv-consent span{max-width:64ch}
.rv-trap{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.rv-privacy{font-size:14px;line-height:1.6;color:var(--ink3)}
.rv-privacy a,.rv-done a{color:#7D5F22}
.rv-actions{display:flex;flex-wrap:wrap;gap:16px;align-items:center}
.rv-error{font-size:15px;color:#A03232;min-height:1em}
.rv-done{max-width:640px;display:grid;gap:12px}
.rv-done-h{font-family:var(--font-serif),Georgia,serif;font-size:clamp(26px,2.6vw,34px);line-height:1.2;color:var(--ink)}
[dir="rtl"] .rv-done-h{font-family:var(--font-arabic-serif),serif}
.rv-done p{color:var(--ink2);font-size:17px;line-height:1.65}
`;
