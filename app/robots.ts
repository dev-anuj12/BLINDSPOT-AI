import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/analyze", "/privacy", "/terms"],
      disallow: ["/api/", "/results"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
