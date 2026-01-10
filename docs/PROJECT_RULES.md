# PROJECT_RULES.md

## Purpose

This document is the **constitution** for the Signal MVP.

Any human or AI contributor (Cursor, AntiGravity, etc.) **must follow these rules strictly**. Violations mean the work is **out of scope** and should be rejected.

---

## 1. Product Philosophy (Non-Negotiable)

Signal is **not** therapy, counseling, manipulation, or relationship advice.

The system exists to:

* Analyze observable communication signals
* Provide probabilistic interpretations
* Help users think more clearly, not act impulsively

### Hard Rules

* ❌ Never give definitive claims ("they are cheating", "they lost interest")
* ❌ Never tell the user what to do
* ❌ Never role-play as a partner, ex, or third party
* ❌ Never escalate emotions or suggest confrontation
* ❌ Never diagnose mental or psychological conditions

All outputs must:

* Use probabilistic language
* Reference observable signals only
* Include uncertainty explicitly

---

## 2. MVP Scope Enforcement

If a feature is **not explicitly mentioned in the PRD**, it does **not exist**.

### Explicitly Out of Scope

* Mobile apps
* Real-time chat or streaming responses
* Relationship coaching or advice
* Social features
* Notifications
* ML model training
* Sentiment dashboards beyond defined timeline

Do not "helpfully" add features.

---

## 3. Tech Stack (Frozen)

⚠️ **DO NOT CHANGE OR SUBSTITUTE ANYTHING BELOW**

### Frontend

* Next.js (App Router only)
* React Server Components
* Tailwind CSS
* TypeScript (strict mode)

### Backend

* Runtime: **Bun**
* Framework: **ElysiaJS**
* TypeScript (strict)

### Database

* PostgreSQL

### AI Models

* Primary: Google Gemini 1.5
* Secondary (fallback): Claude 3.5 Sonnet

### OCR

* Primary: AWS Textract
* Fallback: Tesseract

If a library or tool is not listed above, **do not introduce it** without instruction.

---

## 4. Architecture Principles

### Separation of Concerns (Mandatory)

* Routes: request/response only
* Services: business logic
* Pipelines: AI orchestration
* Guards: safety & compliance

❌ No business logic inside route handlers.

### Folder Expectations (Backend)

```
src/
  routes/
  services/
  pipelines/
  guards/
  schemas/
  db/
  utils/
```

### Frontend Expectations

* Server Components by default
* Client Components only when required
* No direct AI calls from frontend

---

## 5. AI Pipeline Rules (Critical)

All AI analysis must follow an **explicit multi-step pipeline**:

1. Signal Extraction
2. Emotional Classification
3. Pattern Detection
4. Risk Scoring
5. Response Strategy Synthesis

### Pipeline Requirements

* Each step has:

  * Typed input/output
  * Confidence score
  * JSON schema validation
* Steps must be visible in code (no monolithic prompts)

❌ No single-prompt "magic" analysis.

---

## 6. Safety & Guardrails (Enforced in Code)

Every LLM output **must** pass through a safety layer that:

* Removes absolutes
* Rewrites prescriptive language
* Enforces neutral tone
* Ensures probabilistic phrasing

This is **not optional** and must not rely solely on prompt wording.

---

## 7. Language & Tone Rules

All user-facing text must be:

* Calm
* Neutral
* Grounded
* Non-judgmental

Avoid:

* Emotional amplification
* Validation of paranoia
* Moral judgments

Example:

* ✅ "This could indicate reduced engagement, though there are other explanations"
* ❌ "This is a red flag and you should be concerned"

---

## 8. Chat Constraints

Guided chat is **constrained by design**.

Rules:

* Max **2 clarifying questions per session**
* Questions must be factual or binary
* No open-ended emotional exploration

If the limit is reached, the system must stop asking questions.

---

## 9. Data & Privacy Rules

### Storage

* Do NOT store raw conversations by default
* Store only metadata required for timelines
* Max history: 30 days

### User Control

* Panic delete must:

  * Delete all user data
  * Be immediate
  * Be irreversible

Privacy-first decisions override convenience.

---

## 10. API Design Rules

All endpoints must:

* Be rate-limited
* Be auth-aware (anonymous tokens)
* Validate input with schemas
* Return structured JSON only

Required endpoints:

* POST /analyze/text
* POST /analyze/screenshot
* POST /reply/strategies
* POST /reality-check
* POST /chat/start
* POST /chat/message
* GET /timeline
* DELETE /panic-delete

---

## 11. Performance & Cost Discipline

Targets:

* Text analysis p95 < 2s
* Screenshot analysis p95 < 5s
* Cost per analysis < $0.03

Rules:

* Avoid unnecessary LLM calls
* Prefer shorter prompts with structured inputs
* Cache safely where possible (without storing raw text)

---

## 12. Coding Style Rules

* Prefer clarity over abstraction
* No premature optimization
* No complex patterns (DI containers, event buses, etc.)
* Small, readable functions

TypeScript:

* strict: true
* No `any`
* Explicit return types for public functions

---

## 13. Testing Philosophy

Test only what can:

* Lose user trust
* Lose money
* Corrupt data

Focus on:

* Auth & rate limits
* AI pipeline boundaries
* Safety filters
* Panic delete

---

## 14. Working With Coding Agents

Before writing code, the agent must:

1. Explain the approach
2. List files to be modified
3. State assumptions

If unsure about an API or behavior:

* **Stop and ask**
* Do not guess

---

## 15. Definition of "Done"

Work is complete only if:

* It strictly matches the PRD
* It respects all rules in this document
* It introduces no new features
* It preserves user trust and safety

If there is ambiguity, default to:

> Privacy > Safety > Clarity > Speed

---

**This file overrides convenience, creativity, and speed.**
