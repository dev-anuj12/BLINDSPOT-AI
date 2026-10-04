"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, HelpCircle, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { DecisionInput } from "@/types/analysis";
import { validateDecisionInput, MAX_TOTAL_CHARACTERS } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";

const DEMO_PAYLOAD: DecisionInput = {
  decision: "I'm deciding whether to accept a 6-month internship.",
  options: "Accept the internship or decline it.",
  reasoning: "I'm mainly considering it because the stipend is good, the company is close to home, and it will give me industry experience.",
  deadline: "I need to decide within the next week.",
  stakes: "My academic performance, career experience, time, and income.",
  affected: "Me and potentially my family.",
  context: "The internship is 30 hours per week and my semester exams are in 3 months.",
};

interface FormErrors {
  decision?: string;
  options?: string;
  reasoning?: string;
  deadline?: string;
  stakes?: string;
  affected?: string;
  context?: string;
  form?: string;
}

export function DecisionForm({ autoLoadDemo = false }: { autoLoadDemo?: boolean }) {
  const router = useRouter();
  const [formData, setFormData] = useState<DecisionInput>({
    decision: "",
    options: "",
    reasoning: "",
    deadline: "",
    stakes: "",
    affected: "",
    context: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timestamp, setTimestamp] = useState<number>(0);

  // Field refs for auto-focusing on validation error
  const fieldRefs = {
    decision: useRef<HTMLTextAreaElement>(null),
    options: useRef<HTMLTextAreaElement>(null),
    reasoning: useRef<HTMLTextAreaElement>(null),
    deadline: useRef<HTMLInputElement>(null),
    stakes: useRef<HTMLTextAreaElement>(null),
    affected: useRef<HTMLTextAreaElement>(null),
    context: useRef<HTMLTextAreaElement>(null),
  };

  useEffect(() => {
    setTimestamp(Date.now());

    // Check if previous session exists to restore draft
    const saved = sessionStorage.getItem("blindspot_active_input");
    if (saved && !autoLoadDemo) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch {}
    } else if (autoLoadDemo) {
      handleFillDemo();
    }
  }, [autoLoadDemo]);

  const totalCharacters =
    (formData.decision?.length || 0) +
    (formData.options?.length || 0) +
    (formData.reasoning?.length || 0) +
    (formData.deadline?.length || 0) +
    (formData.stakes?.length || 0) +
    (formData.affected?.length || 0) +
    (formData.context?.length || 0);

  const handleFillDemo = () => {
    setFormData({
      ...DEMO_PAYLOAD,
      honeypot: "",
    });
    setErrors({});
    trackEvent("demo_clicked");
  };

  const handleChange = (
    field: keyof DecisionInput,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionInput: DecisionInput = {
      ...formData,
      clientTimestamp: timestamp,
    };

    const validation = validateDecisionInput(submissionInput);

    if (!validation.isValid) {
      const errMap: FormErrors = {};
      let firstInvalidKey: keyof typeof fieldRefs | null = null;

      validation.errors.forEach((err) => {
        if (err.field && err.field in fieldRefs) {
          errMap[err.field as keyof FormErrors] = err.message;
          if (!firstInvalidKey) {
            firstInvalidKey = err.field as keyof typeof fieldRefs;
          }
        } else {
          errMap.form = err.message;
        }
      });

      setErrors(errMap);

      if (firstInvalidKey) {
        const targetRef = fieldRefs[firstInvalidKey as keyof typeof fieldRefs];
        if (targetRef && targetRef.current) {
          targetRef.current.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);
    trackEvent("analysis_started");

    try {
      // Store in sessionStorage for results page
      sessionStorage.setItem("blindspot_active_input", JSON.stringify(submissionInput));
      sessionStorage.removeItem("blindspot_active_analysis");
      sessionStorage.removeItem("blindspot_active_round");
      sessionStorage.removeItem("blindspot_reflection_answers");
    } catch (e) {
      console.warn("Storage warning:", e);
    }

    router.push("/results");

    // Fallback if client-side router transition is blocked
    setTimeout(() => {
      if (window.location.pathname !== "/results") {
        window.location.href = "/results";
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-xl transition-colors duration-200 relative">
      {/* Top Header bar with live counter & Demo button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-display">
            WHAT DECISION ARE YOU CONSIDERING?
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Provide the details you are weighing. The mirror will map your assumptions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillDemo}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <span>See an example</span>
        </button>
      </div>

      {errors.form && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Hidden Honeypot Field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website_url_hp">Leave this blank</label>
          <input
            type="text"
            id="website_url_hp"
            name="website_url_hp"
            tabIndex={-1}
            autoComplete="off"
            value={formData.honeypot || ""}
            onChange={(e) => handleChange("honeypot", e.target.value)}
          />
        </div>

        {/* 1. Decision Description */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="field-decision"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              1. The Decision <span className="text-pink-500">*</span>
            </label>
            <span className="text-[11px] text-text-muted font-mono">
              {formData.decision.length}/600
            </span>
          </div>
          <textarea
            id="field-decision"
            ref={fieldRefs.decision}
            rows={3}
            value={formData.decision}
            onChange={(e) => handleChange("decision", e.target.value)}
            placeholder="e.g. I'm deciding whether to accept a 6-month internship or continue with full-time coursework."
            aria-invalid={Boolean(errors.decision)}
            aria-describedby={errors.decision ? "err-decision" : "desc-decision"}
            className={`w-full rounded-2xl bg-surface-raised border px-4 py-3 text-base text-foreground placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              errors.decision ? "border-rose-500/80 ring-1 ring-rose-500/40" : "border-border hover:border-gray-400 dark:hover:border-gray-600"
            }`}
          />
          <p id="desc-decision" className="text-xs text-text-muted">
            Clearly state what choice is in front of you.
          </p>
          {errors.decision && (
            <p id="err-decision" className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {errors.decision}
            </p>
          )}
        </div>

        {/* 2. Options */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="field-options"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              2. Options I&apos;m Considering <span className="text-pink-500">*</span>
            </label>
            <span className="text-[11px] text-text-muted font-mono">
              {formData.options.length}/600
            </span>
          </div>
          <textarea
            id="field-options"
            ref={fieldRefs.options}
            rows={2}
            value={formData.options}
            onChange={(e) => handleChange("options", e.target.value)}
            placeholder="e.g. Option A: Accept offer. Option B: Decline and focus on research."
            aria-invalid={Boolean(errors.options)}
            aria-describedby={errors.options ? "err-options" : undefined}
            className={`w-full rounded-2xl bg-surface-raised border px-4 py-3 text-base text-foreground placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              errors.options ? "border-rose-500/80 ring-1 ring-rose-500/40" : "border-border hover:border-gray-400 dark:hover:border-gray-600"
            }`}
          />
          {errors.options && (
            <p id="err-options" className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {errors.options}
            </p>
          )}
        </div>

        {/* 3. Reasoning / Leaning */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="field-reasoning"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              3. Why I&apos;m Leaning This Way <span className="text-pink-500">*</span>
            </label>
            <span className="text-[11px] text-text-muted font-mono">
              {formData.reasoning.length}/1000
            </span>
          </div>
          <textarea
            id="field-reasoning"
            ref={fieldRefs.reasoning}
            rows={4}
            value={formData.reasoning}
            onChange={(e) => handleChange("reasoning", e.target.value)}
            placeholder="e.g. I'm mainly considering it because the stipend is good, the company is close to home, and it will give me industry experience."
            aria-invalid={Boolean(errors.reasoning)}
            aria-describedby={errors.reasoning ? "err-reasoning" : "desc-reasoning"}
            className={`w-full rounded-2xl bg-surface-raised border px-4 py-3 text-base text-foreground placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              errors.reasoning ? "border-rose-500/80 ring-1 ring-rose-500/40" : "border-border hover:border-gray-400 dark:hover:border-gray-600"
            }`}
          />
          <p id="desc-reasoning" className="text-xs text-text-muted">
            Share what factors are currently drawing your attention the most.
          </p>
          {errors.reasoning && (
            <p id="err-reasoning" className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {errors.reasoning}
            </p>
          )}
        </div>

        {/* Grid: 4. Deadline, 5. Stakes, 6. Affected */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Deadline */}
          <div className="space-y-2">
            <label
              htmlFor="field-deadline"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              4. Timeframe / Deadline <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              id="field-deadline"
              ref={fieldRefs.deadline}
              value={formData.deadline}
              onChange={(e) => handleChange("deadline", e.target.value)}
              placeholder="e.g. Next Monday"
              aria-invalid={Boolean(errors.deadline)}
              aria-describedby={errors.deadline ? "err-deadline" : undefined}
              className={`w-full rounded-xl bg-surface-raised border px-4 py-3 text-base text-foreground placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.deadline ? "border-rose-500/80" : "border-border hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            />
            {errors.deadline && (
              <p id="err-deadline" className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {errors.deadline}
              </p>
            )}
          </div>

          {/* Stakes */}
          <div className="space-y-2">
            <label
              htmlFor="field-stakes"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              5. What&apos;s At Stake? <span className="text-pink-500">*</span>
            </label>
            <textarea
              id="field-stakes"
              ref={fieldRefs.stakes}
              rows={2}
              value={formData.stakes}
              onChange={(e) => handleChange("stakes", e.target.value)}
              placeholder="e.g. My grades, time, income"
              aria-invalid={Boolean(errors.stakes)}
              aria-describedby={errors.stakes ? "err-stakes" : undefined}
              className={`w-full rounded-xl bg-surface-raised border px-4 py-2.5 text-base text-foreground placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.stakes ? "border-rose-500/80" : "border-border hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            />
            {errors.stakes && (
              <p id="err-stakes" className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {errors.stakes}
              </p>
            )}
          </div>

          {/* Affected */}
          <div className="space-y-2">
            <label
              htmlFor="field-affected"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              6. Who Is Affected? <span className="text-pink-500">*</span>
            </label>
            <textarea
              id="field-affected"
              ref={fieldRefs.affected}
              rows={2}
              value={formData.affected}
              onChange={(e) => handleChange("affected", e.target.value)}
              placeholder="e.g. Me and my family"
              aria-invalid={Boolean(errors.affected)}
              aria-describedby={errors.affected ? "err-affected" : undefined}
              className={`w-full rounded-xl bg-surface-raised border px-4 py-2.5 text-base text-foreground placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.affected ? "border-rose-500/80" : "border-border hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            />
            {errors.affected && (
              <p id="err-affected" className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {errors.affected}
              </p>
            )}
          </div>
        </div>

        {/* 7. Additional Context (Optional) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="field-context"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              7. Additional Context <span className="text-text-muted font-normal">(Optional)</span>
            </label>
            <span className="text-[11px] text-text-muted font-mono">
              {(formData.context || "").length}/1000
            </span>
          </div>
          <textarea
            id="field-context"
            ref={fieldRefs.context}
            rows={2}
            value={formData.context || ""}
            onChange={(e) => handleChange("context", e.target.value)}
            placeholder="e.g. The internship requires 30 hours per week and my exams are in 3 months."
            className="w-full rounded-2xl bg-surface-raised border border-border px-4 py-3 text-base text-foreground placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-gray-400 dark:hover:border-gray-600"
          />
        </div>

        {/* Live Total Counter and Action Strip */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-text-muted">
            Total characters:{" "}
            <span
              className={
                totalCharacters > MAX_TOTAL_CHARACTERS
                  ? "text-rose-600 dark:text-rose-400 font-bold"
                  : totalCharacters > 2500
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-indigo-600 dark:text-indigo-400"
              }
            >
              {totalCharacters}
            </span>{" "}
            / {MAX_TOTAL_CHARACTERS}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || totalCharacters > MAX_TOTAL_CHARACTERS}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Preparing Mirror...</span>
              </>
            ) : (
              <>
                <span>REFLECT ON MY THINKING</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
