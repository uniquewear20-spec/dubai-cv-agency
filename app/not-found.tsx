// app/not-found.tsx — the page for addresses that don't exist: says so in the three languages and
// offers the main ways back in.
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="zs" style={{ display: "grid", placeItems: "center", padding: "12vh 20px" }}>
      <main style={{ maxWidth: 640, display: "grid", gap: 18 }}>
        <p className="z-label">404</p>
        <h1 className="z-h2">This page doesn&apos;t exist.</h1>
        <p className="z-body" lang="fr">Cette page n&apos;existe pas.</p>
        <p className="z-body" lang="ar" dir="rtl">هذه الصفحة غير موجودة.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
          <Link className="z-btn z-btn-primary" href="/">Zenith Dubai CV</Link>
          <Link className="z-btn z-btn-quiet" href="/x-ray/">Free CV X-Ray</Link>
          <Link className="z-btn z-btn-quiet" href="/#packages">Packages</Link>
          <Link className="z-btn z-btn-quiet" href="/agent/">AI job agent</Link>
        </div>
      </main>
    </div>
  );
}
