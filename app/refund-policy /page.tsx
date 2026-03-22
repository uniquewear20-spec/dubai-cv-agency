// app/refund/page.tsx — Zenith Dubai CV · Refund Policy
"use client";
import React, { useState, useEffect } from "react";
import { Sun, Moon, Mail } from "lucide-react";

// ── Tokens ───────────────────────────────────────────────────────────────────
const G = "#C8A96E", INK = "#0A0907", ASH = "#F5F1EB";
const WA = "971502879462", EM = "info@zenithdubaicv.com";

// ── Language ──────────────────────────────────────────────────────────────────
type Lang = "en" | "ar" | "fr";
const LANGS: { code: Lang; label: string; dir: "ltr" | "rtl"; font: string }[] = [
  { code: "en", label: "EN",      dir: "ltr", font: "'Georgia','Times New Roman',serif" },
  { code: "ar", label: "العربية", dir: "rtl", font: "'Noto Naskh Arabic','Tahoma','Arial',sans-serif" },
  { code: "fr", label: "FR",      dir: "ltr", font: "'Georgia','Times New Roman',serif" },
];

// ── Copy ──────────────────────────────────────────────────────────────────────
const COPY = {
  en: {
    badge: "Legal",
    title: "Refund Policy",
    updated: "Effective: March 2025",
    intro: "We believe in complete transparency and your total confidence when investing in your career. Our refund policy is simple, unconditional, and designed to give you peace of mind.",
    sections: [
      {
        title: "7-Day Refund Window",
        body: "We offer a full, unconditional refund on all purchases made within 7 days. If for any reason you are not satisfied, simply contact us within 7 days of your purchase date and we will process a complete refund — no questions asked.",
      },
      {
        title: "How to Request a Refund",
        body: "To request a refund, please contact us at info@zenithdubaicv.com with your purchase details. We will acknowledge your request promptly and begin processing immediately.",
      },
      {
        title: "Processing Time",
        body: "All approved refunds are processed within 5–10 business days. The refund will be returned to your original payment method. Processing times may vary slightly depending on your bank or card issuer.",
      },
      {
        title: "Contact",
        body: "For any refund requests or questions regarding this policy, please reach us at info@zenithdubaicv.com. We are committed to resolving all matters promptly and professionally.",
      },
    ],
    highlight: "Full refund within 7 days of purchase — no conditions, no exceptions.",
    emailUs: "Request a Refund",
    whatsapp: "WhatsApp",
    privacyLink: "Privacy Policy",
    termsLink: "Terms of Service",
    refundLink: "Refund Policy",
    copyright: `© ${new Date().getFullYear()} Zenith Dubai CV`,
  },
  ar: {
    badge: "قانوني",
    title: "سياسة الاسترداد",
    updated: "السريان: مارس 2025",
    intro: "نؤمن بالشفافية الكاملة وثقتك التامة عند الاستثمار في مسيرتك المهنية. سياسة الاسترداد لدينا بسيطة وغير مشروطة، وصُمِّمت لمنحك راحة البال الكاملة.",
    sections: [
      {
        title: "نافذة استرداد 7 أيام",
        body: "نقدّم استرداداً كاملاً وغير مشروط على جميع المشتريات خلال 7 أيام. إذا لم تكن راضياً لأي سبب كان، ما عليك سوى التواصل معنا خلال 7 أيام من تاريخ الشراء وسنُعالج استردادك الكامل فوراً — دون أي أسئلة.",
      },
      {
        title: "كيفية طلب الاسترداد",
        body: "لطلب الاسترداد، يُرجى التواصل معنا على info@zenithdubaicv.com مع تفاصيل مشترياتك. سنُقرّ بطلبك فوراً ونبدأ المعالجة على الفور.",
      },
      {
        title: "مدة المعالجة",
        body: "تُعالَج جميع المبالغ المستردة المعتمدة خلال 5 إلى 10 أيام عمل. ستُعاد إلى طريقة الدفع الأصلية. قد تختلف أوقات المعالجة قليلاً بحسب بنكك أو جهة إصدار بطاقتك.",
      },
      {
        title: "التواصل",
        body: "لأي طلبات استرداد أو أسئلة حول هذه السياسة، يُرجى التواصل معنا على info@zenithdubaicv.com. نلتزم بحل جميع المسائل بسرعة واحترافية.",
      },
    ],
    highlight: "استرداد كامل خلال 7 أيام من الشراء — بلا شروط ولا استثناءات.",
    emailUs: "طلب استرداد",
    whatsapp: "واتساب",
    privacyLink: "سياسة الخصوصية",
    termsLink: "شروط الخدمة",
    refundLink: "سياسة الاسترداد",
    copyright: `© ${new Date().getFullYear()} Zenith Dubai CV`,
  },
  fr: {
    badge: "Légal",
    title: "Politique de remboursement",
    updated: "En vigueur : mars 2025",
    intro: "Nous croyons en une transparence totale et en votre pleine confiance lorsque vous investissez dans votre carrière. Notre politique de remboursement est simple, inconditionnelle et conçue pour vous offrir une tranquillité d'esprit absolue.",
    sections: [
      {
        title: "Délai de remboursement de 7 jours",
        body: "Nous offrons un remboursement complet et inconditionnel sur tous les achats effectués dans les 7 jours. Si pour quelque raison que ce soit vous n'êtes pas satisfait, contactez-nous simplement dans les 7 jours suivant votre achat et nous traiterons un remboursement intégral — sans aucune question.",
      },
      {
        title: "Comment demander un remboursement",
        body: "Pour demander un remboursement, veuillez nous contacter à info@zenithdubaicv.com en indiquant les détails de votre achat. Nous accuserons réception de votre demande rapidement et commencerons le traitement immédiatement.",
      },
      {
        title: "Délai de traitement",
        body: "Tous les remboursements approuvés sont traités dans un délai de 5 à 10 jours ouvrables. Le remboursement sera restitué sur votre moyen de paiement d'origine. Les délais de traitement peuvent légèrement varier selon votre banque ou l'émetteur de votre carte.",
      },
      {
        title: "Contact",
        body: "Pour toute demande de remboursement ou question concernant cette politique, contactez-nous à info@zenithdubaicv.com. Nous nous engageons à résoudre toutes les questions rapidement et professionnellement.",
      },
    ],
    highlight: "Remboursement intégral dans les 7 jours suivant l'achat — sans conditions, sans exceptions.",
    emailUs: "Demander un remboursement",
    whatsapp: "WhatsApp",
    privacyLink: "Politique de confidentialité",
    termsLink: "Conditions d'utilisation",
    refundLink: "Politique de remboursement",
    copyright: `© ${new Date().getFullYear()} Zenith Dubai CV`,
  },
};

