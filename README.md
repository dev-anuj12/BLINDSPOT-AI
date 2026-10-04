# BlindSpot AI 🔍
> *"Think beyond what you can see."*

**BlindSpot AI is a reflective thinking tool that helps people examine their reasoning about a decision, without making the decision for you.**

It illuminates unexamined assumptions, highlights overlooked factors, maps competing tensions, and asks high-leverage questions.

---

## 🚫 The Hard Rule: Zero-Advice Guarantee
When conventional AI tools or chat assistants are presented with a decision, they often jump straight into making recommendations, scoring options, or declaring what you *should* do. This takes away the user's agency and shortcuts critical thinking.

**BlindSpot AI operates under a strict hard rule:**
> **The AI must NEVER recommend, rank, choose, or suggest which option is better.**
> **Success = the user finishes with more questions, heightened awareness, and deeper context — NOT an AI-made decision.**

---

## 💡 The Problem & Solution
* **The Problem:** When people make hard decisions under stress or deadlines, cognitive narrowing occurs. We focus heavily on immediate visible factors (e.g. stipend, location) while taking critical assumptions for granted (e.g. time balance, burnout risk, reversibility).
* **The Solution:** BlindSpot AI's internal reasoning engine — **Blind Spot Mirror** — acts as an objective, neutral mirror. It observes your reasoning, separates stated facts from inferred leaps, maps unvoiced tensions, and prompts deeper self-reflection.

---

## 🔄 How It Works
```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 1. Describe     │  ──▶  │ 2. Mirror       │  ──▶  │ 3. Reflect &    │
│    Decision     │       │    Analysis     │       │    Re-analyze   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                         │                         │
         ▼                         ▼                         ▼
• Decision & Options      • Attention Weighing      • 3-5 Probing Questions
• Current Reasoning       • Hidden Assumptions      • Multi-Round Evolving Mirror
• Stakes & Timeline       • Overlooked Factors      • 3 Perspective Lenses:
• Affected Parties        • Identified Tensions       - 5 Years From Now
                          • Reversibility (Door)      - Thoughtful Critic
                          • Bias Pattern Flags        - Affected Stakeholders
```

---

## 🧠 AI Architecture
1. **Server-Side Structured JSON:**
   Powered by the official Google Gen AI SDK (`@google/genai` / `@google/generative-ai`) communicating securely with Gemini Flash (`gemini-flash-latest`). Enforces a strict response schema to guarantee typed JSON without unstructured chatbot chatter.
2. **Deep Neutrality Filter:**
   Every response passes through an algorithmic neutrality scanner (`lib/neutralityFilter.ts`) that recursively searches for advisory keywords, directives, or subtle favoritism.
3. **Single-Retry & Fail-Safe Fallback:**
   If advisory language is detected, the engine executes one corrective retry prompt instructing the model to remove all advice. If advice persists, it discards the output and provides a safe, question-centric fallback so **no recommendation ever reaches the user interface**.
4. **Stateless & Ephemeral:**
   No user data is stored in any backend database. Decision context is temporarily held in browser `sessionStorage` and cleared upon closing the tab.

---

## ✨ Features
* **Structured Dashboard:** No chat bubbles or confusing feeds. Clean, scannable cards for Attention Weighing, Hidden Assumptions, Overlooked Blind Spots, Conflicts & Trade-offs, and Reversibility.
* **Interactive Questions:** 3 to 5 open-ended questions targeting specific assumptions and tensions with in-place scratchpads.
* **Multi-Round Reflection Mode:** Guided step-by-step reflection that sends your answers back to synthesize an updated mirror with a **"What Changed in Your Thinking?"** evolution summary.
* **3 Perspective Lenses:**
  * 🔮 **5 Years From Now:** Long-term hindsight and compounding consequences.
  * 🥊 **Someone Who Disagrees:** Counter-arguments from an intelligent, well-intentioned critic.
  * 👥 **Someone Affected:** Ripple effects on stakeholders and loved ones.
* **Sample Scenario:** Single-click example loading a realistic 6-month internship decision scenario.
* **Honeypot & Rate Limiting:** In-memory sliding-window IP rate limiting (15 requests / 10 min) and hidden honeypot spam protection.
* **Accessible & Privacy-First:** WCAG AA contrast, keyboard navigation, dark glassmorphic design, and zero analytics tracking prior to explicit cookie consent.
* **Export & Print Ready:** Instant markdown copy and dedicated print-optimized stylesheets.

---

## 🛠️ Tech Stack
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Route Handlers, Edge Images)
* **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons
* **AI Engine:** Google Gemini (`gemini-flash-latest`) via Google Gen AI SDK
* **Testing:** [Vitest](https://vitest.dev/) (Unit tests for Neutrality Filter, Schema Normalization, and Validation)
* **Deployment:** [Vercel](https://vercel.com/)

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory (never commit this file):

| Variable Name | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | **Yes** | — | Google Gemini API Key (server-side only) |
| `GEMINI_MODEL` | No | `gemini-flash-latest` | Gemini model name |
| `NEXT_PUBLIC_SITE_URL` | No | `https://blindspot-ai.vercel.app` | Base URL for OpenGraph and Sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | `support@blindspot-ai.com` | Contact email displayed on Privacy page |
| `NEXT_PUBLIC_GA_ID` | No | — | Optional Google Analytics 4 Measurement ID |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | No | — | Optional reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | No | — | Optional reCAPTCHA v3 secret key |
| `NEXT_PUBLIC_SENTRY_DSN` | No | — | Optional Sentry DSN for error telemetry |

---

## 🚀 Local Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/blindspot-ai.git
cd blindspot-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Add your GEMINI_API_KEY into .env.local

# 4. Run automated tests
npm run test

# 5. Verify links and secrets
npm run check-links
node scripts/check-secrets.mjs

# 6. Start development server
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 🧪 Testing

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch
```

Test coverage includes:
* **Neutrality Filter:** Validates detection of direct advice, modal directives ("you should take", "I recommend"), and confirms that reflective queries ("you should ask yourself") are permitted.
* **Validation & Honeypot:** Tests required fields, 3,000 character boundaries, and bot trap triggers.
* **Gemini JSON Schema:** Tests parsing, markdown fence cleaning, and schema normalization.

---

## 🌐 Deploying to Vercel

1. **Push your code to a public GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "feat: BlindSpot AI standalone release"
   git branch -M main
   git remote add origin https://github.com/your-username/blindspot-ai.git
   git push -u origin main
   ```
2. **Import into Vercel:**
   * Go to [vercel.com/new](https://vercel.com/new) and select your GitHub repository.
3. **Set Environment Variables in Vercel:**
   * Under **Environment Variables**, add:
     * `GEMINI_API_KEY` = *your Google Gemini API key*
     * `GEMINI_MODEL` = `gemini-flash-latest`
     * `NEXT_PUBLIC_SITE_URL` = *your Vercel production URL*
4. **Click Deploy:**
   * Vercel will automatically run `npm run build` and deploy your app.
