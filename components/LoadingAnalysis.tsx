"use client";

import { useEffect, useState } from "react";
import { Compass, Sparkles, Eye, Target } from "lucide-react";

const STAGES = [
  { text: "READING YOUR REASONING...", detail: "Parsing decision context & options without bias" },
  { text: "IDENTIFYING WHAT GOT YOUR ATTENTION...", detail: "Mapping high, medium, and low salience factors" },
  { text: "CHECKING YOUR ASSUMPTIONS...", detail: "Separating stated evidence from inferred conclusions" },
  { text: "LOOKING FOR OVERLOOKED FACTORS...", detail: "Scanning surrounding angles & systemic impacts" },
  { text: "TESTING FOR CONFLICTS...", detail: "Detecting underlying tensions between competing values" },
  { text: "GENERATING QUESTIONS...", detail: "Crafting non-leading questions to open fresh perspectives" },
  { text: "BUILDING YOUR BLIND SPOT MIRROR...", detail: "Finalizing reflective structured framework" },
];

export function LoadingAnalysis() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const currentStage = STAGES[stageIndex];
  const progressPercent = Math.min(100, Math.round(((stageIndex + 1) / STAGES.length) * 100));

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-xl mx-auto">
      {/* Radar scanning SVG Visual */}
      <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
        {/* Outer concentric rings */}
        <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping opacity-30" />
        <div className="absolute inset-2 rounded-full border border-indigo-500/30" />
        <div className="absolute inset-6 rounded-full border border-purple-500/30" />
        <div className="absolute inset-10 rounded-full border border-dashed border-pink-500/40 animate-spin-slow" />
        
        {/* Radar beam */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="w-1/2 h-1/2 origin-bottom-right bg-gradient-to-tr from-transparent via-indigo-500/20 to-pink-500/40 animate-radar-sweep" />
        </div>

        {/* Center core */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-surface-raised border border-indigo-500/50 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
          <Target className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
      </div>

      {/* Rotating Stage Message */}
      <div className="space-y-2 min-h-[72px]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-1">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>STAGE {stageIndex + 1} OF {STAGES.length}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold tracking-wide text-white uppercase font-display animate-in fade-in duration-300">
          {currentStage.text}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400">
          {currentStage.detail}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mt-6 bg-surface-raised h-2 rounded-full overflow-hidden border border-border">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className="text-[11px] font-mono text-gray-400 mt-2">
        Scanning without judgment or advice
      </span>
    </div>
  );
}
