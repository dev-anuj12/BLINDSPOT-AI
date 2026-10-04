import { describe, it, expect } from "vitest";
import { parseAndValidateSchema, cleanJsonText } from "@/lib/gemini";

describe("Gemini JSON Parsing and Schema Normalization", () => {
  it("cleans markdown code fences from raw AI output", () => {
    const rawWithMarkdown = '```json\n{"status": "ok", "status_message": "", "decision_summary": "Test"}\n```';
    const cleaned = cleanJsonText(rawWithMarkdown);
    expect(cleaned.startsWith("{")).toBe(true);
    expect(cleaned.endsWith("}")).toBe(true);
  });

  it("correctly parses a full valid JSON response from Gemini", () => {
    const validJson = JSON.stringify({
      status: "ok",
      status_message: "Analysis complete",
      decision_summary: "Deciding between internship offer and full-time studies",
      weighing: [
        { factor: "Compensation and practical experience", attention_level: "high", evidence: "Stated in input" },
      ],
      assumptions: [
        { assumption: "Coursework will not suffer", evidence: "Inferred from timeline", how_to_test_it: "Audit weekly hours" },
      ],
      overlooked_factors: [
        { category: "Opportunity Cost", why_it_may_matter: "Foregoes summer research" },
      ],
      conflicts: [
        { statement_a: "Need strong GPA", statement_b: "30h commitment", tension: "Academic focus vs workload" },
      ],
      bias_flags: [
        { pattern: "Focusing heavily on immediate income", evidence: "Stipend mentioned first" },
      ],
      reversibility: {
        type: "two_way",
        note: "Internship agreement can be terminated with notice",
      },
      questions: [
        { question: "What would your schedule look like on exam weeks?", targets: "conflict" },
      ],
      lens_view: "",
      shift_summary: "",
      safety_note: "",
    });

    const parsed = parseAndValidateSchema(validJson);
    expect(parsed.status).toBe("ok");
    expect(parsed.decision_summary).toBe("Deciding between internship offer and full-time studies");
    expect(parsed.weighing.length).toBe(1);
    expect(parsed.reversibility.type).toBe("two_way");
    expect(parsed.questions.length).toBe(1);
  });

  it("normalizes missing or malformed fields to safe defaults", () => {
    const sparseJson = JSON.stringify({
      decision_summary: "Partial object",
    });

    const parsed = parseAndValidateSchema(sparseJson);
    expect(parsed.status).toBe("ok");
    expect(parsed.weighing).toEqual([]);
    expect(parsed.assumptions).toEqual([]);
    expect(parsed.reversibility.type).toBe("unclear");
    expect(parsed.questions).toEqual([]);
  });
});
