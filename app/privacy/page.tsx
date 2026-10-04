import Link from "next/link";
import { Shield, Lock, EyeOff, Server, Mail, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how BlindSpot AI handles your decision data and protects your privacy.",
};

export default function PrivacyPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@blindspot-ai.com";
  const lastUpdated = "October 2026";

  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-border/80 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
          <Shield className="w-3.5 h-3.5" />
          <span>PRIVACY & DATA HANDLING</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-raised border border-border space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>No Accounts Required</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            You don&apos;t need to sign up or provide an email to use the mirror.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-raised border border-border space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <EyeOff className="w-4 h-4" />
            <span>Zero Server Storage</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            We do not store your decision text or reflections in any persistent database.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-raised border border-border space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Ephemeral AI Processing</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Text is sent securely over HTTPS to Google Gemini for real-time analysis only.
          </p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            1. How Your Decision Data is Processed
          </h2>
          <p>
            When you submit a decision for reflection, the text you enter is transmitted over encrypted TLS/HTTPS directly to Google&apos;s Gemini API to produce structured reflection cards.
          </p>
          <p>
            BlindSpot AI operates entirely statelessly: we do not maintain a user database, user profiles, or stored history of your submissions. Your decision input is temporarily saved in your own browser&apos;s <code className="text-indigo-300 bg-surface px-1.5 py-0.5 rounded">sessionStorage</code> so you can navigate between pages, and it clears automatically when you close your browser tab.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            2. Sensitive Information Notice
          </h2>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed">
            <strong>Important Recommendation:</strong> Please do NOT input highly sensitive personal data, such as government identification numbers, passwords, bank account numbers, or protected health records (PHI). Frame decisions in generalized or anonymized terms.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            3. Analytics and Cookies
          </h2>
          <p>
            We use privacy-friendly Google Analytics (GA4) exclusively to monitor high-level aggregate usage (such as total reflections initiated and feature engagement).
          </p>
          <p>
            <strong>Strict Privacy Boundary:</strong> Analytics scripts are completely blocked until you explicitly click &quot;Accept Analytics&quot; on our cookie consent banner. Furthermore, we never send your input text, question answers, or decision content to analytics tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            4. Third-Party Services
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Google Gemini API:</strong> Processes your reflection prompt in accordance with Google Cloud&apos;s enterprise data governance policies.</li>
            <li><strong>Vercel:</strong> Hosts the serverless Next.js edge application.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            5. Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy or wish to get in touch with our team, contact us at:{" "}
            <a href={`mailto:${contactEmail}`} className="text-indigo-400 hover:underline">
              {contactEmail}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
