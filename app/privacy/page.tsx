// app/privacy-policy/page.tsx — Zenith Dubai CV · Privacy Policy
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ArrowLeft, Globe } from "lucide-react";

const G = "#C8A96E", INK = "#0A0907", ASH = "#F5F1EB";
const WA = "971502879462", EM = "info@zenithdubaicv.com";
const wlMsg = `https://wa.me/${WA}?text=${encodeURIComponent("Hello. I would like to discuss my career positioning.")}`;

type Lang = "en" | "ar" | "fr";
const LANGS: { code: Lang; label: string; dir: "ltr" | "rtl"; font: string }[] = [
  { code: "en", label: "EN",      dir: "ltr", font: "'Georgia','Times New Roman',serif" },
  { code: "ar", label: "العربية", dir: "rtl", font: "'Noto Naskh Arabic','Tahoma','Arial',sans-serif" },
  { code: "fr", label: "FR",      dir: "ltr", font: "'Georgia','Times New Roman',serif" },
];

const UI: Record<string, Record<Lang, string>> = {
  pageTitle:   { en: "Privacy Policy",        ar: "سياسة الخصوصية",            fr: "Politique de Confidentialité" },
  legal:       { en: "Legal",                  ar: "قانوني",                     fr: "Légal" },
  lastUpdated: { en: "Last updated: March 2025 · Zenith Dubai CV, Dubai, UAE", ar: "آخر تحديث: مارس 2025 · Zenith Dubai CV، دبي، الإمارات", fr: "Dernière mise à jour : mars 2025 · Zenith Dubai CV, Dubaï, EAU" },
  backHome:    { en: "Back to Home",           ar: "العودة إلى الرئيسية",        fr: "Retour à l'accueil" },
  emailUs:     { en: "Email Us",               ar: "راسلنا",                      fr: "Nous écrire" },
  whatsapp:    { en: "WhatsApp",               ar: "واتساب",                      fr: "WhatsApp" },
  questions:   { en: "Questions about this policy? We are happy to help.", ar: "هل لديك أسئلة حول هذه السياسة؟ يسعدنا مساعدتك.", fr: "Des questions sur cette politique ? Nous sommes là pour vous aider." },
  copyright:   { en: "© 2025 Zenith Dubai CV", ar: "© 2025 Zenith Dubai CV",     fr: "© 2025 Zenith Dubai CV" },
  privacyLink: { en: "Privacy Policy",         ar: "سياسة الخصوصية",             fr: "Politique de confidentialité" },
  termsLink:   { en: "Terms of Service",       ar: "شروط الخدمة",                fr: "Conditions d'utilisation" },
  intro: {
    en: "Zenith Dubai CV ('we', 'our', 'us') is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights in relation to it. By using our website or services, you agree to the practices described in this policy.",
    ar: "تلتزم Zenith Dubai CV بحماية معلوماتك الشخصية. توضح هذه السياسة البيانات التي نجمعها وكيفية استخدامها وحقوقك المتعلقة بها. باستخدامك موقعنا أو خدماتنا، فإنك توافق على الممارسات الواردة في هذه السياسة.",
    fr: "Zenith Dubai CV s'engage à protéger vos informations personnelles. Cette politique explique quelles données nous collectons, comment nous les utilisons et vos droits à leur égard. En utilisant notre site ou nos services, vous acceptez les pratiques décrites ici.",
  },
};

