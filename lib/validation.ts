import { DecisionInput } from "@/types/analysis";

export interface ValidationError {
  field?: keyof DecisionInput | "form" | "honeypot";
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const MAX_TOTAL_CHARACTERS = 3000;

export function validateDecisionInput(
  input: Partial<DecisionInput>,
  isServerCheck = false
): ValidationResult {
  const errors: ValidationError[] = [];

  // Honeypot check (server or client)
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return {
      isValid: false,
      errors: [{ field: "honeypot", message: "Bot activity detected." }],
    };
  }

  // Minimum time to submit check (server-side only)
  if (isServerCheck && input.clientTimestamp) {
    const elapsed = Date.now() - input.clientTimestamp;
    // If submitted in less than 500ms, likely a script
    if (elapsed < 500 && elapsed >= 0) {
      return {
        isValid: false,
        errors: [{ field: "form", message: "Input was entered too fast. Please take your time." }],
      };
    }
  }

  // Required field validations
  if (!input.decision || input.decision.trim().length < 5) {
    errors.push({
      field: "decision",
      message: "Please describe the decision you are considering (at least 5 characters).",
    });
  } else if (input.decision.length > 600) {
    errors.push({
      field: "decision",
      message: "Decision description cannot exceed 600 characters.",
    });
  }

  if (!input.options || input.options.trim().length < 3) {
    errors.push({
      field: "options",
      message: "Please list the options you are considering (e.g. Option A vs Option B).",
    });
  } else if (input.options.length > 600) {
    errors.push({
      field: "options",
      message: "Options cannot exceed 600 characters.",
    });
  }

  if (!input.reasoning || input.reasoning.trim().length < 10) {
    errors.push({
      field: "reasoning",
      message: "Please share why you are leaning this way or what factors you are weighing.",
    });
  } else if (input.reasoning.length > 1000) {
    errors.push({
      field: "reasoning",
      message: "Reasoning cannot exceed 1,000 characters.",
    });
  }

  if (!input.deadline || input.deadline.trim().length === 0) {
    errors.push({
      field: "deadline",
      message: "Please specify a timeframe or deadline.",
    });
  } else if (input.deadline.length > 200) {
    errors.push({
      field: "deadline",
      message: "Deadline cannot exceed 200 characters.",
    });
  }

  if (!input.stakes || input.stakes.trim().length === 0) {
    errors.push({
      field: "stakes",
      message: "Please specify what is at stake.",
    });
  } else if (input.stakes.length > 500) {
    errors.push({
      field: "stakes",
      message: "Stakes cannot exceed 500 characters.",
    });
  }

  if (!input.affected || input.affected.trim().length === 0) {
    errors.push({
      field: "affected",
      message: "Please specify who is affected.",
    });
  } else if (input.affected.length > 300) {
    errors.push({
      field: "affected",
      message: "Affected parties cannot exceed 300 characters.",
    });
  }

  if (input.context && input.context.length > 1000) {
    errors.push({
      field: "context",
      message: "Additional context cannot exceed 1,000 characters.",
    });
  }

  // Total character limit check
  const totalLength =
    (input.decision?.length || 0) +
    (input.options?.length || 0) +
    (input.reasoning?.length || 0) +
    (input.deadline?.length || 0) +
    (input.stakes?.length || 0) +
    (input.affected?.length || 0) +
    (input.context?.length || 0);

  if (totalLength > MAX_TOTAL_CHARACTERS) {
    errors.push({
      field: "form",
      message: `Total input exceeds limit of ${MAX_TOTAL_CHARACTERS} characters (currently ${totalLength}).`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
