import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./site.css";
import { fontVariables } from "./fonts";
import { SITE_URL, BRAND_NAME, CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/site";

const DESCRIPTION =
  "CVs, LinkedIn profiles and job applications for professionals targeting the Gulf, Europe and beyond, written from your real experience in English, French or Arabic. Four packages from AED 179, with secure checkout.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Zenith Dubai CV — CVs and career positioning in English, French and Arabic",
    template: "%s — Zenith Dubai CV",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Zenith Dubai CV",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: BRAND_NAME,
    images: [{ url: "/images/og-zenith.png", width: 1200, height: 630, alt: "Zenith Dubai CV — we don't write CVs, we engineer careers." }],
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ar_AE"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenith Dubai CV",
    description: DESCRIPTION,
    images: ["/images/og-zenith.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0907" },
    { media: "(prefers-color-scheme: light)", color: "#F7F3EE" },
  ],
};

// Applies the saved theme before the first paint, so returning visitors who chose light mode
// don't see a dark flash. The page keeps it in sync afterwards (localStorage key "z-theme").
const THEME_SCRIPT = `try{var t=localStorage.getItem("z-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  email: CONTACT_EMAIL,
  sameAs: SOCIAL_LINKS.map(s => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
