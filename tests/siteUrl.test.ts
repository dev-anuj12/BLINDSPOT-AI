import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getSiteUrl, getMetadataBase } from "../lib/siteUrl";

describe("Site URL and MetadataBase Normalizer", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("adds https protocol if protocol is omitted", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "blindspot-ai.vercel.app";
    expect(getSiteUrl()).toBe("https://blindspot-ai.vercel.app");
  });

  it("removes trailing slashes properly", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://blindspot-ai.vercel.app///";
    expect(getSiteUrl()).toBe("https://blindspot-ai.vercel.app");
  });

  it("returns a valid URL object without throwing", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://custom-domain.com";
    const base = getMetadataBase();
    expect(base instanceof URL).toBe(true);
    expect(base.origin).toBe("https://custom-domain.com");
  });

  it("safely falls back to default URL when env is empty", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
    const base = getMetadataBase();
    expect(base.origin).toBe("https://blindspot-ai.vercel.app");
  });
});
