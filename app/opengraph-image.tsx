import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "BlindSpot AI - Think beyond what you can see";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#090A0F",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow ambient circle */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.05) 70%, transparent 100%)",
          }}
        />

        {/* Brand Chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 20px",
            borderRadius: 30,
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            color: "#A5B4FC",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 30,
            textTransform: "uppercase",
          }}
        >
          Reflective Decision Partner • BlindSpot AI
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: -2,
            lineHeight: 1.1,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          BLINDSPOT AI
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: "#EC4899",
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          &quot;Think beyond what you can see.&quot;
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: "#94A3B8",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          An AI thinking companion that challenges your reasoning without making the decision for you.
        </div>

        {/* Hard rule footer badge */}
        <div
          style={{
            marginTop: 40,
            padding: "10px 24px",
            borderRadius: 16,
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#6EE7B7",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          ✓ Zero Recommendation Guarantee • Neutral Observation Engine
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
