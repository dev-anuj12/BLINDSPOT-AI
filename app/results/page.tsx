"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { BlindSpotAnalysis, DecisionInput } from "@/types/analysis";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { trackEvent } from "@/lib/analytics";

const DEFAULT_SAMPLE_DECISION: DecisionInput = {
  decision: "I'm deciding whether to accept a 6-month internship offer.",
  options: "Option A: Accept offer. Option B: Decline and focus on studies.",
  reasoning: "I am considering it for industry experience and good stipend, but semester exams are in 3 months.",
  deadline: "Next Monday",
  stakes: "Academic performance, career trajectory, time commitments",
  affected: "Me and my family",
  context: "The internship is 30 hours per week.",
};

export default function ResultsPage() {
  const router = useRouter();
  const [decisionInput, setDecisionInput] = useState<DecisionInput | null>(null);
  const [analysis, setAnalysis] = useState<BlindSpotAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const performAnalysis = async (input: DecisionInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisionInput: input,
          round: 1,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error || "Something interrupted the reflection. Your decision is safe - let's try the analysis again."
        );
      }

      setAnalysis(json.data);
      try {
        sessionStorage.setItem("blindspot_active_analysis", JSON.stringify(json.data));
        sessionStorage.setItem("blindspot_active_round", "1");
      } catch {}
      trackEvent("analysis_completed");
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          "Something interrupted the reflection. Your decision is safe - let's try the analysis again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Read input and cached analysis from sessionStorage
    let storedInput: string | null = null;
    let storedAnalysis: string | null = null;
    try {
      storedInput = sessionStorage.getItem("blindspot_active_input");
      storedAnalysis = sessionStorage.getItem("blindspot_active_analysis");
    } catch {}

    if (!storedInput) {
      // Auto-fallback to sample decision so user is never stranded
      setDecisionInput(DEFAULT_SAMPLE_DECISION);
      performAnalysis(DEFAULT_SAMPLE_DECISION);
      return;
    }

    try {
      const parsedInput: DecisionInput = JSON.parse(storedInput);
      setDecisionInput(parsedInput);

      if (storedAnalysis) {
        setAnalysis(JSON.parse(storedAnalysis));
        setIsLoading(false);
      } else {
        performAnalysis(parsedInput);
      }
    } catch {
      setDecisionInput(DEFAULT_SAMPLE_DECISION);
      performAnalysis(DEFAULT_SAMPLE_DECISION);
    }
  }, []);

  const handleRetry = () => {
    if (decisionInput) {
      performAnalysis(decisionInput);
    } else {
      performAnalysis(DEFAULT_SAMPLE_DECISION);
    }
  };

  // Case 1: Error occurred during analysis
  if (!isLoading && errorMessage) {
    return (
      <div className="py-20 px-4 max-w-lg mx-auto text-center space-y-6 transition-colors duration-200">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground font-display">
            Reflection Interrupted
          </h2>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {errorMessage}
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all min-h-[44px] shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Analysis Again</span>
          </button>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-surface-raised hover:bg-surface-hover text-foreground border border-border font-semibold text-sm transition-all min-h-[44px] shadow-sm"
          >
            Edit Inputs
          </Link>
        </div>
      </div>
    );
  }

  // Case 2: Loading Analysis
  if (isLoading) {
    return (
      <div className="py-16 sm:py-24 px-4">
        <LoadingAnalysis />
      </div>
    );
  }

  // Case 3: Analysis Ready
  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {analysis && decisionInput && (
        <AnalysisDashboard analysis={analysis} decisionInput={decisionInput} />
      )}
    </div>
  );
}
