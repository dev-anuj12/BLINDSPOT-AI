import { ArrowLeftRight, Scale } from "lucide-react";
import { ConflictItem } from "@/types/analysis";

export function ConflictCard({ item }: { item: ConflictItem }) {
  return (
    <div className="bg-surface-raised/80 backdrop-blur-md border border-border/80 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-300 shadow-md space-y-4">
      <div className="flex items-center gap-2 text-amber-400">
        <Scale className="w-4 h-4" />
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-300">
          Identified Tension / Competing Priorities
        </span>
      </div>

      {/* Visual A <-> B representation */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center">
        <div className="md:col-span-5 bg-surface/90 border border-border/80 rounded-xl p-3.5 text-xs text-gray-200">
          <span className="block text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold mb-1">
            Perspective A
          </span>
          <p className="leading-relaxed">&quot;{item.statement_a}&quot;</p>
        </div>

        <div className="md:col-span-1 flex justify-center py-1">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>

        <div className="md:col-span-5 bg-surface/90 border border-border/80 rounded-xl p-3.5 text-xs text-gray-200">
          <span className="block text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold mb-1">
            Perspective B
          </span>
          <p className="leading-relaxed">&quot;{item.statement_b}&quot;</p>
        </div>
      </div>

      {/* Tension Note */}
      <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 leading-relaxed">
        <span className="font-semibold text-amber-300">Core Tension: </span>
        {item.tension}
      </div>
    </div>
  );
}
