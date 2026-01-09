import { z } from "zod";

export const AnalyzeTextSchema = z.object({
  text: z.string().min(1, "Text is required").max(5000, "Text is too long"),
  context: z.string().optional(),
});

export const RiskLevelSchema = z.enum(["red", "yellow", "green"]);
export const TrendSchema = z.enum(["increasing", "stable", "decreasing"]);

export const PatternSignalSchema = z.object({
  type: z.string(),
  strength: z.number().min(0).max(100),
  trend: TrendSchema,
  description: z.string(),
});

export const RiskFlagSchema = z.object({
  type: z.string(),
  level: RiskLevelSchema,
  probability: z.number().min(0).max(100),
  description: z.string(),
});

export const StrategySchema = z.object({
  name: z.string(),
  optimization_goal: z.string(),
  risks: z.array(z.string()),
  sample_reply: z.string().optional(), // Only generated if selected, but schema supports it
});

export const AnalysisResultSchema = z.object({
  intent_score: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  emotional_tones: z.array(z.string()),
  subtext_summary: z.object({
    explicit: z.string(),
    implied: z.string(),
    avoided: z.string(),
  }),
  patterns: z.array(PatternSignalSchema),
  risk_flags: z.array(RiskFlagSchema),
  strategies: z.array(StrategySchema),
});

export type AnalyzeTextInput = z.infer<typeof AnalyzeTextSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
