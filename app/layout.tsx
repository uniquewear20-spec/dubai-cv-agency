import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenith Dubai CV — Executive Career Studio",
  description:
    "Based in Dubai, operating globally. We elevate the careers of professionals from the Gulf, Africa, and Asia — crafting authoritative profiles that unlock opportunities across North America, Europe, and the Gulf countries.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Zenith Dubai CV",
    description:
      "Executive career positioning for ambitious professionals. Based in Dubai. Operating globally.",
    url: "https://zenithdubaicv.com",
    siteName: "Zenith Dubai CV",
    images: [{ url: "/images/logo.png", width: 1024, height: 1024, alt: "Zenith Dubai CV" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Zenith Dubai CV",
    description: "Executive career positioning. Based in Dubai. Operating globally.",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}