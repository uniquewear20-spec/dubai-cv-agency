// app/sitemap.ts — the public pages of the site.
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-10-19");
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/x-ray/`, lastModified: new Date("2026-11-25"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/agent/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about/`, lastModified: new Date("2026-11-25"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/refund/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
