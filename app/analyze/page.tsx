"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DecisionForm } from "@/components/DecisionForm";

function AnalyzeFormInner() {
  const searchParams = useSearchParams();
  const isDemo = searchParams ? searchParams.get("demo") === "true" : false;
  return <DecisionForm autoLoadDemo={isDemo} />;
}

export default function AnalyzePage() {
  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Suspense fallback={<DecisionForm autoLoadDemo={false} />}>
        <AnalyzeFormInner />
      </Suspense>
    </div>
  );
}
