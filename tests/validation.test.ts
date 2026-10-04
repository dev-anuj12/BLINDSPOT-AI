import { describe, it, expect } from "vitest";
import { validateDecisionInput, MAX_TOTAL_CHARACTERS } from "@/lib/validation";
import { DecisionInput } from "@/types/analysis";

describe("Input Validation & Spam Protection", () => {
  const validSample: DecisionInput = {
    decision: "I'm deciding whether to accept a 6-month internship.",
    options: "Accept the internship or decline it.",
    reasoning: "I'm mainly considering it because the stipend is good and it will give me industry experience.",
    deadline: "Next week",
    stakes: "My grades, experience, and time.",
    affected: "Me and my family.",
    context: "The internship requires 30 hours a week.",
  };

  it("validates a complete, correctly formatted decision input", () => {
    const result = validateDecisionInput(validSample);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("fails when required fields are empty", () => {
    const result = validateDecisionInput({});
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(5);
  });

  it("fails when decision text is too short", () => {
    const result = validateDecisionInput({
      ...validSample,
      decision: "No",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.field === "decision")).toBe(true);
  });

  it("fails when honeypot is filled by automated bots", () => {
    const result = validateDecisionInput({
      ...validSample,
      honeypot: "spam_bot_data_123",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.field === "honeypot")).toBe(true);
  });

  it("fails when total character count exceeds the maximum limit", () => {
    const oversizedReasoning = "A".repeat(MAX_TOTAL_CHARACTERS + 100);
    const result = validateDecisionInput({
      ...validSample,
      reasoning: oversizedReasoning,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.field === "form" || e.field === "reasoning")).toBe(true);
  });
});
