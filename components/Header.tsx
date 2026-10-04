"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, Shield, Compass, Sparkles } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/40 group-hover:border-indigo-400/80 transition-all duration-300">
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-indigo-400 animate-spin-slow" />
            <div className="absolute w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-display">
                BLINDSPOT <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                COGNITIVE MIRROR
              </span>
            </div>
            <p className="text-[11px] text-gray-400 tracking-wide hidden md:block">
              Think beyond what you can see.
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/analyze"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all min-h-[44px] flex items-center gap-1.5 ${
              pathname === "/analyze"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                : "text-gray-300 hover:text-white hover:bg-surface"
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Reflect on Decision</span>
          </Link>

          <Link
            href="/privacy"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all min-h-[44px] flex items-center gap-1.5 ${
              pathname === "/privacy"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                : "text-gray-400 hover:text-gray-200 hover:bg-surface"
            }`}
          >
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="hidden sm:inline">Privacy</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-surface-raised border border-border text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Zero-Advice Rule Active</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
