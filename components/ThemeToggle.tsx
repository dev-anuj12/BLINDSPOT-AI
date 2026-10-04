"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const applyTheme = (dark: boolean) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const body = document.body;

    if (dark) {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
      root.style.setProperty("--bg-base", "9 10 15");
      root.style.setProperty("--surface-base", "18 20 31");
      root.style.setProperty("--surface-raised-base", "26 29 45");
      root.style.setProperty("--surface-hover-base", "34 39 61");
      root.style.setProperty("--border-base", "42 48 71");
      root.style.setProperty("--text-primary", "248 250 252");
      root.style.setProperty("--text-muted", "148 163 184");
      root.style.backgroundColor = "#090A0F";
      root.style.color = "#F8FAFC";

      if (body) {
        body.classList.add("dark");
        body.classList.remove("light");
        body.setAttribute("data-theme", "dark");
        body.style.backgroundColor = "#090A0F";
        body.style.color = "#F8FAFC";
      }
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
      root.style.setProperty("--bg-base", "255 255 255");
      root.style.setProperty("--surface-base", "248 250 252");
      root.style.setProperty("--surface-raised-base", "241 245 249");
      root.style.setProperty("--surface-hover-base", "226 232 240");
      root.style.setProperty("--border-base", "226 232 240");
      root.style.setProperty("--text-primary", "15 23 42");
      root.style.setProperty("--text-muted", "100 116 139");
      root.style.backgroundColor = "#FFFFFF";
      root.style.color = "#0F172A";

      if (body) {
        body.classList.remove("dark");
        body.classList.add("light");
        body.setAttribute("data-theme", "light");
        body.style.backgroundColor = "#FFFFFF";
        body.style.color = "#0F172A";
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    let initialIsDark = false;
    try {
      const saved = localStorage.getItem("bsai_theme");
      if (saved === "dark") {
        initialIsDark = true;
      } else if (saved === "light") {
        initialIsDark = false;
      } else {
        initialIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    } catch {
      initialIsDark = false;
    }

    setIsDark(initialIsDark);
    applyTheme(initialIsDark);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      try {
        const saved = localStorage.getItem("bsai_theme");
        if (!saved || saved === "system") {
          setIsDark(e.matches);
          applyTheme(e.matches);
        }
      } catch {}
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const setThemeMode = (dark: boolean) => {
    setIsDark(dark);
    try {
      localStorage.setItem("bsai_theme", dark ? "dark" : "light");
    } catch (err) {
      console.warn("Unable to save theme", err);
    }
    applyTheme(dark);
  };

  return (
    <div
      role="group"
      aria-label="Theme selector"
      className="flex items-center p-1 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-inner"
    >
      {/* Sun / Light button */}
      <button
        type="button"
        onClick={() => setThemeMode(false)}
        aria-label="Light mode"
        aria-pressed={mounted && !isDark}
        title="Light mode"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
          mounted && !isDark
            ? "bg-white text-amber-500 shadow-sm border border-slate-200/80 font-bold scale-105"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
      >
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
      </button>

      {/* Moon / Dark button */}
      <button
        type="button"
        onClick={() => setThemeMode(true)}
        aria-label="Dark mode"
        aria-pressed={mounted && isDark}
        title="Dark mode"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
          mounted && isDark
            ? "bg-slate-900 text-indigo-400 shadow-sm border border-slate-700 font-bold scale-105"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
      >
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
      </button>
    </div>
  );
}
