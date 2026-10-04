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
      root.style.setProperty("--bg-base", "248 249 250");
      root.style.setProperty("--surface-base", "255 255 255");
      root.style.setProperty("--surface-raised-base", "241 245 249");
      root.style.setProperty("--surface-hover-base", "226 232 240");
      root.style.setProperty("--border-base", "226 232 240");
      root.style.setProperty("--text-primary", "15 23 42");
      root.style.setProperty("--text-muted", "100 116 139");
      root.style.backgroundColor = "#F8F9FA";
      root.style.color = "#0F172A";

      if (body) {
        body.classList.remove("dark");
        body.classList.add("light");
        body.setAttribute("data-theme", "light");
        body.style.backgroundColor = "#F8F9FA";
        body.style.color = "#0F172A";
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
        initialIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    } catch {
      initialIsDark = true;
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

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextIsDark = !isDark;
    setIsDark(nextIsDark);

    try {
      localStorage.setItem("bsai_theme", nextIsDark ? "dark" : "light");
    } catch (err) {
      console.warn("Unable to save theme", err);
    }

    applyTheme(nextIsDark);
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
            ? "Switch to Light mode"
            : "Switch to Dark mode"
          : "Toggle theme"
      }
      className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-surface-raised hover:bg-surface-hover border border-border hover:border-indigo-500/40 text-foreground transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer min-h-[44px] min-w-[44px] shadow-sm group active:scale-95"
    >
      {/* Sun Icon (shown when dark to indicate clicking will turn it light) */}
      <svg
        className={`w-5 h-5 transition-all duration-300 transform ${
          !mounted || isDark
            ? "text-amber-400 group-hover:rotate-45 group-hover:scale-110 opacity-100"
            : "hidden opacity-0"
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

      {/* Moon Icon (shown when light to indicate clicking will turn it dark) */}
      <svg
        className={`w-5 h-5 transition-all duration-300 transform ${
          mounted && !isDark
            ? "text-indigo-600 group-hover:-rotate-12 group-hover:scale-110 opacity-100"
            : "hidden opacity-0"
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
    </button>
  );
}
