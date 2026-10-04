import Link from "next/link";
import { FileText, AlertTriangle, ShieldCheck, Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service and non-advisory disclaimer for BlindSpot AI.",
};

export default function TermsPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-border/80 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
          <FileText className="w-3.5 h-3.5" />
          <span>LEGAL & USE TERMS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Critical Non-Advisory Notice Banner */}
      <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2 text-indigo-200">
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span>NON-ADVISORY NATURE OF BLINDSPOT AI</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-indigo-300">
          BlindSpot AI is an educational, reflective thinking aid. It is strictly programmed NEVER to provide professional, financial, medical, or legal advice, and NEVER to decide or recommend any choice for you.
        </p>
      </div>

      <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            1. Reflective and Educational Purposes Only
          </h2>
          <p>
            The findings, assumptions, tension maps, and questions surfaced by the Blind Spot Mirror engine are generated automatically by artificial intelligence for your independent contemplation.
          </p>
          <p>
            You acknowledge and agree that you remain solely and exclusively responsible for any real-world decisions, actions, or consequences arising from your use of this tool.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            2. No Professional Advice
          </h2>
          <p>
            BlindSpot AI does not provide financial advice, legal counsel, mental health counseling, medical diagnoses, or corporate governance directives. If you are facing critical decisions involving legal liability, medical emergencies, mental distress, or significant fiduciary obligations, you must consult qualified, licensed human professionals.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            3. AI Output Limitations
          </h2>
          <p>
            Artificial intelligence systems can occasionally produce interpretations that are incomplete, speculative, or inaccurate. BlindSpot AI makes no representations, warranties, or guarantees regarding the absolute completeness or factual precision of its reflective outputs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            4. Acceptable Use
          </h2>
          <p>
            You agree not to use BlindSpot AI to submit unlawful, abusive, harassing, or defamatory materials, nor attempt to bypass or tamper with our neutrality filters, API rate limits, or security mechanisms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            5. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, BlindSpot AI and its contributors disclaim all liability for any direct, indirect, incidental, consequential, or punitive damages resulting from the use or inability to use this service.
          </p>
        </section>
      </div>
    </div>
  );
}
