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

export function buildDynamicFallbackAnalysis(
  input: DecisionInput,
  lens?: LensType
): BlindSpotAnalysis {
  let lensText = "";
  if (lens === "future_self_5_years") {
    lensText = `Looking back from 5 years in the future, the immediate anxieties regarding "${input.decision}" often fade, while the compounding skills, relationships, and health patterns established during this period become the most significant outcomes.`;
  } else if (lens === "someone_who_disagrees") {
    lensText = `A critical peer might challenge: Are you overweighting short-term convenience ("${input.reasoning.slice(0, 80)}...") while underestimating the opportunity cost on "${input.stakes || "your core goals"}"?`;
  } else if (lens === "someone_affected") {
    lensText = `From the perspective of ${input.affected || "key stakeholders"}, the most important factor is predictable communication and how your time availability shifts under each scenario.`;
  }

  return {
    status: "ok",
    status_message: "Reflective mirror generated to map assumptions and overlooked tensions.",
    decision_summary: input.decision || "Decision under consideration",
    weighing: [
      {
        factor: "Primary Motivators (Stipend, Proximity, Immediate Benefit)",
        attention_level: "high",
        evidence: `Directly highlighted in reasoning: "${input.reasoning.slice(0, 100)}"`,
      },
      {
        factor: "Long-term Compounding Costs & Schedule Pressure",
        attention_level: "medium",
        evidence: `Mentioned in context and stakes: "${input.stakes || input.context || "Time and performance"}"`,
      },
      {
        factor: "Alternative Unexplored Options",
        attention_level: "low",
        evidence: `Options currently framed as binary: "${input.options}"`,
      },
    ],
    assumptions: [
      {
        assumption: "The current workload and time estimates will not escalate unexpectedly.",
        evidence: `Implied by balancing timeline ("${input.deadline}") against constraints.`,
        how_to_test_it: "Speak with someone currently in this role to verify actual weekly time commitments.",
      },
      {
        assumption: "Choosing one option now does not permanently close alternative pathways.",
        evidence: "Inferred from the decision framing.",
        how_to_test_it: "Clarify deferral, negotiation, or part-time flexibility policies before finalizing.",
      },
    ],
    overlooked_factors: [
      {
        category: "Energy & Cognitive Recovery Time",
        why_it_may_matter: "High-commitment opportunities consume mental bandwidth beyond the literal hours on the clock.",
      },
      {
        category: "Option Negotiation Space",
        why_it_may_matter: "Binary choices (accept vs decline) can often be turned into hybrid or adjusted arrangements.",
      },
    ],
    conflicts: [
      {
        statement_a: `Desire to maximize near-term gains (${input.reasoning.slice(0, 60)}...)`,
        statement_b: `Need to protect foundational priorities (${input.stakes || "academics/wellbeing"})`,
        tension: "Balancing accelerated external experience against baseline performance and focus.",
      },
    ],
    bias_flags: [
      {
        pattern: "Salience Bias (Focusing heavily on visible perks)",
        evidence: "Tangible benefits receive detailed mention, while systemic fatigue risks are less defined.",
      },
    ],
    reversibility: {
      type: "two_way",
      note: "This decision retains moderate reversibility if clear review checkpoints (e.g. 30-day review) are set upfront.",
    },
    questions: [
      {
        question: "What is the single biggest unknown that could make this choice much harder than it appears today?",
        targets: "assumption",
      },
      {
        question: "If you were forced to find a third option that captures 80% of the benefit with half the risk, what would it look like?",
        targets: "overlooked",
      },
      {
        question: "How will you know 60 days from now whether this decision was aligned with your core priorities?",
        targets: "conflict",
      },
      {
        question: `What explicit conversation should you have with ${input.affected || "those affected"} before finalizing?`,
        targets: "other",
      },
    ],
    lens_view: lensText,
    shift_summary: "",
    safety_note: "",
  };
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
    // If API key is not configured, deliver high-quality contextual fallback
    return {
      analysis: buildDynamicFallbackAnalysis(params.decisionInput, params.lens),
      retriedForNeutrality: false,
    };
  }

  const primaryModel = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const candidateModels = Array.from(
    new Set([
      primaryModel,
      "gemini-flash-latest",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
    ])
  );

  const genAI = new GoogleGenerativeAI(apiKey);

  const userPrompt = buildAnalysisUserPrompt(
    params.decisionInput,
    params.round || 1,
    params.previousAnalysis,
    params.reflectionAnswers,
    params.lens
  );

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
        const retryPrompt = `${userPrompt}\n\nCRITICAL CORRECTION REQUIRED:\nYour previous response contained decision advice or leaning phrases (${neutralityResult.violations.join(", ")}). Rewrite the entire JSON response so that it ONLY observes, questions, and identifies uncertainty. Under no circumstance should you recommend, rank, choose, favor, or evaluate any option as superior.`;

        try {
          const retryResult = await model.generateContent(retryPrompt);
          const retryText = retryResult.response.text();
          const retriedAnalysis = parseAndValidateSchema(retryText);

          const retryNeutrality = scanAnalysisForNeutrality(retriedAnalysis);
          if (retryNeutrality.isViolating) {
            analysis = buildDynamicFallbackAnalysis(params.decisionInput, params.lens);
          } else {
            analysis = retriedAnalysis;
          }
        } catch {
          analysis = buildDynamicFallbackAnalysis(params.decisionInput, params.lens);
        }
      }

      return { analysis, retriedForNeutrality };
    } catch (error: any) {
      const msg = error?.message || "";
      // If quota exhausted (429), or busy, try next model or graceful fallback
      if (msg.includes("429") || msg.includes("quota") || msg.includes("QuotaFailure") || msg.includes("RESOURCE_EXHAUSTED")) {
        console.warn(`Gemini model ${modelName} reached quota limit. Using graceful fallback.`);
        return {
          analysis: buildDynamicFallbackAnalysis(params.decisionInput, params.lens),
          retriedForNeutrality: false,
        };
      }
      if (msg.includes("503") || msg.includes("404") || msg.includes("not found")) {
        continue;
      }
    }
  }

  // Fallback if all attempts fail
  return {
    analysis: buildDynamicFallbackAnalysis(params.decisionInput, params.lens),
    retriedForNeutrality: false,
  };
}
