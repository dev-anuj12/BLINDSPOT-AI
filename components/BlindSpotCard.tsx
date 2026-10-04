import { EyeOff } from "lucide-react";
import { OverlookedFactorItem } from "@/types/analysis";

export function BlindSpotCard({ item }: { item: OverlookedFactorItem }) {
  return (
    <div className="bg-surface-raised border border-border hover:border-pink-500/40 rounded-2xl p-5 transition-all duration-300 group shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 group-hover:bg-pink-500/20 transition-colors">
          <EyeOff className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1.5">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-pink-700 dark:text-pink-300">
            {item.category}
          </span>
          <h4 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
            {item.why_it_may_matter}
          </h4>
        </div>
      </div>
    </div>
  );
}
