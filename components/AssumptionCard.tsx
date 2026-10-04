import { HelpCircle, Search, CheckCircle2 } from "lucide-react";
import { AssumptionItem } from "@/types/analysis";

export function AssumptionCard({ item, index }: { item: AssumptionItem; index: number }) {
  const isStated = item.evidence.toLowerCase().includes("stated");

  return (
    <div className="bg-surface-raised border border-border hover:border-purple-500/40 rounded-2xl p-5 transition-all duration-300 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-mono text-xs font-bold w-8 h-8 flex items-center justify-center flex-shrink-0">
          A{index + 1}
        </div>
        <div className="space-y-1 flex-1">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            Unexamined Assumption
          </span>
          <h4 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
            &quot;{item.assumption}&quot;
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border text-xs">
        {/* Evidence */}
        <div className="bg-surface rounded-xl p-3 border border-border">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Search className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Basis in Reasoning ({isStated ? "Stated" : "Inferred"})
            </span>
          </div>
          <p className="text-foreground/90 leading-relaxed italic">
            &quot;{item.evidence}&quot;
          </p>
        </div>

        {/* How to test it */}
        <div className="bg-surface rounded-xl p-3 border border-border">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              How to Test This Assumption
            </span>
          </div>
          <p className="text-foreground/90 leading-relaxed">
            {item.how_to_test_it}
          </p>
        </div>
      </div>
    </div>
  );
}
