# Product Requirements Document (PRD)

## Product Name (Working)

**Signal** – Relationship Intelligence Agent

---

## 1. Objective

Build an MVP of a **Relationship Intelligence Agent** that helps users analyze romantic or relationship-related communication (texts, chats, screenshots) to:

* Understand intent, interest, and emotional signals
* Detect patterns over time
* Surface risks probabilistically (not definitively)
* Suggest response strategies (not prescriptions)

The MVP must be:

* Trustworthy
* Fast
* Privacy-first
* Clearly *not* therapy, counseling, or manipulation

---

## 2. Target User

* Age: 18–40
* Contexts:

  * Dating
  * Situationships
  * Early or mid relationships
  * Breakup / distancing phases
* Behaviors:

  * Overthinks text messages
  * Seeks reassurance or clarity
  * Comfortable paying for emotional decision support

---

## 3. Non-Goals (Hard Constraints)

The system MUST NOT:

* Provide therapy or mental health counseling
* Role-play as a partner/ex
* Encourage confrontation or escalation
* Make definitive claims (e.g., “they are cheating”)
* Diagnose psychological conditions

---

## 4. Core MVP Features

### 4.1 Text Analysis

**Input**:

* Pasted text (single message or short conversation)

**Output** (structured):

* Intent score (0–100, probabilistic)
* Emotional tone labels (e.g., warm, distant, playful, defensive)
* Subtext summary:

  * Explicit meaning
  * Implied meaning
  * What may be avoided
* Pattern signals (if history exists)
* Risk flags (red / yellow / green, probabilistic)
* Overall confidence score

---

### 4.2 Screenshot Analysis

**Input**:

* Uploaded screenshot (WhatsApp, iMessage, Instagram, etc.)

**System behavior**:

* Preprocess image
* Redact names / phone numbers if detectable
* Extract text via OCR
* Pass extracted text to same pipeline as text analysis

---

### 4.3 Response Strategy Generator

Instead of generating a single reply, the system must:

Provide **2–3 response strategies**, each containing:

* Strategy name (e.g., Reassuring, Neutral/Clarifying, Boundary-setting)
* What this strategy optimizes for (clarity, emotional safety, attraction)
* Risks of using this strategy

Only after a strategy is selected, generate a **sample reply**.

---

### 4.4 Reality Check Mode

One-tap analysis mode.

**Input**:

* Short text or question

**Output**:

* Probability user is overinterpreting
* Probability something is genuinely off
* One grounding sentence (neutral, calming tone)

This output should be concise and screenshot-friendly.

---

### 4.5 Guided Chat (Constrained)

Chat is allowed ONLY as:

* Clarifying Q&A
* Analytical follow-ups

Rules:

* AI may ask max **2 clarifying questions per session**
* Questions must be factual or binary (not emotional)
* User may ask analytical questions about results

No open-ended emotional conversations.

---

### 4.6 Relationship Timeline (Light Memory)

* Store last 30 days of analysis metadata only (no raw chat by default)
* Track:

  * Intent score changes
  * Pattern trends
  * Risk flag evolution

User must be able to delete all data instantly (panic delete).

---

## 5. User Flow (MVP)

### First-Time User

1. Anonymous landing
2. Select context (Dating / Relationship / Breakup)
3. Paste text or upload screenshot
4. Receive analysis immediately
5. Soft paywall after limited free usage

### Returning User

* Faster analysis
* Timeline-aware insights
* Pattern comparison (“Is this new?”)

---

## 6. Monetization

* Free tier: 2 analyses/week, no memory
* Pro subscription: Unlimited analyses, timeline, deeper insights
* One-off purchase: Deep analysis report

Payments handled via Stripe.

---

## 7. Trust, Safety & Guardrails (Critical)

All AI outputs must:

* Use probabilistic language
* Reference observable signals
* Avoid absolutes
* Avoid telling user what to do

A safety filter must run after every LLM output to enforce tone and constraints.

---

## 8. Technical Architecture

⚠️ **TECH STACK FREEZE (MVP)**

The following technology stack is **frozen for the MVP**. A coding AI agent MUST NOT substitute, add, or remove core technologies unless explicitly instructed in a future revision of this PRD.

Any deviation from this stack should be considered **out of scope** for MVP acceptance.

### 8.1 Frontend

* Next.js (App Router)
* Tailwind CSS
* React Server Components

---

### 8.2 Backend

**Runtime**: Bun
**Framework**: ElysiaJS

Backend responsibilities:

* API routing
* AI orchestration
* Safety enforcement
* Rate limiting
* Billing enforcement

---

### 8.3 AI Orchestration

Multi-step pipeline (must be explicit in code):

1. Signal extraction
2. Emotional classification
3. Pattern detection
4. Risk scoring
5. Response strategy synthesis

Each step:

* Typed input/output
* Confidence score
* JSON schema validation

Multi-model support:

* Primary: OpenAI GPT-4.x
* Secondary: Claude 3.5 Sonnet

---

### 8.4 OCR

* Primary: AWS Textract
* Fallback: Tesseract

---

### 8.5 Database

* PostgreSQL

Store:

* User (anonymous ID)
* Analysis metadata
* Pattern summaries

Do NOT store raw conversations unless explicitly enabled.

---

## 9. API Endpoints (Required)

* POST /analyze/text
* POST /analyze/screenshot
* POST /reply/strategies
* POST /reality-check
* POST /chat/start
* POST /chat/message
* GET /timeline
* DELETE /panic-delete

All endpoints must be:

* Rate limited
* Auth-aware (anonymous tokens)

---

## 10. Data Schemas (Simplified)

### AnalysisResult

* intent_score: number (0–100)
* emotional_tones: string[]
* subtext_summary: string
* patterns: PatternSignal[]
* risk_flags: RiskFlag[]
* confidence: number

### PatternSignal

* type: string
* strength: number
* trend: increasing | stable | decreasing

---

## 11. Performance Requirements

* Text analysis p95 < 2s
* Screenshot analysis p95 < 5s
* Cost per analysis target: <$0.03

---

## 12. MVP Success Metrics

* Time to first analysis (<2 min)
* Free → paid conversion
* Avg analyses per user per week
* 7-day retention
* User-reported clarity/reassurance feedback

---

## 13. Build Constraints for Coding AI Agent

* Follow this PRD strictly
* Do not add features outside MVP scope
* Enforce guardrails in code, not just prompts
* Optimize for clarity, not verbosity
* Default to privacy-first decisions

---

## 14. Definition of MVP Complete

The MVP is complete when:

* A user can paste text or upload a screenshot
* Receive structured, probabilistic insights
* Ask limited clarifying questions
* See trends over time
* Pay for extended usage
* Delete all data instantly

No additional features are required for MVP acceptance.
