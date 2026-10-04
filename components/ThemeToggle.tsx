"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  const applyTheme = (dark: boolean) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const body = document.body;

    if (dark) {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      if (body) {
        body.classList.add("dark");
        body.classList.remove("light");
      }
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      if (body) {
        body.classList.remove("dark");
        body.classList.add("light");
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    let initialIsDark = true;

    try {
      const saved = localStorage.getItem("bsai_theme");
      if (saved === "light") {
        initialIsDark = false;
      } else if (saved === "dark") {
        initialIsDark = true;
      } else {
        // Default based on system preference
        initialIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    } catch {
      initialIsDark = true;
    }

    setIsDark(initialIsDark);
    applyTheme(initialIsDark);
  }, []);

  const handleToggle = () => {
    const nextDarkState = !isDark;
    setIsDark(nextDarkState);

    const mode = nextDarkState ? "dark" : "light";
    try {
      localStorage.setItem("bsai_theme", mode);
    } catch (e) {
      console.warn("Unable to save theme", e);
    }

    applyTheme(nextDarkState);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        mounted
          ? isDark
            ? "Switch to Light mode"
            : "Switch to Dark mode"
          : "Toggle theme"
      }
      title={
        mounted
          ? isDark
            ? "Switch to Light mode (☀️)"
            : "Switch to Dark mode (🌙)"
          : "Toggle theme"
      }
      className="relative inline-flex items-center justify-center p-1 rounded-full w-[72px] h-[38px] min-h-[44px] min-w-[44px] bg-surface-raised border border-border hover:border-indigo-500/50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer shadow-inner"
    >
      {/* Background Track Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
        {/* Sun on left */}
        <svg
          className={`w-4 h-4 transition-opacity duration-200 ${
            !mounted || isDark ? "text-text-muted/40" : "text-amber-500 opacity-100"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Moon on right */}
        <svg
          className={`w-4 h-4 transition-opacity duration-200 ${
            !mounted || isDark ? "text-indigo-400 opacity-100" : "text-text-muted/40"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>

      {/* Sliding Thumb Knob */}
      <span
        className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md border transition-all duration-300 transform ${
          !mounted || isDark
            ? "translate-x-4 bg-indigo-950 border-indigo-500/60 text-indigo-300"
            : "-translate-x-4 bg-white border-amber-400/80 text-amber-500 shadow-amber-500/10"
        }`}
      >
        {!mounted || isDark ? (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}
      </span>
    </button>
  );
}
