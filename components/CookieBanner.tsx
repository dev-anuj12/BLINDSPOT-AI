"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Cookie, X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem("blindspot_cookie_consent");
    if (!savedConsent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }

    const handleOpenSettings = () => setIsVisible(true);
    window.addEventListener("open-cookie-settings", handleOpenSettings);
    return () => window.removeEventListener("open-cookie-settings", handleOpenSettings);
  }, []);

  const handleConsent = (decision: "accepted" | "rejected") => {
    localStorage.setItem("blindspot_cookie_consent", decision);
    setIsVisible(false);

    if (decision === "accepted" && process.env.NEXT_PUBLIC_GA_ID) {
      const win = window as any;
      if (typeof win.gtag === "function") {
        win.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-surface/95 backdrop-blur-md border border-border/80 shadow-2xl rounded-2xl p-5 text-gray-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Cookie className="w-5 h-5 flex-shrink-0" />
            <h3 className="font-semibold text-white text-sm">Privacy & Analytics</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close cookie banner"
            className="text-gray-400 hover:text-white p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          We use minimal, privacy-friendly analytics to understand tool usage. We{" "}
          <strong className="text-indigo-300">never</strong> track or store your personal decision text. See our{" "}
          <Link href="/privacy" className="underline hover:text-white text-indigo-400">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleConsent("accepted")}
            className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
          >
            Accept Analytics
          </button>
          <button
            onClick={() => handleConsent("rejected")}
            className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl bg-surface-raised hover:bg-surface-hover text-gray-300 border border-border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
