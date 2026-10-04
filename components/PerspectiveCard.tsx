"use client";

import { useState } from "react";
import { Compass, Clock, UserX, Users, Sparkles, RefreshCw } from "lucide-react";
import { LensType } from "@/types/analysis";

interface LensOption {
  id: LensType;
  title: string;
  subtitle: string;
  icon: typeof Clock;
  gradient: string;
}

const LENSES: LensOption[] = [
  {
    id: "future_self_5_years",
    title: "5 Years From Now",
    subtitle: "Look back with the clarity of long-term hindsight",
    icon: Clock,
    gradient: "from-cyan-500/15 to-blue-500/15 border-cyan-500/40 text-cyan-700 dark:text-cyan-300",
  },
  {
    id: "someone_who_disagrees",
    title: "Someone Who Disagrees",
    subtitle: "Examine counter-arguments from a thoughtful critic",
    icon: UserX,
    gradient: "from-rose-500/15 to-pink-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300",
  },
  {
    id: "someone_affected",
    title: "Someone Affected",
    subtitle: "See the ripple effects through stakeholders' eyes",
    icon: Users,
    gradient: "from-emerald-500/15 to-teal-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300",
  },
];

export function PerspectiveCard({
  activeLens,
  lensViewText,
  isLoadingLens,
  onSelectLens,
}: {
  activeLens?: LensType;
  lensViewText?: string;
  isLoadingLens: boolean;
  onSelectLens: (lens: LensType) => void;
}) {
  return (
    <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <Compass className="w-5 h-5" />
            <h3 className="text-lg font-bold text-foreground uppercase tracking-wide font-display">
              CHANGE YOUR LENS
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-text-muted">
            Shift your perspective to illuminate factors hidden from your current vantage point.
          </p>
        </div>
      </div>

      {/* Lens selection buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {LENSES.map((lens) => {
          const Icon = lens.icon;
          const isSelected = activeLens === lens.id;

          return (
            <button
              key={lens.id}
              onClick={() => onSelectLens(lens.id)}
              disabled={isLoadingLens}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[90px] focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                isSelected
                  ? `bg-gradient-to-br ${lens.gradient} ring-2 ring-indigo-500 shadow-md`
                  : "bg-surface-raised hover:bg-surface-hover border-border text-foreground/80 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? "text-indigo-600 dark:text-white" : "text-text-muted"}`} />
                {isSelected && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 uppercase font-semibold">
                    Active Lens
                  </span>
                )}
              </div>
              <div>
                <span className="block text-sm font-bold text-foreground mb-0.5">
                  {lens.title}
                </span>
                <span className="block text-xs text-text-muted leading-tight">
                  {lens.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Loading state for lens */}
      {isLoadingLens && (
        <div className="p-6 rounded-2xl bg-surface-raised border border-indigo-500/30 flex items-center justify-center gap-3 text-indigo-600 dark:text-indigo-300 text-sm animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Refocusing mirror through the selected lens...</span>
        </div>
      )}

      {/* Active Lens View Result */}
      {lensViewText && !isLoadingLens && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-raised to-indigo-50/50 dark:to-indigo-950/30 border border-indigo-500/40 shadow-inner space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>LENS VIEW: {LENSES.find((l) => l.id === activeLens)?.title || "Selected Perspective"}</span>
          </div>
          <div className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line">
            {lensViewText}
          </div>
          <p className="text-[11px] text-text-muted italic pt-2 border-t border-border">
            This perspective is generated strictly for reflective context and does not recommend any specific decision.
          </p>
        </div>
      )}
    </div>
  );
}
