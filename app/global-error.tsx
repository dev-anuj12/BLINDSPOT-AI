"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global boundary error:", error.message);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090A0F] text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#12141F] border border-[#2A3047] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">System Interruption</h2>
            <p className="text-xs text-gray-400">
              An unexpected error occurred in the core interface. Let&apos;s reset the application state.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