export default function RefundPolicy() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const s = localStorage.getItem("z-theme");
    return s !== null ? s === "dark" : true;
  });
  const tog = () => { const n = !dark; setDark(n); localStorage.setItem("z-theme", n ? "dark" : "light"); };
  const [lang, setLang] = useState<Lang>("en");
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => { document.title = "Refund Policy · Zenith Dubai CV"; }, []);

  const LG   = LANGS.find(l => l.code === lang)!;
  const dir  = LG.dir;
  const font = LG.font;
  const bg   = dark ? INK : ASH;
  const hi   = dark ? "#EDE8E0" : "#1A1410";
  const sub  = dark ? "#857870" : "#786860";
  const bdr  = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const nav  = dark ? "rgba(10,9,7,0.94)" : "rgba(245,241,235,0.95)";
  const C    = COPY[lang];
  const wlMsg = `https://wa.me/${WA}?text=${encodeURIComponent("Hello. I would like to request a refund.")}`;

  const logoFilter = dark
    ? "brightness(1.08) drop-shadow(0 0 8px rgba(212,175,55,0.15)) drop-shadow(0 2px 6px rgba(0,0,0,0.50))"
    : "brightness(0) saturate(0) contrast(1)";

  return (
    <div className="min-h-screen w-full transition-colors duration-700" dir={dir} style={{ background: bg, color: hi, fontFamily: font }}>

      {/* Grain */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
      {dark && <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: `radial-gradient(ellipse 70% 50% at 50% -5%,${G}09,transparent 65%)` }} />}

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50" style={{ background: nav, backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", borderBottom: dark ? "none" : `1px solid ${bdr}`, position: "fixed" }}>
        {dark && (
          <div aria-hidden className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.12) 15%, rgba(212,175,55,0.55) 50%, rgba(212,175,55,0.12) 85%, transparent 100%)" }} />
        )}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8" style={{ height: "76px" }}>

          {/* Logo */}
          <a href="/" style={{ lineHeight: 0 }}>
            <img src="/images/logo.png" alt="Zenith Dubai CV" style={{ height: "auto", width: "100px", objectFit: "contain", display: "block", borderRadius: "8px", filter: logoFilter, transition: "filter 0.4s ease", paddingTop: "4px" }} />
          </a>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            {/* Language picker */}
            <div className="relative">
              <button onClick={() => setLangOpen(o => !o)} className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] uppercase transition-all hover:opacity-80" style={{ color: dark ? "rgba(200,169,110,0.55)" : `${G}90`, fontFamily: "sans-serif", background: "transparent", border: "none", cursor: "pointer" }}>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 1.5C8 1.5 6 4 6 8s2 6.5 2 6.5M8 1.5C8 1.5 10 4 10 8s-2 6.5-2 6.5M1.5 8h13" stroke="currentColor" strokeWidth="1.2"/></svg>
                {LG.label}
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 rounded-xl overflow-hidden shadow-2xl z-50" style={{ background: dark ? "#161410" : "#F0EBE3", border: `1px solid ${bdr}`, minWidth: "120px", right: dir === "rtl" ? "auto" : 0, left: dir === "rtl" ? 0 : "auto" }}>
                  {LANGS.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }} className="w-full px-4 py-2.5 text-[11px] tracking-[0.12em] transition-colors hover:opacity-80" style={{ color: lang === l.code ? G : sub, fontFamily: "sans-serif", background: "transparent", border: "none", cursor: "pointer", textAlign: dir === "rtl" ? "right" : "left", display: "block" }}>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button onClick={tog} className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:opacity-80" style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: "none", cursor: "pointer" }}>
              {dark ? <Sun size={13} color={G} strokeWidth={1.8} /> : <Moon size={13} color={sub} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </header>

      {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
      <main className="relative z-10" style={{ paddingTop: "76px" }}>
        <div className="mx-auto max-w-2xl px-8 py-24">

          {/* Badge + Title */}
          <div className="mb-10">
            <p className="mb-4 text-[10px] font-medium tracking-[0.28em] uppercase" style={{ color: G, fontFamily: "sans-serif" }}>{C.badge}</p>
            <h1 className="mb-4 text-[2.4rem] font-light leading-[1.15] tracking-[-0.02em]" style={{ color: hi }}>{C.title}</h1>
            <p className="text-[11px] tracking-[0.12em]" style={{ color: sub, fontFamily: "sans-serif" }}>{C.updated}</p>
          </div>

          {/* Divider */}
          <div className="mb-12 h-px" style={{ background: `linear-gradient(90deg, ${G}40, transparent)` }} />

          {/* Intro */}
          <p className="mb-12 text-[15px] leading-[1.9]" style={{ color: dark ? "#C0B0A4" : "#5A4E46" }}>{C.intro}</p>

          {/* Highlight box — the key Paddle-required statement */}
          <div className="mb-14 rounded-2xl px-8 py-7 flex items-start gap-5" style={{ background: dark ? `${G}0D` : `${G}0E`, border: `1px solid ${G}35` }}>
            <div className="mt-1 shrink-0 h-8 w-8 rounded-full flex items-center justify-center" style={{ background: `${G}18`, border: `1px solid ${G}40` }}>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 6v4m0-6v.5" stroke={G} strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[14px] leading-[1.75] font-medium" style={{ color: G, fontFamily: "sans-serif" }}>{C.highlight}</p>
          </div>

          {/* Sections */}
          <div className="flex flex-col">
            {C.sections.map((sec, i) => (
              <section key={i}>
                <div className="mb-5 flex items-start gap-4">
                  <span className="mt-[3px] shrink-0 text-[10px] font-medium tracking-[0.2em]" style={{ color: `${G}60`, fontFamily: "sans-serif", minWidth: "20px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-[13px] font-semibold tracking-[0.08em] uppercase" style={{ color: hi, fontFamily: "sans-serif" }}>{sec.title}</h2>
                </div>
                <p className="text-[14px] leading-[1.9] ps-9" style={{ color: dark ? "#A09080" : "#6A5E56" }}>{sec.body}</p>
                <div className="my-10 h-px" style={{ background: bdr }} />
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 rounded-2xl p-10 text-center" style={{ background: dark ? `${G}08` : `${G}0A`, border: `1px solid ${G}25` }}>
            <p className="mb-2 text-[15px] font-light" style={{ color: hi }}>Need a refund?</p>
            <p className="mb-7 text-[12px]" style={{ color: sub, fontFamily: "sans-serif" }}>Contact us and we'll take care of it within 5–10 business days.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={`mailto:${EM}?subject=Refund Request`} className="flex items-center justify-center gap-2 px-8 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-85" style={{ background: G, color: INK, height: "48px", fontFamily: "sans-serif", textDecoration: "none" }}>
                <Mail size={12} strokeWidth={2} />{C.emailUs}
              </a>
              <a href={wlMsg} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-8 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-70" style={{ border: `1px solid ${G}40`, color: G, height: "48px", fontFamily: "sans-serif", textDecoration: "none" }}>{C.whatsapp}</a>
            </div>
          </div>
        </div>

        {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
        <footer className="relative z-10 mt-4" style={{ borderTop: `1px solid ${bdr}` }}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-8 py-8">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Zenith Dubai CV" style={{ height: "36px", width: "auto", objectFit: "contain", filter: logoFilter, transition: "filter 0.4s ease" }} />
              <span className="hidden sm:block text-[10px] tracking-[0.18em] uppercase" style={{ color: dark ? "rgba(200,169,110,0.35)" : `${G}55`, fontFamily: "sans-serif" }}>Executive Career Studio</span>
            </div>
            <div className="flex items-center gap-4">
              <a href={`mailto:${EM}`} className="flex items-center gap-1.5 text-[10px] tracking-[0.12em] transition-opacity hover:opacity-80" style={{ color: dark ? "rgba(200,169,110,0.40)" : `${G}70`, fontFamily: "sans-serif", textDecoration: "none" }}>
                <Mail size={9} strokeWidth={1.5} />{EM}
              </a>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-[10px]" style={{ color: dark ? "rgba(200,169,110,0.16)" : `${hi}28`, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{C.copyright}</p>
              <span style={{ color: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)", fontSize: "10px" }}>·</span>
              <a href="/privacy" className="text-[10px] transition-opacity hover:opacity-70" style={{ color: dark ? "rgba(200,169,110,0.35)" : `${G}55`, fontFamily: "sans-serif", textDecoration: "none" }}>{C.privacyLink}</a>
              <span style={{ color: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)", fontSize: "10px" }}>·</span>
              <a href="/terms" className="text-[10px] transition-opacity hover:opacity-70" style={{ color: dark ? "rgba(200,169,110,0.35)" : `${G}55`, fontFamily: "sans-serif", textDecoration: "none" }}>{C.termsLink}</a>
              <span style={{ color: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)", fontSize: "10px" }}>·</span>
              <a href="/refund" className="text-[10px]" style={{ color: G, fontFamily: "sans-serif", textDecoration: "none", opacity: 0.65 }}>{C.refundLink}</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}