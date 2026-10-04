import { BlindSpotAnalysis } from "@/types/analysis";

// Patterns that indicate direct advisory language or ranking
const ADVICE_PATTERNS = [
  /\b(?:i|we)\s+(?:recommend|strongly recommend|advise|urge)\b/i,
  /\bmy\s+advice\s+is\b/i,
  /\b(?:the|your)\s+(?:better|best|wiser|wisest|right|correct|ideal|optimal|preferred|superior)\s+(?:choice|option|path|alternative|decision|route|move)\b/i,
  /\b(?:go\s+for\s+it|avoid\s+it\b|don'?t\s+hesitate|definitely\s+(?:take|accept|decline|reject|choose|pick|opt|go|avoid|do|don'?t))/i,
  /\byou\s+(?:should|ought\s+to|must|have\s+to)\s+(?:accept|decline|take|reject|pick|choose|opt\s+for|decide\s+on|leave|stay\s+at|quit|buy|sell|hire|fire|proceed\s+with\s+option|select|avoid|steer\s+clear\s+of)\b/i,
  /\byou\s+(?:would\s+be\s+better\s+off|are\s+better\s+off)\b/i,
  /\boption\s+[a-z0-9]+\s+is\s+(?:clearly\s+)?(?:better|worse|superior|inferior|the\s+right\s+choice)\b/i,
];

// Patterns that represent safe reflective phrasing (exceptions)
const REFLECTIVE_ALLOWLIST = [
  /\byou\s+should\s+(?:ask|consider|evaluate|explore|reflect|examine|weigh|question|verify|test|investigate|clarify|check|look\s+into)\b/i,
  /\byou\s+may\s+want\s+to\s+consider\b/i,
  /\byou\s+might\s+want\s+to\s+ask\b/i,
];

export interface ScanResult {
  isViolating: boolean;
  violations: string[];
}

export function scanTextForAdvice(text: string): { isViolating: boolean; match?: string } {
  if (!text || typeof text !== "string") return { isViolating: false };

  for (const pattern of ADVICE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      // Check if this specific match is part of an allowed reflective pattern
      const isReflective = REFLECTIVE_ALLOWLIST.some((allowed) => {
        const allowedMatch = text.match(allowed);
        return allowedMatch && allowedMatch.index !== undefined && match.index !== undefined &&
          Math.abs(allowedMatch.index - match.index) < 15;
      });

      if (!isReflective) {
        return { isViolating: true, match: match[0] };
      }
    }
  }

  return { isViolating: false };
}

export function scanAnalysisForNeutrality(data: unknown): ScanResult {
  const violations: string[] = [];

  function walk(node: unknown, path: string = "") {
    if (node === null || node === undefined) return;

    if (typeof node === "string") {
      const result = scanTextForAdvice(node);
      if (result.isViolating && result.match) {
        violations.push(`At ${path || "root"}: found advice phrasing "${result.match}"`);
      }
    } else if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${path}[${index}]`));
    } else if (typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        walk(value, path ? `${path}.${key}` : key);
      }
    }
  }

  walk(data);

  return {
    isViolating: violations.length > 0,
    violations,
  };
}

export function generateNeutralFallback(decisionSummary: string = "your decision"): BlindSpotAnalysis {
  return {
    status: "ok",
    status_message: "Analysis framed purely around observational inquiry and perspective exploration.",
    decision_summary: decisionSummary || "Decision under consideration",
    weighing: [
      {
        factor: "Immediate benefits vs long-term tradeoffs",
        attention_level: "high",
        evidence: "Stated in the primary reasoning provided.",
      },
      {
        factor: "Unstated external factors",
        attention_level: "medium",
        evidence: "Context details provide limited visibility into systemic effects.",
      },
    ],
    assumptions: [
      {
        assumption: "Current conditions and priorities will remain constant over the timeframe.",
        evidence: "Inferred from the framing of the timeline.",
        how_to_test_it: "List what changes in circumstances would make this choice harder or easier.",
      },
    ],
    overlooked_factors: [
      {
        category: "Opportunity Costs & Secondary Effects",
        why_it_may_matter: "Choosing one path inherently forecloses alternative investments of time or energy.",
      },
    ],
    conflicts: [
      {
        statement_a: "Desire to maximize short-term certainty",
        statement_b: "Long-term flexibility and growth objectives",
        tension: "Balancing immediate stability against future optionality.",
      },
    ],
    bias_flags: [
      {
        pattern: "Focus on visible immediate variables",
        evidence: "The stated reasoning centers heavily on near-term constraints.",
      },
    ],
    reversibility: {
      type: "two_way",
      note: "Depending on contractual terms and relationships, many decisions allow for future pivoting or re-negotiation.",
    },
    questions: [
      {
        question: "What information would fundamentally change how you view these options?",
        targets: "assumption",
      },
      {
        question: "If you were advising someone in this exact situation, what crucial question would you ask them?",
        targets: "other",
      },
      {
        question: "What is the worst plausible outcome, and what is your plan to handle it?",
        targets: "overlooked",
      },
      {
        question: "How will this choice feel 12 months after making it?",
        targets: "conflict",
      },
    ],
    lens_view: "",
    shift_summary: "",
    safety_note: "",
  };
}
