"use client";

import { useEffect, useState, useRef } from "react";

export type ThemeMode = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("bsai_theme") as ThemeMode | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
      setTheme(saved);
      applyTheme(saved);
    } else {
      setTheme("system");
      applyTheme("system");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const currentSaved = localStorage.getItem("bsai_theme") as ThemeMode | null;
      if (!currentSaved || currentSaved === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (mode === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isSystemDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const handleSelectTheme = (mode: ThemeMode) => {
    setTheme(mode);
    localStorage.setItem("bsai_theme", mode);
    applyTheme(mode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch theme"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-11 h-11 rounded-xl flex items-center justify-center bg-surface-raised hover:bg-surface-hover border border-border text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px] min-w-[44px]"
      >
        {/* Sun Icon */}
        <svg
          className={`w-5 h-5 transition-transform ${
            mounted && theme === "light" ? "block text-amber-500" : "hidden"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`w-5 h-5 transition-transform ${
            mounted && theme === "dark" ? "block text-indigo-400" : "hidden"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>

        {/* System Monitor Icon */}
        <svg
          className={`w-5 h-5 transition-transform ${
            !mounted || theme === "system" ? "block text-text-muted" : "hidden"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Theme options"
          className="absolute right-0 mt-2 w-36 bg-surface border border-border rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            role="option"
            aria-selected={theme === "light"}
            onClick={() => handleSelectTheme("light")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[44px] ${
              theme === "light"
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                : "text-foreground hover:bg-surface-raised"
            }`}
          >
            <svg
              className="w-4 h-4 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <span>Light</span>
          </button>

          <button
            role="option"
            aria-selected={theme === "dark"}
            onClick={() => handleSelectTheme("dark")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[44px] ${
              theme === "dark"
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                : "text-foreground hover:bg-surface-raised"
            }`}
          >
            <svg
              className="w-4 h-4 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <span>Dark</span>
          </button>

          <button
            role="option"
            aria-selected={theme === "system"}
            onClick={() => handleSelectTheme("system")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[44px] ${
              theme === "system"
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                : "text-foreground hover:bg-surface-raised"
            }`}
          >
            <svg
              className="w-4 h-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}
