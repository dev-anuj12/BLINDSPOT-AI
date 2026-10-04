"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { BlindSpotAnalysis, DecisionInput } from "@/types/analysis";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { trackEvent } from "@/lib/analytics";

export default function ResultsPage() {
  const router = useRouter();
  const [decisionInput, setDecisionInput] = useState<DecisionInput | null>(null);
  const [analysis, setAnalysis] = useState<BlindSpotAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Read input and cached analysis from sessionStorage
    const storedInput = sessionStorage.getItem("blindspot_active_input");
    const storedAnalysis = sessionStorage.getItem("blindspot_active_analysis");

    if (!storedInput) {
      setIsLoading(false);
      return;
    }

    try {
      const parsedInput: DecisionInput = JSON.parse(storedInput);
      setDecisionInput(parsedInput);

      if (storedAnalysis) {
        setAnalysis(JSON.parse(storedAnalysis));
        setIsLoading(false);
      } else {
        // Fetch new analysis from API
        performAnalysis(parsedInput);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("Failed to parse decision data.");
    }
  }, []);

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
      sessionStorage.setItem("blindspot_active_analysis", JSON.stringify(json.data));
      sessionStorage.setItem("blindspot_active_round", "1");
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

  const handleRetry = () => {
    if (decisionInput) {
      performAnalysis(decisionInput);
    } else {
      router.push("/analyze");
    }
  };

  // Case 1: No decision input found in session
  if (!isLoading && !decisionInput) {
    return (
      <div className="py-20 px-4 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white font-display">
            No Active Decision Found
          </h2>
          <p className="text-sm text-gray-400">
            Please provide the details of the decision you are considering to generate your blind spot mirror.
          </p>
        </div>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Describe a Decision</span>
        </Link>
      </div>
    );
  }

  // Case 2: Error occurred during analysis
  if (!isLoading && errorMessage) {
    return (
      <div className="py-20 px-4 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white font-display">
            Reflection Interrupted
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {errorMessage}
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Analysis Again</span>
          </button>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-surface-raised hover:bg-surface-hover text-gray-300 border border-border font-semibold text-sm transition-all min-h-[44px]"
          >
            Edit Inputs
          </Link>
        </div>
      </div>
    );
  }

  // Case 3: Loading Analysis
  if (isLoading) {
    return (
      <div className="py-16 sm:py-24 px-4">
        <LoadingAnalysis />
      </div>
    );
  }

  // Case 4: Analysis Ready
  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {analysis && decisionInput && (
        <AnalysisDashboard analysis={analysis} decisionInput={decisionInput} />
      )}
    </div>
  );
}
