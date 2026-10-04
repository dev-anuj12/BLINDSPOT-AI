import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blindspot-ai.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/analyze", "/privacy", "/terms"],
      disallow: ["/api/", "/results"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
