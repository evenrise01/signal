import type { AnalysisResult } from "../schemas/analysis";

const ABSOLUTE_TERMS = [
  "definitely",
  "absolutely",
  "always",
  "never",
  "must",
  "obviously",
  "undeniably",
];

const PRESCRIPTIVE_PHRASES = [
  "you should",
  "you need to",
  "do this",
  "tell them",
  "ask him",
  "ask her",
  "break up",
  "leave him",
  "leave her",
];

function sanitizeString(text: string): string {
  let sanitized = text;

  // 1. Remove absolutes (naive replacement, but enforced)
  // detailed regex replacement would be better, but this is a start
  ABSOLUTE_TERMS.forEach((term) => {
    const regex = new RegExp(`\\b${term}\\b`, "gi");
    sanitized = sanitized.replace(regex, "likely");
  });

  // 2. Strip prescriptive phrases
  PRESCRIPTIVE_PHRASES.forEach((phrase) => {
     const regex = new RegExp(`\\b${phrase}\\b`, "gi");
     sanitized = sanitized.replace(regex, "[consider]");
  });

  return sanitized;
}

export function enforceSafety(result: AnalysisResult): AnalysisResult {
  // Deep clone to avoid mutation side effects if any
  const safeResult = JSON.parse(JSON.stringify(result)) as AnalysisResult;

  // 1. Sanitize text fields
  safeResult.subtext_summary.explicit = sanitizeString(safeResult.subtext_summary.explicit);
  safeResult.subtext_summary.implied = sanitizeString(safeResult.subtext_summary.implied);
  safeResult.subtext_summary.avoided = sanitizeString(safeResult.subtext_summary.avoided);

  // 2. Clamp probabilities (redundant if schema validated, but good for safety)
  safeResult.intent_score = Math.min(100, Math.max(0, safeResult.intent_score));
  safeResult.confidence = Math.min(100, Math.max(0, safeResult.confidence));

  // 3. Review strategies
  safeResult.strategies = safeResult.strategies.map(s => ({
      ...s,
      name: sanitizeString(s.name),
      optimization_goal: sanitizeString(s.optimization_goal),
      risks: s.risks.map(r => sanitizeString(r))
  }));

  // 4. Review patterns and risks
  safeResult.patterns = safeResult.patterns.map(p => ({
      ...p,
      description: sanitizeString(p.description)
  }));

  safeResult.risk_flags = safeResult.risk_flags.map(r => ({
      ...r,
      description: sanitizeString(r.description)
  }));

  return safeResult;
}
