"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  Shield,
  HelpCircle,
  RotateCcw,
  Printer,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  Scale,
  Brain,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  BlindSpotAnalysis,
  DecisionInput,
  ReflectionAnswer,
  LensType,
  AttentionLevel,
  ReversibilityType,
  QuestionItem,
} from "@/types/analysis";
import { BlindSpotCard } from "./BlindSpotCard";
import { AssumptionCard } from "./AssumptionCard";
import { ConflictCard } from "./ConflictCard";
import { PerspectiveCard } from "./PerspectiveCard";
import { QuestionCard } from "./QuestionCard";
import { ReflectionMode } from "./ReflectionMode";
import { trackEvent } from "@/lib/analytics";

const ATTENTION_CONFIG: Record<
  AttentionLevel,
  { label: string; badge: string; border: string; bg: string }
> = {
  high: {
    label: "HIGH ATTENTION",
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
    border: "border-rose-500/30",
    bg: "bg-rose-500/5 dark:bg-rose-500/5",
  },
  medium: {
    label: "MEDIUM ATTENTION",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5 dark:bg-amber-500/5",
  },
  low: {
    label: "LOW ATTENTION",
    badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/5 dark:bg-indigo-500/5",
  },
};

const REVERSIBILITY_CONFIG: Record<
  ReversibilityType,
  { title: string; badge: string; desc: string }
> = {
  one_way: {
    title: "ONE-WAY DOOR (HIGH COMMITMENT)",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40",
    desc: "Difficult or costly to reverse once enacted. Worth testing critical assumptions beforehand.",
  },
  two_way: {
    title: "TWO-WAY DOOR (REVERSIBLE)",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40",
    desc: "Can likely be adjusted or unwound later if new evidence emerges.",
  },
  unclear: {
    title: "REVERSIBILITY UNCLEAR",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40",
    desc: "Depends heavily on specific agreements, relationship dynamics, or timeline factors.",
  },
};

