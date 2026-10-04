"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DecisionForm } from "@/components/DecisionForm";
import { Compass } from "lucide-react";

function AnalyzeFormContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";

  return <DecisionForm autoLoadDemo={isDemo} />;
}

export default function AnalyzePage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12 text-indigo-400">
            <Compass className="w-8 h-8 animate-spin" />
          </div>
        }
      >
        <AnalyzeFormContent />
      </Suspense>
    </div>
  );
}
