import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequest, AnalyzeResponse } from "@/types/analysis";
import { validateDecisionInput } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { analyzeDecisionWithGemini } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    // 1. IP extraction & Rate limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0].trim() || realIp || "127.0.0.1";

    const { isLimited, remaining, resetTime } = checkRateLimit(ip);
    if (isLimited) {
      return NextResponse.json(
        {
          success: false,
          error: "You have reached the temporary reflection limit. Please wait a few minutes before submitting another analysis.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Remaining": remaining.toString(),
          },
        }
      );
    }

    // 2. Parse request payload
    let body: AnalyzeRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload format.",
        },
        { status: 400 }
      );
    }

    const { decisionInput, round = 1, previousAnalysis, reflectionAnswers, lens, recaptchaToken } = body;

    if (!decisionInput) {
      return NextResponse.json(
        {
          success: false,
          error: "Decision information is required.",
        },
        { status: 400 }
      );
    }

    // 3. Honeypot & Validation
    const validation = validateDecisionInput(decisionInput, true);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors.map((e) => e.message).join(" "),
        },
        { status: 400 }
      );
    }

    // 4. Optional reCAPTCHA v3 verification
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret && recaptchaToken) {
      try {
        const verifyRes = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`,
          { method: "POST" }
        );
        const verifyData = await verifyRes.json();
        if (!verifyData.success || (verifyData.score && verifyData.score < 0.4)) {
          return NextResponse.json(
            {
              success: false,
              error: "Automated activity check failed. Please try again.",
            },
            { status: 403 }
          );
        }
      } catch {
        // Soft fail if recaptcha verification times out to avoid blocking users
      }
    }

    // 5. Call Gemini AI with Neutrality Filter
    const { analysis, retriedForNeutrality } = await analyzeDecisionWithGemini({
      decisionInput,
      round,
      previousAnalysis,
      reflectionAnswers,
      lens,
    });

    return NextResponse.json(
      {
        success: true,
        data: analysis,
        retriedForNeutrality,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": remaining.toString(),
        },
      }
    );
  } catch (error: any) {
    const errorMsg = error?.message || "";

    if (errorMsg.includes("GEMINI_API_KEY is not configured")) {
      return NextResponse.json(
        {
          success: false,
          error: "The AI mirror is currently awaiting server configuration. Please check your GEMINI_API_KEY environment variable.",
        },
        { status: 503 }
      );
    }

    if (errorMsg.includes("busy") || errorMsg.includes("429") || errorMsg.includes("quota")) {
      return NextResponse.json(
        {
          success: false,
          error: "The reflection engine is experiencing high demand. Please try again in a moment.",
        },
        { status: 429 }
      );
    }

    // Clean, reassuring default error without leaking internal stacks
    return NextResponse.json(
      {
        success: false,
        error: "Something interrupted the reflection. Your decision is safe - let's try the analysis again.",
      },
      { status: 500 }
    );
  }
}
