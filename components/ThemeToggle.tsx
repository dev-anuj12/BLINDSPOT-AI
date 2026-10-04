"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  const applyTheme = (mode: ThemeMode) => {
    if (typeof window === "undefined") return;
    
    const root = document.documentElement;
    const body = document.body;
    const isDark =
      mode === "dark" ||
      (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
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
    let initialMode: ThemeMode = "system";
    try {
      const saved = localStorage.getItem("bsai_theme") as ThemeMode | null;
      if (saved === "light" || saved === "dark" || saved === "system") {
        initialMode = saved;
      }
    } catch {
      initialMode = "system";
    }

    setTheme(initialMode);
    applyTheme(initialMode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      try {
        const currentSaved = localStorage.getItem("bsai_theme") as ThemeMode | null;
        if (!currentSaved || currentSaved === "system") {
          applyTheme("system");
        }
      } catch {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const handleSelectTheme = (mode: ThemeMode) => {
    setTheme(mode);
    try {
      localStorage.setItem("bsai_theme", mode);
    } catch (e) {
      console.warn("Unable to save theme to localStorage", e);
    }
    applyTheme(mode);
  };

  return (
    <div
      role="group"
      aria-label="Theme selector"
      className="flex items-center p-1 rounded-2xl bg-surface-raised border border-border shadow-sm transition-colors duration-200"
    >
      {/* Light Mode Button */}
      <button
        type="button"
        onClick={() => handleSelectTheme("light")}
        aria-label="Light theme"
        aria-pressed={mounted && theme === "light"}
        title="Switch to Light theme"
        className={`relative flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] cursor-pointer ${
          mounted && theme === "light"
            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/40 shadow-sm"
            : "text-text-muted hover:text-foreground hover:bg-surface-hover"
        }`}
      >
        <svg
          className="w-4 h-4 sm:w-4 sm:h-4 transition-transform active:scale-90"
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
      </button>

      {/* Dark Mode Button */}
      <button
        type="button"
        onClick={() => handleSelectTheme("dark")}
        aria-label="Dark theme"
        aria-pressed={mounted && theme === "dark"}
        title="Switch to Dark theme"
        className={`relative flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] cursor-pointer ${
          mounted && theme === "dark"
            ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-500/40 shadow-sm"
            : "text-text-muted hover:text-foreground hover:bg-surface-hover"
        }`}
      >
        <svg
          className="w-4 h-4 sm:w-4 sm:h-4 transition-transform active:scale-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>

      {/* System Mode Button */}
      <button
        type="button"
        onClick={() => handleSelectTheme("system")}
        aria-label="System theme"
        aria-pressed={mounted && theme === "system"}
        title="Follow system theme"
        className={`relative flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] cursor-pointer ${
          mounted && theme === "system"
            ? "bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold border border-purple-500/40 shadow-sm"
            : "text-text-muted hover:text-foreground hover:bg-surface-hover"
        }`}
      >
        <svg
          className="w-4 h-4 sm:w-4 sm:h-4 transition-transform active:scale-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      </button>
    </div>
  );
}
