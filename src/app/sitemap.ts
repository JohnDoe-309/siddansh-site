import type { MetadataRoute } from "next";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://siddansh.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/life`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
