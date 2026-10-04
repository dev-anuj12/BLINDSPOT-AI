import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Eye, HelpCircle, Layers, Compass, CheckCircle2, ChevronRight, Target, Sparkle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-pink-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Focus Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 mb-8 shadow-sm">
          <Sparkle className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          <span>OBJECTIVE COGNITIVE REFLECTION ENGINE</span>
        </div>

        {/* Hero Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display max-w-4xl mx-auto leading-[1.1]">
          BLINDSPOT{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            AI
          </span>
        </h1>

        <p className="mt-4 text-xl sm:text-2xl font-semibold text-gray-200 font-display">
          &quot;Think beyond what you can see.&quot;
        </p>

        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed font-light">
          BlindSpot AI is a reflective thinking tool that helps people examine their reasoning about a decision, without making the decision for them.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/analyze"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white shadow-xl shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>STRESS TEST MY THINKING</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/analyze?demo=true"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm sm:text-base bg-surface-raised/80 hover:bg-surface-hover text-gray-200 border border-border hover:border-gray-500 transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>SEE AN EXAMPLE</span>
          </Link>
        </div>

        {/* Hard Rule Pledge Indicator */}
        <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/80 border border-border text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Zero Recommendation Guarantee:</strong> The AI will never tell you what to do.
          </span>
        </div>

        {/* SVG Visual: Blind Spot Radar & Node Constellation */}
        <div className="mt-16 relative max-w-xl mx-auto flex items-center justify-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-indigo-500/20 bg-surface/40 backdrop-blur-md p-6 flex items-center justify-center shadow-2xl">
            {/* Concentric orbital rings */}
            <div className="absolute inset-4 rounded-full border border-dashed border-indigo-500/30 animate-spin-slow" />
            <div className="absolute inset-12 rounded-full border border-purple-500/30" />
            <div className="absolute inset-20 rounded-full border border-pink-500/20" />

            {/* Radar sweep beam */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="w-1/2 h-1/2 origin-bottom-right bg-gradient-to-tr from-transparent via-indigo-500/15 to-pink-500/30 animate-radar-sweep" />
            </div>

            {/* Core icon */}
            <div className="relative z-10 w-20 h-20 rounded-3xl bg-surface-raised border border-indigo-500/50 shadow-xl flex items-center justify-center">
              <Eye className="w-10 h-10 text-indigo-400" />
            </div>

            {/* Floating Nodes representing Visible vs Blind spot elements */}
            <div className="absolute top-6 left-12 px-2.5 py-1 rounded-lg bg-surface-raised/90 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 shadow-lg animate-float">
              ✓ Visible Factors
            </div>
            <div
              className="absolute bottom-8 right-8 px-2.5 py-1 rounded-lg bg-surface-raised/90 border border-pink-500/40 text-[10px] font-mono text-pink-300 shadow-lg animate-float"
              style={{ animationDelay: "2s" }}
            >
              ⚠ Blind Spot Zone
            </div>
            <div
              className="absolute top-12 right-6 px-2.5 py-1 rounded-lg bg-surface-raised/90 border border-purple-500/40 text-[10px] font-mono text-purple-300 shadow-lg animate-float"
              style={{ animationDelay: "4s" }}
            >
              ? Unexamined Assumption
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Strip: Describe -> See blind spots -> Reflect */}
      <section className="py-16 bg-surface/50 border-y border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 mb-2">
              HOW THE MIRROR WORKS
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Three steps to clarify your own thinking
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-indigo-500/40 transition-all duration-300 relative group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold text-lg group-hover:scale-105 transition-transform">
                01
              </div>
              <h4 className="text-lg font-bold text-white font-display">Describe Your Reasoning</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Enter what you are deciding, the options on the table, why you are leaning in a certain direction, and what is at stake.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-purple-500/40 transition-all duration-300 relative group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-lg group-hover:scale-105 transition-transform">
                02
              </div>
              <h4 className="text-lg font-bold text-white font-display">See Your Blind Spots</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                The AI engine separates stated evidence from inferred leaps, maps unvoiced tensions, and pinpoints unexamined assumptions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-pink-500/40 transition-all duration-300 relative group">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-mono font-bold text-lg group-hover:scale-105 transition-transform">
                03
              </div>
              <h4 className="text-lg font-bold text-white font-display">Reflect & Evolve</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Answer high-leverage questions or switch perspectives (5 years ahead, critic, affected stakeholders) to generate an updated mirror.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Contrast Matrix */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-surface-raised/80 backdrop-blur-xl border border-border rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400">
              CORE PRINCIPLE
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Why We Never Tell You What To Do
            </h3>
            <p className="text-sm text-gray-300">
              When an AI makes a recommendation, it relieves you of critical thinking. BlindSpot AI does the opposite: it gives you back full clarity over your own mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
              <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wider">
                ❌ What Chatbots & Advisors Do
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Say &quot;You should accept option A because...&quot;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Rank choices and impose arbitrary scores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Give generic advice disguised as wisdom</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
              <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                ✓ What BlindSpot AI Does
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Highlights what you might be taking for granted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Asks 3-5 open-ended, non-leading questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Shows how reversible or irreversible the door is</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Repeat Primary CTA at the Bottom */}
      <section className="py-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h3 className="text-2xl sm:text-4xl font-bold text-white font-display">
          Ready to discover your blind spots?
        </h3>
        <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
          No signups, no data storage, and zero advice. Just structured reflection in under 60 seconds.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/analyze"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white shadow-xl shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>STRESS TEST MY THINKING</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