interface Sec { id: string; title: Record<Lang, string>; body: Record<Lang, string[]> }
const SECTIONS: Sec[] = [
  {
    id: "01",
    title: { en: "Information We Collect", ar: "المعلومات التي نجمعها", fr: "Informations collectées" },
    body: {
      en: ["When you submit an enquiry through our contact form, we collect your email address, the subject and content of your message, and any files you choose to attach — such as a profile photo or existing CV. We collect only what is necessary to respond to your enquiry and deliver our services.", "We do not collect personal information automatically through cookies or tracking technologies. Standard server logs may record the date, time, and IP address of requests made to our website for security and operational purposes only."],
      ar: ["عند تقديمك استفساراً عبر نموذج التواصل، نجمع عنوان بريدك الإلكتروني وموضوع رسالتك ومحتواها، وأي ملفات تختار إرفاقها — كصورة شخصية أو سيرة ذاتية. نجمع فقط ما هو ضروري للرد على استفسارك وتقديم خدماتنا.", "لا نجمع معلومات شخصية تلقائياً عبر ملفات تعريف الارتباط أو تقنيات التتبع. قد تُسجَّل في سجلات الخادم القياسية التاريخ والوقت وعنوان IP للطلبات الواردة إلى موقعنا لأغراض أمنية وتشغيلية فقط."],
      fr: ["Lorsque vous soumettez une demande via notre formulaire de contact, nous collectons votre adresse e-mail, l'objet et le contenu de votre message, ainsi que tout fichier joint. Nous ne collectons que ce qui est nécessaire pour répondre à votre demande et fournir nos services.", "Nous ne collectons pas automatiquement d'informations personnelles via des cookies ou des technologies de suivi. Les journaux serveur standard peuvent enregistrer la date, l'heure et l'adresse IP des requêtes à des fins de sécurité uniquement."],
    },
  },
  {
    id: "02",
    title: { en: "How We Use Your Information", ar: "كيفية استخدام معلوماتك", fr: "Utilisation de vos informations" },
    body: {
      en: ["The information you provide is used exclusively to respond to your enquiry, deliver the career document services you have requested, communicate updates about your project, and send your completed documents.", "We do not use your personal information for marketing purposes without your explicit consent. We do not sell, rent, or share your information with third parties for commercial purposes under any circumstances."],
      ar: ["تُستخدم المعلومات التي تقدّمها حصراً للرد على استفسارك، وتقديم خدمات وثائق المسار المهني التي طلبتها، وإرسال التحديثات المتعلقة بمشروعك، وتسليم مستنداتك المكتملة.", "لا نستخدم معلوماتك الشخصية لأغراض تسويقية دون موافقتك الصريحة. ولا نبيع معلوماتك أو نؤجّرها أو نشاركها مع أطراف ثالثة لأغراض تجارية تحت أي ظرف."],
      fr: ["Les informations que vous fournissez sont utilisées exclusivement pour répondre à votre demande, fournir les services demandés, communiquer des mises à jour et vous envoyer vos documents finalisés.", "Nous n'utilisons pas vos informations à des fins marketing sans votre consentement explicite. Nous ne vendons, ne louons ni ne partageons vos informations avec des tiers à des fins commerciales, en aucune circonstance."],
    },
  },
  {
    id: "03",
    title: { en: "Data Sharing & Disclosure", ar: "مشاركة البيانات والإفصاح عنها", fr: "Partage et divulgation des données" },
    body: {
      en: ["We do not share your personal data with any third party except where strictly necessary for service delivery — specifically, our website hosting provider (Vercel) and email infrastructure. These providers operate under their own privacy policies and are granted access only to what is technically required.", "We may disclose your information if required by applicable law or a valid legal process. In such cases, we will notify you to the extent permitted by law."],
      ar: ["لا نشارك بياناتك الشخصية مع أي طرف ثالث إلا حيثما كان ذلك ضرورياً تماماً لتقديم الخدمة — تحديداً مزوّد استضافة موقعنا (Vercel) والبنية التحتية للبريد الإلكتروني. يعمل هؤلاء المزودون وفق سياسات خصوصيتهم الخاصة.", "قد نُفصح عن معلوماتك إذا اقتضى القانون المعمول به أو إجراء قانوني صحيح ذلك. في مثل هذه الحالات، سنخطرك بالقدر المسموح به قانوناً."],
      fr: ["Nous ne partageons pas vos données personnelles avec des tiers, sauf lorsque strictement nécessaire à la prestation du service — notamment notre hébergeur (Vercel) et notre infrastructure de messagerie. Ces prestataires opèrent sous leurs propres politiques de confidentialité.", "Nous pouvons divulguer vos informations si la loi applicable ou une procédure légale valide l'exige. Nous vous en informerons dans la mesure permise par la loi."],
    },
  },
  {
    id: "04",
    title: { en: "Data Security", ar: "أمان البيانات", fr: "Sécurité des données" },
    body: {
      en: ["We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. Access to your information is limited to team members directly involved in delivering your service.", "While we take every reasonable precaution to safeguard your data, no method of transmission over the internet is entirely secure. We encourage you to contact us via our secure form or WhatsApp for sensitive communications."],
      ar: ["نطبّق تدابير تقنية وتنظيمية مناسبة لحماية بياناتك الشخصية من الوصول غير المصرّح به أو التعديل أو الإفصاح أو الإتلاف. يقتصر الوصول إلى معلوماتك على أعضاء الفريق المعنيين مباشرةً بتقديم خدمتك.", "رغم اتخاذنا كل الاحتياطات المعقولة، لا توجد طريقة نقل عبر الإنترنت آمنة بالكامل. ننصحك بالتواصل معنا عبر نموذجنا الآمن أو واتساب للمراسلات الحساسة."],
      fr: ["Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. L'accès est limité aux membres de l'équipe directement impliqués dans la prestation de votre service.", "Bien que nous prenions toutes les précautions raisonnables, aucun mode de transmission sur Internet n'est entièrement sécurisé. Nous vous encourageons à nous contacter via notre formulaire sécurisé ou WhatsApp pour les communications sensibles."],
    },
  },
  {
    id: "05",
    title: { en: "Cookies & Tracking", ar: "ملفات تعريف الارتباط والتتبع", fr: "Cookies et suivi" },
    body: {
      en: ["We do not use cookies for tracking, advertising, or analytics purposes. We do not use Google Analytics, Facebook Pixel, or any third-party behavioural tracking tools on this website.", "Your theme preference (light or dark mode) is stored locally on your device using browser localStorage. This data never leaves your device and is not transmitted to our servers."],
      ar: ["لا نستخدم ملفات تعريف الارتباط لأغراض التتبع أو الإعلان أو التحليلات. كما لا نستخدم Google Analytics أو Facebook Pixel أو أي أدوات تتبع سلوكي تابعة لجهات خارجية.", "يُحفظ تفضيل السمة (الوضع الفاتح أو الداكن) محلياً على جهازك باستخدام localStorage. لا تغادر هذه البيانات جهازك ولا تُنقل إلى خوادمنا."],
      fr: ["Nous n'utilisons pas de cookies à des fins de suivi, de publicité ou d'analyse. Nous n'utilisons pas Google Analytics, Facebook Pixel, ni aucun outil de suivi comportemental tiers sur ce site.", "Votre préférence de thème est stockée localement sur votre appareil via le localStorage. Ces données ne quittent jamais votre appareil et ne sont pas transmises à nos serveurs."],
    },
  },
  {
    id: "06",
    title: { en: "Your Rights", ar: "حقوقك", fr: "Vos droits" },
    body: {
      en: ["You have the right to access the personal information we hold about you, request correction of inaccurate data, request deletion of your data, withdraw consent for any processing based on consent, and lodge a complaint with a relevant data protection authority.", "To exercise any of these rights, please contact us at info@zenithdubaicv.com. We will respond to all legitimate requests within 30 days."],
      ar: ["يحق لك الاطلاع على معلوماتك الشخصية التي نحتفظ بها، وطلب تصحيح البيانات غير الدقيقة، وطلب حذف بياناتك، وسحب موافقتك على أي معالجة، وتقديم شكوى إلى سلطة حماية البيانات المختصة.", "لممارسة أي من هذه الحقوق، يُرجى التواصل معنا على info@zenithdubaicv.com. سنردّ على جميع الطلبات المشروعة خلال 30 يوماً."],
      fr: ["Vous avez le droit d'accéder aux informations personnelles que nous détenons, de demander la correction de données inexactes, de demander leur suppression, de retirer votre consentement, et de déposer une plainte auprès d'une autorité de protection des données.", "Pour exercer l'un de ces droits, contactez-nous à info@zenithdubaicv.com. Nous répondrons à toutes les demandes légitimes dans un délai de 30 jours."],
    },
  },
  {
    id: "07",
    title: { en: "Data Retention", ar: "الاحتفاظ بالبيانات", fr: "Conservation des données" },
    body: {
      en: ["We retain your information for the duration of your engagement with us and for a reasonable period thereafter for record-keeping, legal, and quality assurance purposes. Files and correspondence are not retained indefinitely.", "You may request deletion of your personal data at any time by contacting us at info@zenithdubaicv.com. We will process deletion requests promptly, subject to any legal obligations to retain certain records."],
      ar: ["نحتفظ بمعلوماتك طوال فترة تعاملك معنا، ولفترة معقولة بعد ذلك لأغراض حفظ السجلات والمتطلبات القانونية وضمان الجودة. لا تُحتفظ بالملفات والمراسلات إلى أجل غير مسمى.", "يمكنك طلب حذف بياناتك الشخصية في أي وقت بالتواصل معنا على info@zenithdubaicv.com. سنعالج طلبات الحذف بسرعة، مع مراعاة أي التزامات قانونية."],
      fr: ["Nous conservons vos informations pendant la durée de votre engagement et pour une période raisonnable par la suite, à des fins d'archivage, légales et d'assurance qualité. Les fichiers et la correspondance ne sont pas conservés indéfiniment.", "Vous pouvez demander la suppression de vos données à tout moment à info@zenithdubaicv.com. Nous traiterons les demandes rapidement, sous réserve d'obligations légales de conservation."],
    },
  },
  {
    id: "08",
    title: { en: "International Data Transfers", ar: "نقل البيانات الدولي", fr: "Transferts internationaux de données" },
    body: {
      en: ["Zenith Dubai CV is based in Dubai, United Arab Emirates, and serves clients globally. If you are located outside the UAE, your information may be transferred to and processed in the UAE or other countries where our service providers operate.", "By submitting your information through our website, you acknowledge and consent to this transfer. We ensure appropriate safeguards are in place for any international transfer of personal data."],
      ar: ["يقع مقر Zenith Dubai CV في دبي، الإمارات العربية المتحدة، وتخدم عملاء حول العالم. إذا كنت خارج الإمارات، فقد تُنقل معلوماتك إلى الإمارات أو إلى دول أخرى يعمل فيها مزودو خدماتنا.", "بإرسالك معلوماتك عبر موقعنا، فإنك تُقرّ بهذا النقل وتوافق عليه. نحرص على وضع ضمانات مناسبة لأي نقل دولي للبيانات الشخصية."],
      fr: ["Zenith Dubai CV est basée à Dubaï, aux Émirats arabes unis, et sert des clients à l'échelle mondiale. Si vous êtes situé en dehors des Émirats, vos informations peuvent être transférées et traitées aux Émirats ou dans d'autres pays où opèrent nos prestataires.", "En soumettant vos informations via notre site, vous reconnaissez et consentez à ce transfert. Nous veillons à ce que des garanties appropriées soient en place pour tout transfert international."],
    },
  },
  {
    id: "09",
    title: { en: "Changes to This Policy", ar: "التعديلات على هذه السياسة", fr: "Modifications de cette politique" },
    body: {
      en: ["We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The date of the most recent revision is indicated at the top of this page.", "Continued use of our website or services following any update constitutes your acceptance of the revised policy. We encourage you to review this page periodically."],
      ar: ["قد نُحدّث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو القانون المعمول به. يُشار إلى تاريخ آخر مراجعة في أعلى هذه الصفحة.", "يُعدّ استمرارك في استخدام موقعنا أو خدماتنا بعد أي تحديث بمثابة قبول للسياسة المُعدَّلة. ننصحك بمراجعة هذه الصفحة بصفة دورية."],
      fr: ["Nous pouvons mettre à jour cette politique périodiquement pour refléter les évolutions de nos pratiques ou de la législation. La date de la dernière révision est indiquée en haut de cette page.", "L'utilisation continue de notre site ou de nos services après toute mise à jour vaut acceptation de la politique révisée. Nous vous encourageons à consulter cette page régulièrement."],
    },
  },
  {
    id: "10",
    title: { en: "Contact Information", ar: "معلومات التواصل", fr: "Coordonnées" },
    body: {
      en: ["If you have any questions about this Privacy Policy or how we handle your personal data, please contact us at info@zenithdubaicv.com or via WhatsApp at +971 50 287 9462.", "Zenith Dubai CV · Dubai, United Arab Emirates · We are committed to addressing your concerns promptly and transparently."],
      ar: ["إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه أو كيفية تعاملنا مع بياناتك الشخصية، يُرجى التواصل معنا على info@zenithdubaicv.com أو عبر واتساب على 9462 287 50 971+.", "Zenith Dubai CV · دبي، الإمارات العربية المتحدة · نلتزم بمعالجة مخاوفك بسرعة وشفافية."],
      fr: ["Pour toute question concernant cette politique ou la manière dont nous traitons vos données, contactez-nous à info@zenithdubaicv.com ou via WhatsApp au +971 50 287 9462.", "Zenith Dubai CV · Dubaï, Émirats arabes unis · Nous nous engageons à traiter vos préoccupations rapidement et en toute transparence."],
    },
  },
];

