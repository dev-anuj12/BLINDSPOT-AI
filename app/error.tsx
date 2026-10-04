"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log non-sensitive error to console or monitoring
    console.error("Application error:", error.message);
  }, [error]);

  return (
    <div className="py-24 px-4 max-w-lg mx-auto text-center space-y-6 transition-colors duration-200">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground font-display">
          Something Interrupted Your Reflection
        </h2>
        <p className="text-sm text-text-muted">
          Your decision information is safe. Let&apos;s refresh the mirror or return to the home screen.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-2 min-h-[44px] shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="px-5 py-3 rounded-2xl bg-surface-raised hover:bg-surface-hover text-foreground border border-border font-semibold text-xs transition-all flex items-center gap-2 min-h-[44px] shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
