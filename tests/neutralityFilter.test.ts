import { describe, it, expect } from "vitest";
import {
  scanTextForAdvice,
  scanAnalysisForNeutrality,
  generateNeutralFallback,
} from "@/lib/neutralityFilter";

describe("Neutrality Filter - Decision Advice Detection", () => {
  it("flags direct advice phrases like 'I recommend declining'", () => {
    const result = scanTextForAdvice("Based on your situation, I recommend declining the internship.");
    expect(result.isViolating).toBe(true);
  });

  it("flags 'you should take the job'", () => {
    const result = scanTextForAdvice("You should take the offer since the pay is higher.");
    expect(result.isViolating).toBe(true);
  });

  it("flags 'the better choice is option A'", () => {
    const result = scanTextForAdvice("The better choice is clearly to stay at your current job.");
    expect(result.isViolating).toBe(true);
  });

  it("flags 'go for it' or 'avoid it'", () => {
    expect(scanTextForAdvice("You should go for it without hesitation.").isViolating).toBe(true);
    expect(scanTextForAdvice("You must avoid this path at all costs.").isViolating).toBe(true);
  });

  it("does NOT flag reflective phrasing like 'You should ask yourself what you would give up'", () => {
    const result = scanTextForAdvice("You should ask yourself what you would give up if you accept.");
    expect(result.isViolating).toBe(false);
  });

  it("does NOT flag 'You may want to consider what...'", () => {
    const result = scanTextForAdvice("You may want to consider what tradeoffs exist with your commute.");
    expect(result.isViolating).toBe(false);
  });

  it("does NOT flag neutral mentions of 'choice', 'decide', or 'options'", () => {
    const text = "Every choice involves uncertainty. When you choose to accept or decline, factors will shift.";
    const result = scanTextForAdvice(text);
    expect(result.isViolating).toBe(false);
  });

  it("scans nested objects and arrays recursively for violations", () => {
    const nestedData = {
      decision_summary: "Evaluating job transition",
      assumptions: [
        {
          assumption: "Workload will remain manageable",
          evidence: "Stated in reasoning",
          how_to_test_it: "You should choose the first option to be safe.",
        },
      ],
      questions: [
        {
          question: "How would this feel in 12 months?",
          targets: "other",
        },
      ],
    };

    const scanResult = scanAnalysisForNeutrality(nestedData);
    expect(scanResult.isViolating).toBe(true);
    expect(scanResult.violations.length).toBeGreaterThan(0);
  });

  it("generates a completely neutral safe fallback structure", () => {
    const fallback = generateNeutralFallback("Internship decision");
    expect(fallback.status).toBe("ok");
    expect(fallback.questions.length).toBeGreaterThan(0);

    const checkFallback = scanAnalysisForNeutrality(fallback);
    expect(checkFallback.isViolating).toBe(false);
  });
});
