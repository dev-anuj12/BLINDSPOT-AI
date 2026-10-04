/**
 * Safe site URL resolver for metadata, sitemap, and robots.txt
 * Handles missing protocol (e.g. "blindspot-ai.vercel.app"), VERCEL_URL, and malformed strings.
 */
export function getSiteUrl(): string {
  let raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "https://blindspot-ai.vercel.app";

  raw = raw.trim();
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    raw = `https://${raw}`;
  }
  return raw.replace(/\/+$/, "");
}

export function getMetadataBase(): URL {
  try {
    const url = getSiteUrl();
    return new URL(url);
  } catch {
    return new URL("https://blindspot-ai.vercel.app");
  }
}
