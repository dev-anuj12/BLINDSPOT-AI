import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import {
  BlindSpotAnalysis,
  DecisionInput,
  ReflectionAnswer,
  LensType,
} from "@/types/analysis";
import { BLIND_SPOT_SYSTEM_PROMPT, buildAnalysisUserPrompt } from "./prompts";
import { scanAnalysisForNeutrality, generateNeutralFallback } from "./neutralityFilter";

export const ANALYSIS_JSON_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    status: {
      type: SchemaType.STRING,
      enum: ["ok", "needs_more_info", "not_a_decision"],
      description: "Analysis status code",
    },
    status_message: {
      type: SchemaType.STRING,
      description: "Neutral context message explaining the status",
    },
    decision_summary: {
      type: SchemaType.STRING,
      description: "One neutral sentence summarizing the decision",
    },
    weighing: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          factor: { type: SchemaType.STRING },
          attention_level: {
            type: SchemaType.STRING,
            enum: ["high", "medium", "low"],
          },
          evidence: { type: SchemaType.STRING },
        },
        required: ["factor", "attention_level", "evidence"],
      },
    },
    assumptions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          assumption: { type: SchemaType.STRING },
          evidence: { type: SchemaType.STRING },
          how_to_test_it: { type: SchemaType.STRING },
        },
        required: ["assumption", "evidence", "how_to_test_it"],
      },
    },
    overlooked_factors: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          category: { type: SchemaType.STRING },
          why_it_may_matter: { type: SchemaType.STRING },
        },
        required: ["category", "why_it_may_matter"],
      },
    },
    conflicts: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          statement_a: { type: SchemaType.STRING },
          statement_b: { type: SchemaType.STRING },
          tension: { type: SchemaType.STRING },
        },
        required: ["statement_a", "statement_b", "tension"],
      },
    },
    bias_flags: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          pattern: { type: SchemaType.STRING },
          evidence: { type: SchemaType.STRING },
        },
        required: ["pattern", "evidence"],
      },
    },
    reversibility: {
      type: SchemaType.OBJECT,
      properties: {
        type: {
          type: SchemaType.STRING,
          enum: ["one_way", "two_way", "unclear"],
        },
        note: { type: SchemaType.STRING },
      },
      required: ["type", "note"],
    },
    questions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: { type: SchemaType.STRING },
          targets: {
            type: SchemaType.STRING,
            enum: ["assumption", "overlooked", "conflict", "other"],
          },
        },
        required: ["question", "targets"],
      },
    },
    lens_view: {
      type: SchemaType.STRING,
      description: "Perspective under the selected lens, if applicable; otherwise empty string",
    },
    shift_summary: {
      type: SchemaType.STRING,
      description: "Summary of changes between reflection rounds, if round > 1; otherwise empty string",
    },
    safety_note: {
      type: SchemaType.STRING,
      description: "Supportive referral note if user is in crisis or danger; otherwise empty string",
    },
  },
  required: [
    "status",
    "status_message",
    "decision_summary",
    "weighing",
    "assumptions",
    "overlooked_factors",
    "conflicts",
    "bias_flags",
    "reversibility",
    "questions",
    "lens_view",
    "shift_summary",
    "safety_note",
  ],
};

