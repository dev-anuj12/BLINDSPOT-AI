export type AnalysisStatus = "ok" | "needs_more_info" | "not_a_decision";

export type AttentionLevel = "high" | "medium" | "low";

export type QuestionTarget = "assumption" | "overlooked" | "conflict" | "other";

export type ReversibilityType = "one_way" | "two_way" | "unclear";

export type LensType = "future_self_5_years" | "someone_who_disagrees" | "someone_affected";

export interface WeighingItem {
  factor: string;
  attention_level: AttentionLevel;
  evidence: string;
}

export interface AssumptionItem {
  assumption: string;
  evidence: string;
  how_to_test_it: string;
}

export interface OverlookedFactorItem {
  category: string;
  why_it_may_matter: string;
}

export interface ConflictItem {
  statement_a: string;
  statement_b: string;
  tension: string;
}

export interface BiasFlagItem {
  pattern: string;
  evidence: string;
}

export interface ReversibilityItem {
  type: ReversibilityType;
  note: string;
}

export interface QuestionItem {
  question: string;
  targets: QuestionTarget;
}

export interface BlindSpotAnalysis {
  status: AnalysisStatus;
  status_message: string;
  decision_summary: string;
  weighing: WeighingItem[];
  assumptions: AssumptionItem[];
  overlooked_factors: OverlookedFactorItem[];
  conflicts: ConflictItem[];
  bias_flags: BiasFlagItem[];
  reversibility: ReversibilityItem;
  questions: QuestionItem[];
  lens_view: string;
  shift_summary: string;
  safety_note: string;
}

export interface DecisionInput {
  decision: string;
  options: string;
  reasoning: string;
  deadline: string;
  stakes: string;
  affected: string;
  context?: string;
  honeypot?: string;
  clientTimestamp?: number;
}

export interface ReflectionAnswer {
  question: string;
  answer: string;
  target?: QuestionTarget;
}

export interface AnalyzeRequest {
  decisionInput: DecisionInput;
  round?: number;
  previousAnalysis?: BlindSpotAnalysis;
  reflectionAnswers?: ReflectionAnswer[];
  lens?: LensType;
  recaptchaToken?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: BlindSpotAnalysis;
  error?: string;
  retriedForNeutrality?: boolean;
}
