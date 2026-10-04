"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { QuestionItem, ReflectionAnswer, BlindSpotAnalysis, DecisionInput } from "@/types/analysis";
import { trackEvent } from "@/lib/analytics";

export function ReflectionMode({
  questions,
  decisionInput,
  currentAnalysis,
  currentRound,
  onCompleteRound2,
  onCancel,
}: {
  questions: QuestionItem[];
  decisionInput: DecisionInput;
  currentAnalysis: BlindSpotAnalysis;
  currentRound: number;
  onCompleteRound2: (answers: ReflectionAnswer[], updatedAnalysis: BlindSpotAnalysis) => void;
  onCancel: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex] || "";
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleAnswerChange = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: val }));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    trackEvent("reflection_round_2");

    const formattedAnswers: ReflectionAnswer[] = questions.map((q, idx) => ({
      question: q.question,
      answer: (answers[idx] || "").trim() || "No specific answer noted.",
      target: q.targets,
    }));

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisionInput,
          round: currentRound + 1,
          previousAnalysis: currentAnalysis,
          reflectionAnswers: formattedAnswers,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update reflection mirror.");
      }

      onCompleteRound2(formattedAnswers, json.data);
    } catch (err: any) {
      setErrorMessage(err?.message || "Something interrupted the reflection. Your input is saved - please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-lg font-bold text-foreground uppercase tracking-wide font-display">
              REFLECT ON YOUR THINKING (ROUND {currentRound + 1})
            </h3>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Guiding Quote */}
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-800 dark:text-indigo-300">
          <p className="font-medium">
            &quot;The goal isn&apos;t to find the &apos;right&apos; answer. The goal is to understand your reasoning better.&quot;
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Current Question & Answer Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-semibold">
              Inquiry Focus: {activeQuestion?.targets || "reflection"}
            </span>
            <h4 className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
              &quot;{activeQuestion?.question}&quot;
            </h4>
          </div>

          <textarea
            rows={4}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Write your candid reflection here... (What comes to mind? What are you realizing?)"
            className="w-full rounded-2xl bg-surface-raised border border-border px-4 py-3 text-sm text-foreground placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={currentIndex === 0 ? onCancel : handleBack}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-surface-raised hover:bg-surface-hover text-foreground/80 border border-border flex items-center gap-1.5 transition-all min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentIndex === 0 ? "Cancel" : "Previous Question"}</span>
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Round {currentRound + 1}...</span>
                </>
              ) : (
                <>
                  <span>SEE UPDATED MIRROR</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow flex items-center gap-1.5 transition-all min-h-[44px]"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
