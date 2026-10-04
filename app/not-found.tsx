import Link from "next/link";
import { Compass, ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
          404 - UNMAPPED REGION
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
          The perspective you were looking for doesn&apos;t exist or has moved. Let&apos;s return to known ground.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-surface-raised hover:bg-surface-hover text-gray-200 border border-border font-semibold text-xs transition-all flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/analyze"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Reflect on Decision</span>
        </Link>
      </div>
    </div>
  );
}