export function AnalysisDashboard({
  analysis: initialAnalysis,
  decisionInput,
}: {
  analysis: BlindSpotAnalysis;
  decisionInput: DecisionInput;
}) {
  const [analysis, setAnalysis] = useState<BlindSpotAnalysis>(initialAnalysis);
  const [round, setRound] = useState<number>(1);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [selectedLens, setSelectedLens] = useState<LensType | undefined>();
  const [isLoadingLens, setIsLoadingLens] = useState(false);
  const [copied, setCopied] = useState(false);

  const reversibilityMeta =
    REVERSIBILITY_CONFIG[analysis.reversibility?.type || "unclear"];

  const handleSelectLens = async (lens: LensType) => {
    setSelectedLens(lens);
    setIsLoadingLens(true);
    trackEvent("lens_selected", { lens });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisionInput,
          round,
          previousAnalysis: analysis,
          lens,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAnalysis((prev) => ({
          ...prev,
          lens_view: json.data.lens_view,
        }));
      }
    } catch {
      // Keep existing analysis if lens call fails
    } finally {
      setIsLoadingLens(false);
    }
  };

  const handleCompleteRound2 = (
    answers: ReflectionAnswer[],
    updatedAnalysis: BlindSpotAnalysis
  ) => {
    setAnalysis(updatedAnalysis);
    setRound((prev) => prev + 1);
    setIsReflectionOpen(false);
    sessionStorage.setItem("blindspot_active_analysis", JSON.stringify(updatedAnalysis));
    sessionStorage.setItem("blindspot_active_round", String(round + 1));
  };

  const handleCopySummary = () => {
    const text = `BLINDSPOT AI REFLECTION SUMMARY\n\nDecision: ${analysis.decision_summary}\n\nKey Weighing Factors:\n${analysis.weighing
      .map((w) => `- [${w.attention_level.toUpperCase()}] ${w.factor}: ${w.evidence}`)
      .join("\n")}\n\nUnexamined Assumptions:\n${analysis.assumptions
      .map((a) => `- ${a.assumption} (Test: ${a.how_to_test_it})`)
      .join("\n")}\n\nOverlooked Factors:\n${analysis.overlooked_factors
      .map((o) => `- ${o.category}: ${o.why_it_may_matter}`)
      .join("\n")}\n\nQuestions to Ask:\n${analysis.questions
      .map((q) => `? ${q.question}`)
      .join("\n")}\n\nReversibility: ${analysis.reversibility.type.toUpperCase()} - ${
      analysis.reversibility.note
    }`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto transition-colors duration-200">
      {/* Top Banner: Status & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-border rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-foreground font-display">
                BLIND SPOT MIRROR
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                ROUND {round}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Examining reasoning patterns without recommending any outcome.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-raised hover:bg-surface-hover text-foreground/80 border border-border flex items-center gap-1.5 transition-all min-h-[44px]"
            title="Copy reflection summary to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-raised hover:bg-surface-hover text-foreground/80 border border-border flex items-center gap-1.5 transition-all min-h-[44px]"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <Link
            href="/analyze"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 transition-all min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Decision</span>
          </Link>
        </div>
      </div>

      {/* Safety / Supportive Note (Rendered kindly if present) */}
      {analysis.safety_note && (
        <div
          role="alert"
          className="p-5 rounded-3xl bg-pink-500/10 dark:bg-pink-950/40 border border-pink-500/40 shadow-xl text-pink-900 dark:text-pink-200 text-xs sm:text-sm flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-pink-700 dark:text-pink-300">Supportive Note</h4>
            <p className="leading-relaxed">{analysis.safety_note}</p>
          </div>
        </div>
      )}

      {/* Evolution Summary if Round > 1 */}
      {analysis.shift_summary && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-surface dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-surface border border-indigo-500/30 shadow-xl space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400" />
            <span>WHAT CHANGED IN YOUR THINKING? (ROUND {round})</span>
          </div>
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
            {analysis.shift_summary}
          </p>
        </div>
      )}

      {/* Section 1: YOUR DECISION */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          YOUR DECISION
        </span>
        <h3 className="text-lg sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
          &quot;{analysis.decision_summary || decisionInput.decision}&quot;
        </h3>
        {analysis.status_message && (
          <p className="text-xs text-text-muted italic pt-1 border-t border-border">
            {analysis.status_message}
          </p>
        )}
      </div>

      {/* Section 2: WHAT GOT YOUR ATTENTION? */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wide font-display mb-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>WHAT GOT YOUR ATTENTION?</span>
          </h3>
          <p className="text-xs sm:text-sm text-text-muted">
            Factors you are actively weighing, categorized by your attention focus (High, Medium, Low).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.weighing.map((item, idx) => {
            const style = ATTENTION_CONFIG[item.attention_level] || ATTENTION_CONFIG.medium;

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${style.border} ${style.bg} space-y-2.5 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${style.badge}`}
                    >
                      {style.label}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-foreground">
                    {item.factor}
                  </h4>
                </div>
                <p className="text-xs text-text-muted italic border-t border-border pt-2">
                  &quot;{item.evidence}&quot;
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3 & 4 Grid: POTENTIAL BLIND SPOTS & HIDDEN ASSUMPTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overlooked Factors */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wide font-display mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 dark:bg-pink-400" />
              <span>POTENTIAL BLIND SPOTS</span>
            </h3>
            <p className="text-xs text-text-muted">
              Surrounding angles, unstated variables, or systemic effects not prominent in your reasoning.
            </p>
          </div>

          <div className="space-y-3">
            {analysis.overlooked_factors.map((item, idx) => (
              <BlindSpotCard key={idx} item={item} />
            ))}
          </div>
        </div>

        {/* Hidden Assumptions */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wide font-display mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
              <span>HIDDEN ASSUMPTIONS</span>
            </h3>
            <p className="text-xs text-text-muted">
              Beliefs taken for granted in your current logic, along with concrete ways to test them.
            </p>
          </div>

          <div className="space-y-4">
            {analysis.assumptions.map((item, idx) => (
              <AssumptionCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      </div>

      {/* Section 5: CONFLICTS & TRADE-OFFS */}
      {analysis.conflicts && analysis.conflicts.length > 0 && (
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wide font-display mb-1 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>CONFLICTS & TRADE-OFFS</span>
            </h3>
            <p className="text-xs text-text-muted">
              Underlying friction points between competing priorities in your text.
            </p>
          </div>

          <div className="space-y-4">
            {analysis.conflicts.map((conflict, idx) => (
              <ConflictCard key={idx} item={conflict} />
            ))}
          </div>
        </div>
      )}

      {/* Section 6: POSSIBLE REASONING PATTERNS */}
      {analysis.bias_flags && analysis.bias_flags.length > 0 && (
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wide font-display mb-1 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>POSSIBLE REASONING PATTERNS</span>
            </h3>
            <p className="text-xs text-text-muted">
              Gentle observations on common cognitive inclinations detected in the phrasing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.bias_flags.map((flag, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface-raised border border-border space-y-2"
              >
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <Lightbulb className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <h4 className="text-sm font-semibold text-foreground">
                    {flag.pattern}
                  </h4>
                </div>
                <p className="text-xs text-text-muted leading-relaxed italic border-t border-border pt-2">
                  Basis: &quot;{flag.evidence}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 7: CAN THIS DECISION BE UNDONE? */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            CAN THIS DECISION BE UNDONE?
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-raised border border-border">
          <div className="space-y-1">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border mb-1 ${reversibilityMeta.badge}`}
            >
              {reversibilityMeta.title}
            </span>
            <h4 className="text-sm sm:text-base font-semibold text-foreground">
              {analysis.reversibility?.note || reversibilityMeta.desc}
            </h4>
          </div>
        </div>
      </div>

      {/* Section 8: QUESTIONS WORTH ASKING */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wide font-display mb-1 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-pink-500 dark:text-pink-400" />
              <span>QUESTIONS WORTH ASKING</span>
            </h3>
            <p className="text-xs sm:text-sm text-text-muted">
              Open-ended inquiries designed to stretch your perspective.
            </p>
          </div>

          <button
            onClick={() => setIsReflectionOpen(true)}
            className="px-6 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-500/20 flex items-center gap-2 transition-all transform active:scale-95 min-h-[44px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>REFLECT ON YOUR THINKING</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.questions.map((q, idx) => (
            <QuestionCard
              key={idx}
              item={q}
              index={idx}
              onReflect={() => setIsReflectionOpen(true)}
            />
          ))}
        </div>
      </div>

      {/* Section 9: CHANGE YOUR LENS */}
      <PerspectiveCard
        activeLens={selectedLens}
        lensViewText={analysis.lens_view}
        isLoadingLens={isLoadingLens}
        onSelectLens={handleSelectLens}
      />

      {/* Bottom CTA Strip */}
      <div className="p-8 rounded-3xl bg-surface-raised border border-border flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h3 className="text-lg font-bold text-foreground font-display mb-1">
            Ready to test another layer of your decision?
          </h3>
          <p className="text-xs text-text-muted">
            Work through the questions or submit answers to build an updated mirror.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReflectionOpen(true)}
            className="px-6 py-3.5 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all min-h-[44px]"
          >
            REFLECT AGAIN
          </button>
        </div>
      </div>

      {/* Reflection Mode Modal Wizard */}
      {isReflectionOpen && (
        <ReflectionMode
          questions={analysis.questions}
          decisionInput={decisionInput}
          currentAnalysis={analysis}
          currentRound={round}
          onCompleteRound2={handleCompleteRound2}
          onCancel={() => setIsReflectionOpen(false)}
        />
      )}
    </div>
  );
}