function Rise({ children, d = 0, className = "" }: { children: React.ReactNode; d?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5% 0px" }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: d }}>
      {children}
    </motion.div>
  );
}

export default function PrivacyPolicy() {
  const [dark, setDark] = useState(() => { if (typeof window === "undefined") return true; const s = localStorage.getItem("z-theme"); return s !== null ? s === "dark" : true; });
  const [lang, setLang] = useState<Lang>("en");
  const [langOpen, setLangOpen] = useState(false);
  const tog = () => { const n = !dark; setDark(n); localStorage.setItem("z-theme", n ? "dark" : "light"); };
  useEffect(() => { document.title = `${UI.pageTitle[lang]} · Zenith Dubai CV`; }, [lang]);

  const LG  = LANGS.find(l => l.code === lang)!;
  const bg  = dark ? INK : ASH;
  const hi  = dark ? "#EDE8E0" : "#1A1410";
  const sub = dark ? "#857870" : "#786860";
  const bdr = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const nav = dark ? "rgba(10,9,7,0.94)" : "rgba(245,241,235,0.95)";
  const logoFilter = dark ? "brightness(1.08) drop-shadow(0 0 8px rgba(212,175,55,0.15)) drop-shadow(0 2px 6px rgba(0,0,0,0.50))" : "brightness(0) saturate(0) contrast(1)";
  const grad = `linear-gradient(${LG.dir === "rtl" ? "270deg" : "90deg"},${G}60,transparent)`;

  return (
    <div className="min-h-screen w-full transition-colors duration-700" dir={LG.dir} style={{ background: bg, color: hi, fontFamily: LG.font }}>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
      {dark && <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: `radial-gradient(ellipse 70% 50% at 50% -5%,${G}09,transparent 65%)` }} />}

      {/* ══ NAV ══ */}
      <header className="fixed top-0 inset-x-0 z-50" style={{ background: nav, backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", borderBottom: dark ? "none" : `1px solid ${bdr}` }}>
        {dark && <div aria-hidden className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.12) 15%,rgba(212,175,55,0.55) 50%,rgba(212,175,55,0.12) 85%,transparent)" }} />}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8" style={{ height: "76px" }}>
          <a href="/" style={{ lineHeight: 0 }}>
            <img src="/images/logo.png" alt="Zenith Dubai CV" style={{ height: "auto", width: "100px", objectFit: "contain", display: "block", borderRadius: "8px", filter: logoFilter, transition: "filter 0.4s ease", paddingTop: "4px" }} />
          </a>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button type="button" onClick={() => setLangOpen(o => !o)} className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.15em] uppercase px-3 rounded-full" style={{ border: `1px solid ${dark ? "rgba(200,169,110,0.28)" : `${G}32`}`, color: dark ? "#C8A96E" : G, height: "32px", fontFamily: "sans-serif", minWidth: "62px", justifyContent: "center", background: "transparent", transition: "border-color 0.25s ease" }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = dark ? "rgba(212,175,55,0.55)" : `${G}55`; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = dark ? "rgba(200,169,110,0.28)" : `${G}32`; }}>
                <Globe size={10} strokeWidth={1.5} />{LG.label}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.2 }} className="absolute top-10 right-0 rounded-xl overflow-hidden z-50" style={{ background: dark ? "#111009" : "#F5F1EB", border: dark ? "1px solid rgba(200,169,110,0.16)" : `1px solid ${bdr}`, boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.65)" : "0 8px 24px rgba(0,0,0,0.12)", minWidth: "136px" }}>
                    {LANGS.map(l => (
                      <button key={l.code} type="button" onClick={() => { setLang(l.code); setLangOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[11px]" style={{ color: l.code === lang ? (dark ? "#D4AF37" : G) : hi, fontFamily: "sans-serif", background: l.code === lang ? (dark ? "rgba(212,175,55,0.07)" : `${G}07`) : "transparent", fontWeight: l.code === lang ? 600 : 400, border: "none", cursor: "pointer", textAlign: "start" }}>
                        {l.code === lang && <span className="h-1 w-1 rounded-full shrink-0" style={{ background: dark ? "#D4AF37" : G }} />}
                        <span style={{ marginInlineStart: l.code === lang ? "0" : "9px" }}>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a href="/" className="hidden sm:flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] uppercase transition-opacity hover:opacity-70" style={{ color: dark ? "rgba(200,169,110,0.55)" : `${hi}65`, fontFamily: "sans-serif", textDecoration: "none" }}>
              <ArrowLeft size={11} strokeWidth={1.5} />{UI.backHome[lang]}
            </a>
            <button type="button" onClick={tog} aria-label="Toggle theme" className="flex items-center justify-center rounded-full" style={{ border: dark ? "1px solid rgba(200,169,110,0.16)" : `1px solid ${bdr}`, width: "32px", height: "32px", opacity: 0.45, background: "transparent", transition: "opacity 0.2s ease" }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.80"; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.45"; }}>
              {dark ? <Sun size={12} color="#D4AF37" strokeWidth={1.5} /> : <Moon size={12} color={hi} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* ══ CONTENT ══ */}
      <main className="pt-[76px]">
        <div className="mx-auto max-w-3xl px-8 py-24">
          <Rise d={0.1}>
            <p className="text-[10px] font-medium tracking-[0.42em] uppercase mb-5" style={{ color: G, fontFamily: "sans-serif" }}>{UI.legal[lang]}</p>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight leading-[1.08] mb-5" style={{ color: hi }}>{UI.pageTitle[lang]}</h1>
            <p className="text-sm mb-16" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>{UI.lastUpdated[lang]}</p>
            <div className="h-px mb-16" style={{ background: grad }} />
          </Rise>
          <Rise d={0.15} className="mb-4">
            <p className="text-base leading-[1.95]" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>{UI.intro[lang]}</p>
          </Rise>
          <div className="flex flex-col">
            {SECTIONS.map((s, i) => (
              <Rise key={s.id} d={0.03 * i}>
                <div className="flex gap-8 py-10" style={{ borderTop: `1px solid ${bdr}` }}>
                  <div className="shrink-0 w-7 pt-1">
                    <span className="text-[10px]" style={{ color: G, fontFamily: "sans-serif", opacity: 0.5, fontWeight: 500 }}>{s.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-normal mb-5 tracking-tight" style={{ color: hi }}>{s.title[lang]}</h2>
                    {s.body[lang].map((para, j) => (
                      <p key={j} className="text-sm leading-[1.95] mb-4 last:mb-0" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>{para}</p>
                    ))}
                  </div>
                </div>
              </Rise>
            ))}
          </div>
          <Rise d={0.1} className="mt-16">
            <div className="h-px mb-12" style={{ background: grad }} />
            <p className="text-sm leading-[1.9] mb-8" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>{UI.questions[lang]}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`mailto:${EM}`} className="flex items-center justify-center gap-2 px-8 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-85" style={{ background: G, color: INK, height: "48px", fontFamily: "sans-serif" }}>{UI.emailUs[lang]}</a>
              <a href={wlMsg} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-8 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-70" style={{ border: `1px solid ${G}40`, color: G, height: "48px", fontFamily: "sans-serif" }}>{UI.whatsapp[lang]}</a>
            </div>
          </Rise>
        </div>

        {/* ══ FOOTER ══ */}
        <footer className="relative py-10 px-8" style={{ borderTop: dark ? "none" : `1px solid ${bdr}` }}>
          {dark && <div aria-hidden className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.10) 15%,rgba(212,175,55,0.55) 50%,rgba(212,175,55,0.10) 85%,transparent)" }} />}
          <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="text-[10px]" style={{ color: dark ? "rgba(200,169,110,0.20)" : `${hi}30`, fontFamily: "sans-serif" }}>{UI.copyright[lang]}</p>
            <div className="flex items-center gap-4">
              <a href="/privacy-policy" className="text-[10px]" style={{ color: G, fontFamily: "sans-serif", textDecoration: "none", opacity: 0.65 }}>{UI.privacyLink[lang]}</a>
              <span style={{ color: bdr, fontSize: "10px" }}>·</span>
              <a href="/terms-of-service" className="text-[10px] transition-opacity hover:opacity-70" style={{ color: dark ? "rgba(200,169,110,0.35)" : `${hi}45`, fontFamily: "sans-serif", textDecoration: "none" }}>{UI.termsLink[lang]}</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}