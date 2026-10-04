"use client";

import { useState } from "react";
import { MessageSquare, Target, ChevronDown, ChevronUp, Edit3 } from "lucide-react";
import { QuestionItem, QuestionTarget } from "@/types/analysis";

const TARGET_TAG_LABELS: Record<QuestionTarget, { label: string; bg: string; text: string; border: string }> = {
  assumption: {
    label: "Challenges Assumption",
    bg: "bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-500/30",
  },
  overlooked: {
    label: "Illuminates Blind Spot",
    bg: "bg-pink-500/10",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-500/30",
  },
  conflict: {
    label: "Probes Trade-off",
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-500/30",
  },
  other: {
    label: "Explores Context",
    bg: "bg-indigo-500/10",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-500/30",
  },
};

export function QuestionCard({
  item,
  index,
  onReflect,
}: {
  item: QuestionItem;
  index: number;
  onReflect?: (question: QuestionItem) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickThought, setQuickThought] = useState("");

  const tagStyle = TARGET_TAG_LABELS[item.targets] || TARGET_TAG_LABELS.other;

  return (
    <div className="bg-surface-raised border border-border hover:border-indigo-500/40 rounded-2xl p-5 transition-all duration-300 shadow-sm space-y-3 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border}`}
          >
            {tagStyle.label}
          </span>
        </div>

        {onReflect && (
          <button
            onClick={() => onReflect(item)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold inline-flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded-lg px-2 py-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Reflect on this</span>
          </button>
        )}
      </div>

      <h4 className="text-base sm:text-lg font-medium text-foreground leading-relaxed pt-1">
        &quot;{item.question}&quot;
      </h4>

      {/* Quick In-Place Note Drawer */}
      <div className="pt-2 border-t border-border">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-text-muted hover:text-foreground flex items-center gap-1 focus:outline-none"
        >
          <span>{isExpanded ? "Hide scratchpad" : "Jot a private note on this question"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isExpanded && (
          <div className="mt-2 animate-in fade-in duration-200">
            <textarea
              rows={2}
              value={quickThought}
              onChange={(e) => setQuickThought(e.target.value)}
              placeholder="What immediate thoughts or uncertainties does this spark?"
              className="w-full text-xs bg-surface border border-border rounded-xl p-2.5 text-foreground placeholder-text-muted/60 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}
