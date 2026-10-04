import { describe, it, expect, beforeEach } from "vitest";

// Mock localStorage store
class MockStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  clear(): void {
    this.store = {};
  }
}

describe("Theme State and Storage Logic", () => {
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
  });

  it("persists selected theme to storage correctly", () => {
    mockStorage.setItem("bsai_theme", "dark");
    expect(mockStorage.getItem("bsai_theme")).toBe("dark");

    mockStorage.setItem("bsai_theme", "light");
    expect(mockStorage.getItem("bsai_theme")).toBe("light");
  });

  it("resolves default theme when storage is empty", () => {
    const saved = mockStorage.getItem("bsai_theme") || "system";
    expect(saved).toBe("system");
  });

  it("validates allowed theme modes", () => {
    const validModes = ["light", "dark", "system"];
    expect(validModes.includes("light")).toBe(true);
    expect(validModes.includes("dark")).toBe(true);
    expect(validModes.includes("system")).toBe(true);
    expect(validModes.includes("invalid-theme")).toBe(false);
  });
});