export function cleanJsonText(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

export function parseAndValidateSchema(rawJson: string): BlindSpotAnalysis {
  const cleaned = cleanJsonText(rawJson);
  const parsed = JSON.parse(cleaned);

  // Normalize and guard fields
  const analysis: BlindSpotAnalysis = {
    status: ["ok", "needs_more_info", "not_a_decision"].includes(parsed.status)
      ? parsed.status
      : "ok",
    status_message: typeof parsed.status_message === "string" ? parsed.status_message : "",
    decision_summary: typeof parsed.decision_summary === "string" ? parsed.decision_summary : "",
    weighing: Array.isArray(parsed.weighing)
      ? parsed.weighing.map((w: any) => ({
          factor: String(w.factor || "Key Factor"),
          attention_level: ["high", "medium", "low"].includes(w.attention_level)
            ? w.attention_level
            : "medium",
          evidence: String(w.evidence || ""),
        }))
      : [],
    assumptions: Array.isArray(parsed.assumptions)
      ? parsed.assumptions.map((a: any) => ({
          assumption: String(a.assumption || ""),
          evidence: String(a.evidence || ""),
          how_to_test_it: String(a.how_to_test_it || ""),
        }))
      : [],
    overlooked_factors: Array.isArray(parsed.overlooked_factors)
      ? parsed.overlooked_factors.map((o: any) => ({
          category: String(o.category || "General Context"),
          why_it_may_matter: String(o.why_it_may_matter || ""),
        }))
      : [],
    conflicts: Array.isArray(parsed.conflicts)
      ? parsed.conflicts.map((c: any) => ({
          statement_a: String(c.statement_a || ""),
          statement_b: String(c.statement_b || ""),
          tension: String(c.tension || ""),
        }))
      : [],
    bias_flags: Array.isArray(parsed.bias_flags)
      ? parsed.bias_flags.map((b: any) => ({
          pattern: String(b.pattern || ""),
          evidence: String(b.evidence || ""),
        }))
      : [],
    reversibility: {
      type: ["one_way", "two_way", "unclear"].includes(parsed.reversibility?.type)
        ? parsed.reversibility.type
        : "unclear",
      note: String(parsed.reversibility?.note || "Reversibility depends on initial commitments."),
    },
    questions: Array.isArray(parsed.questions)
      ? parsed.questions.map((q: any) => ({
          question: String(q.question || ""),
          targets: ["assumption", "overlooked", "conflict", "other"].includes(q.targets)
            ? q.targets
            : "other",
        }))
      : [],
    lens_view: typeof parsed.lens_view === "string" ? parsed.lens_view : "",
    shift_summary: typeof parsed.shift_summary === "string" ? parsed.shift_summary : "",
    safety_note: typeof parsed.safety_note === "string" ? parsed.safety_note : "",
  };

  return analysis;
}

export async function analyzeDecisionWithGemini(params: {
  decisionInput: DecisionInput;
  round?: number;
  previousAnalysis?: BlindSpotAnalysis;
  reflectionAnswers?: ReflectionAnswer[];
  lens?: LensType;
}): Promise<{ analysis: BlindSpotAnalysis; retriedForNeutrality: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  // Resilient model list
  const primaryModel = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const candidateModels = Array.from(new Set([
    primaryModel,
    "gemini-flash-latest",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemini-2.5-flash",
  ]));

  const genAI = new GoogleGenerativeAI(apiKey);

  const userPrompt = buildAnalysisUserPrompt(
    params.decisionInput,
    params.round || 1,
    params.previousAnalysis,
    params.reflectionAnswers,
    params.lens
  );

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: BLIND_SPOT_SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_JSON_SCHEMA as any,
          temperature: 0.3,
        },
      });

      let retriedForNeutrality = false;

      // 1st Gemini Call
      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();
      let analysis = parseAndValidateSchema(responseText);

      // Neutrality Check
      const neutralityResult = scanAnalysisForNeutrality(analysis);

      if (neutralityResult.isViolating) {
        retriedForNeutrality = true;
        // 1-Call Retry with corrective prompt
        const retryPrompt = `${userPrompt}\n\nCRITICAL CORRECTION REQUIRED:\nYour previous response contained decision advice or leaning phrases (${neutralityResult.violations.join(", ")}). Rewrite the entire JSON response so that it ONLY observes, questions, and identifies uncertainty. Under no circumstance should you recommend, rank, choose, favor, or evaluate any option as superior.`;

        try {
          const retryResult = await model.generateContent(retryPrompt);
          const retryText = retryResult.response.text();
          const retriedAnalysis = parseAndValidateSchema(retryText);

          const retryNeutrality = scanAnalysisForNeutrality(retriedAnalysis);
          if (retryNeutrality.isViolating) {
            analysis = generateNeutralFallback(params.decisionInput.decision);
          } else {
            analysis = retriedAnalysis;
          }
        } catch {
          analysis = generateNeutralFallback(params.decisionInput.decision);
        }
      }

      return { analysis, retriedForNeutrality };
    } catch (error: any) {
      lastError = error;
      const msg = error?.message || "";
      // If 503 high demand or 404 not found, try the next model candidate
      if (msg.includes("503") || msg.includes("404") || msg.includes("high demand") || msg.includes("not found")) {
        continue;
      }
      throw error;
    }
  }

  // If all candidate models failed with rate limit or busy
  const errorMsg = lastError?.message || "";
  if (errorMsg.includes("429") || errorMsg.includes("ResourceExhausted") || errorMsg.includes("quota")) {
    throw new Error("Analysis service is currently busy. Please wait a moment and try again.");
  }

  throw lastError || new Error("Failed to generate mirror analysis.");
}
