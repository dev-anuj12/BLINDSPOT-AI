"use client";

import Link from "next/link";
import { Shield, Eye, FileText, Lock, Sparkles, Mail } from "lucide-react";

export function Footer() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@blindspot-ai.com";

  const openCookieSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-cookie-settings"));
  };

  return (
    <footer className="w-full bg-surface border-t border-border mt-auto text-gray-400">
      {/* Required hard-rule disclaimer banner */}
      <div className="bg-indigo-950/40 border-b border-indigo-900/40 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center text-xs text-indigo-300 font-medium">
          <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>
            <strong>BlindSpot AI</strong> helps you examine your thinking. It does not give advice or make decisions for you.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xs">
                BS
              </div>
              <span className="font-bold text-white text-base font-display">BlindSpot AI</span>
            </div>
            <p className="text-sm text-gray-300 font-medium">
              &quot;Think beyond what you can see.&quot;
            </p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
              Powered by the internal <em>Blind Spot Mirror</em> engine. Built to illuminate assumptions, highlight unvoiced conflicts, and foster deeper self-reflection.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Overview & Example
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-white transition-colors">
                  Analyze Decision
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{contactEmail}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Legal & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={openCookieSettings}
                  className="hover:text-white transition-colors text-left"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 BlindSpot AI. All rights reserved. Server-side AI processing only.</p>
          <p className="flex items-center gap-2">
            <span>Non-Advisory Architecture</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Structured JSON Mirror</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
