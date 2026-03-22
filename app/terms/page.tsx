// app/terms/page.tsx — Zenith Dubai CV · Terms of Service
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowLeft } from "lucide-react";

const G = "#C8A96E", INK = "#0A0907", ASH = "#F5F1EB";
const WA = "971502879462";
const wlMsg = `https://wa.me/${WA}?text=${encodeURIComponent("Hello. I would like to discuss my career positioning.")}`;

const SECTIONS = [
  {
    id: "1",
    title: "Services",
    body: `Zenith Dubai CV provides professional career document services including CV writing, cover letter creation, LinkedIn profile optimisation, interview coaching, and related career advisory services. The specific deliverables for each engagement are determined by the package selected or agreed upon in writing prior to commencement.\n\nAll services are delivered digitally. No physical materials are produced or shipped. Final documents are delivered via email in the formats specified at the time of engagement.`,
  },
  {
    id: "2",
    title: "Engagement and Payment",
    body: `Engagements commence upon receipt of payment and completion of the client intake process. By submitting payment, you confirm that you have read and agreed to these Terms of Service.\n\nAll prices are stated in UAE Dirhams (AED) inclusive of any applicable taxes unless otherwise indicated. Payment is due in full prior to the commencement of any work. We reserve the right to adjust pricing at any time, but any price change will not affect engagements already confirmed and paid.`,
  },
  {
    id: "3",
    title: "Delivery",
    body: `Standard delivery for all packages is 48 hours from the completion of the client intake process. This timeline begins once we have received all necessary information from you, including your career background, target markets, and objectives.\n\nDelivery timelines are estimates and may be extended in exceptional circumstances. We will notify you promptly if a delay is anticipated. Delays attributable to the client — including late submission of intake information — do not affect our delivery obligation timeline.`,
  },
  {
    id: "4",
    title: "Revisions",
    body: `All packages include unlimited revision rounds until the client is fully satisfied with the deliverables. Revisions must be requested within 30 days of the initial delivery. Revision requests submitted after this period may be subject to additional charges.\n\nRevisions are limited in scope to the content and structure of the original deliverables. Requests that constitute a fundamental change in direction — such as targeting an entirely new industry or career level — may be treated as a new engagement at our discretion.`,
  },
  {
    id: "5",
    title: "Client Responsibilities",
    body: `You are responsible for providing accurate, complete, and truthful information about your career history, qualifications, and objectives. Zenith Dubai CV relies on the information you provide to create your documents. We are not responsible for inaccuracies in the final documents that result from inaccurate or incomplete information supplied by you.\n\nYou confirm that all information you provide is your own and does not infringe the intellectual property or confidentiality obligations of any third party.`,
  },
  {
    id: "6",
    title: "Intellectual Property",
    body: `Upon full payment and delivery, you are granted full ownership of all documents created for you by Zenith Dubai CV. You may use, modify, and distribute these documents freely for your personal career purposes.\n\nZenith Dubai CV retains the right to use anonymised or aggregated content derived from client engagements for internal quality improvement and training purposes. We will never publish, attribute, or share identifiable client content without explicit written consent.`,
  },
  {
    id: "7",
    title: "Refunds",
    body: `We offer a full refund if you request cancellation before the intake process is complete and no work has commenced. Once work has commenced, refunds are issued at our discretion based on the stage of completion.\n\nIf you are not satisfied with the final deliverables after the revision process has been completed in good faith, please contact us directly. We are committed to resolving all concerns fairly and will work with you to reach an acceptable outcome.`,
  },
  {
    id: "8",
    title: "Confidentiality",
    body: `All information shared with us in the course of an engagement is treated as strictly confidential. We do not share your personal career information, documents, or correspondence with any third party without your explicit consent, except as required by applicable law.\n\nWe expect clients to treat any proprietary methodologies, templates, or strategic frameworks shared during an engagement as confidential and not to reproduce or distribute them.`,
  },
  {
    id: "9",
    title: "Limitation of Liability",
    body: `Zenith Dubai CV provides career document services and professional guidance. We do not guarantee any specific outcome, including but not limited to employment, interview invitations, salary increases, or career advancement. The effectiveness of career documents depends on many factors outside our control, including market conditions, hiring practices, and individual circumstances.\n\nOur total liability to any client in connection with any engagement shall not exceed the amount paid by the client for that engagement.`,
  },
  {
    id: "10",
    title: "Governing Law",
    body: `These Terms of Service are governed by the laws of the United Arab Emirates. Any disputes arising from or related to these terms or our services shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.\n\nIf any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
  {
    id: "11",
    title: "Changes to These Terms",
    body: `We may update these Terms of Service from time to time. The date of the most recent revision is indicated at the top of this page. Continued use of our website or services after any changes constitutes your acceptance of the updated terms. We encourage you to review this page periodically.`,
  },
  {
    id: "12",
    title: "Contact",
    body: `For any questions about these Terms of Service, please contact us at info@zenithdubaicv.com or via WhatsApp at +971 50 287 9462. We are available to clarify any aspect of these terms before you proceed with an engagement.`,
  },
];

function Rise({ children, d = 0, className = "" }: { children: React.ReactNode; d?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5% 0px" }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: d }}>
      {children}
    </motion.div>
  );
}

export default function TermsOfService() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const s = localStorage.getItem("z-theme");
    return s !== null ? s === "dark" : true;
  });
  const tog = () => { const n = !dark; setDark(n); localStorage.setItem("z-theme", n ? "dark" : "light"); };

  useEffect(() => { document.title = "Terms of Service · Zenith Dubai CV"; }, []);

  const bg  = dark ? "#0A0907" : ASH;
  const hi  = dark ? "#EDE8E0" : "#1A1410";
  const sub = dark ? "#857870" : "#786860";
  const bdr = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const nav = dark ? "rgba(10,9,7,0.94)" : "rgba(245,241,235,0.95)";
  const logoFilter = dark
    ? "brightness(1.08) drop-shadow(0 0 8px rgba(212,175,55,0.15)) drop-shadow(0 2px 6px rgba(0,0,0,0.50))"
    : "brightness(0) saturate(0) contrast(1)";

  return (
    <div className="min-h-screen w-full transition-colors duration-700" style={{ background: bg, color: hi, fontFamily: "'Georgia','Times New Roman',serif" }}>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
      {dark && <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: `radial-gradient(ellipse 70% 50% at 50% -5%,${G}09,transparent 65%)` }} />}

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50" style={{ background: nav, backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", borderBottom: dark ? "none" : `1px solid ${bdr}` }}>
        {dark && <div aria-hidden className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent 0%,rgba(212,175,55,0.12) 15%,rgba(212,175,55,0.55) 50%,rgba(212,175,55,0.12) 85%,transparent 100%)" }} />}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8" style={{ height: "76px" }}>
          <a href="/" style={{ lineHeight: 0 }}>
            <img src="/images/logo.png" alt="Zenith Dubai CV" style={{ height: "auto", width: "100px", objectFit: "contain", display: "block", borderRadius: "8px", filter: logoFilter, transition: "filter 0.4s ease", paddingTop: "4px" }} />
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="hidden sm:flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] uppercase transition-opacity hover:opacity-70" style={{ color: dark ? "rgba(200,169,110,0.55)" : `${hi}65`, fontFamily: "sans-serif", textDecoration: "none" }}>
              <ArrowLeft size={11} strokeWidth={1.5} />Back to Home
            </a>
            <button type="button" onClick={tog} aria-label="Toggle theme" className="flex items-center justify-center rounded-full" style={{ border: dark ? "1px solid rgba(200,169,110,0.16)" : `1px solid ${bdr}`, width: "32px", height: "32px", opacity: 0.45, background: "transparent", transition: "opacity 0.2s ease" }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.80"; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.45"; }}>
              {dark ? <Sun size={12} color="#D4AF37" strokeWidth={1.5} /> : <Moon size={12} color={hi} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-[76px]">
        <div className="mx-auto max-w-3xl px-8 py-24">

          <Rise d={0.1}>
            <p className="text-[10px] font-medium tracking-[0.42em] uppercase mb-5" style={{ color: G, fontFamily: "sans-serif" }}>Legal</p>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight leading-[1.08] mb-4" style={{ color: hi }}>Terms of Service</h1>
            <p className="text-sm mb-16" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>Last updated: March 2025 · Zenith Dubai CV, Dubai, United Arab Emirates</p>
            <div className="h-px mb-16" style={{ background: `linear-gradient(90deg,${G}50,transparent)` }} />
          </Rise>

          <Rise d={0.2} className="mb-4">
            <p className="text-base leading-[1.9]" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>
              These Terms of Service govern your use of the Zenith Dubai CV website and the professional career services we provide. By engaging our services or submitting an enquiry, you agree to be bound by these terms. Please read them carefully before proceeding.
            </p>
          </Rise>

          <div className="flex flex-col">
            {SECTIONS.map((s, i) => (
              <Rise key={s.id} d={0.04 * i}>
                <div className="flex gap-8 py-10" style={{ borderTop: `1px solid ${bdr}` }}>
                  <div className="shrink-0 w-6 pt-1">
                    <span className="text-[11px]" style={{ color: G, fontFamily: "sans-serif", opacity: 0.55, fontWeight: 500 }}>{s.id}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-normal mb-5 tracking-tight" style={{ color: hi }}>{s.title}</h2>
                    {s.body.split("\\n\\n").map((para, j) => (
                      <p key={j} className="text-sm leading-[1.95] mb-4 last:mb-0" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>{para}</p>
                    ))}
                  </div>
                </div>
              </Rise>
            ))}
          </div>

          <Rise d={0.1} className="mt-16">
            <div className="h-px mb-12" style={{ background: `linear-gradient(90deg,${G}50,transparent)` }} />
            <p className="text-sm leading-[1.9] mb-8" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>Questions about these terms? We are happy to clarify anything before you proceed.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:info@zenithdubaicv.com" className="flex items-center justify-center gap-2 px-8 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-85" style={{ background: G, color: INK, height: "48px", fontFamily: "sans-serif" }}>Email Us</a>
              <a href={wlMsg} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-8 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-70" style={{ border: `1px solid ${G}40`, color: G, height: "48px", fontFamily: "sans-serif" }}>WhatsApp</a>
            </div>
          </Rise>
        </div>

        <footer className="py-8 px-8 border-t" style={{ borderColor: bdr }}>
          <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-between gap-4">
            <p className="text-[10px]" style={{ color: dark ? "rgba(200,169,110,0.20)" : `${hi}30`, fontFamily: "sans-serif" }}>© {new Date().getFullYear()} Zenith Dubai CV</p>
            <div className="flex items-center gap-5">
              <a href="/privacy" className="text-[10px] transition-opacity hover:opacity-70" style={{ color: dark ? "rgba(200,169,110,0.35)" : `${hi}45`, fontFamily: "sans-serif", textDecoration: "none" }}>Privacy Policy</a>
              <span style={{ color: bdr, fontSize: "10px" }}>·</span>
              <a href="/terms" className="text-[10px]" style={{ color: G, fontFamily: "sans-serif", textDecoration: "none", opacity: 0.7 }}>Terms of Service</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}