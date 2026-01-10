import { AIService } from "../services/ai";
import { 
    AnalysisResultSchema, 
    type AnalysisResult, 
    type PatternSignalSchema, 
    type StrategySchema,
    AnalyzeTextSchema,
    RiskFlagSchema
} from "../schemas/analysis";
import { z } from "zod";
import { enforceSafety } from "../guards/safety";

// Combined Schema for Core Analysis (Signal + Emotion + Risks)
const CoreAnalysisSchema = z.object({
    subtext_summary: z.object({
        explicit: z.string(),
        implied: z.string(),
        avoided: z.string()
    }),
    intent_score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    emotional_tones: z.array(z.string()),
    risk_flags: z.array(z.object({
        type: z.string(),
        level: z.enum(["red", "yellow", "green"]),
        probability: z.number().min(0).max(100),
        description: z.string()
    }))
});

const StrategiesSchema = z.object({
    strategies: z.array(z.object({
        name: z.string(),
        optimization_goal: z.string(),
        risks: z.array(z.string()),
        sample_reply: z.string().optional()
    }))
});

export class TextAnalysisPipeline {
    static async run(text: string, context?: string): Promise<AnalysisResult> {
        
        // Step 1: Core Analysis (Combined Signal, Emotion, Risks)
        // Optimization: Merged 3 calls into 1 to reduce latency and quota usage (Gemini 429 errors).
        const coreAnalysis = await AIService.generateStructured(
            `You are an expert communication analyst. Perfrom a comprehensive analysis:
            1. Extract explicit, implied, and avoided meanings.
            2. Analyze emotional tone and intent score (0-100).
            3. Identify risk flags with probabilities.`,
            `Input: "${text}". Context: ${context || "None"}.`,
            CoreAnalysisSchema,
            "core_analysis"
        );

        // Step 2: Strategies (Requires the analysis context)
        const strategies = await AIService.generateStructured(
            "Generate 3 distinct response strategies based on the analysis. DO NOT tell the user what to do, offer options.",
            `Input: "${text}". \nAnalysis Summary: ${JSON.stringify(coreAnalysis)}.`,
            StrategiesSchema,
            "strategy_synthesis"
        );

        // Assemble Result
        const rawResult: AnalysisResult = {
            intent_score: coreAnalysis.intent_score,
            confidence: coreAnalysis.confidence,
            emotional_tones: coreAnalysis.emotional_tones,
            subtext_summary: coreAnalysis.subtext_summary,
            patterns: [], // Mocked
            risk_flags: coreAnalysis.risk_flags,
            strategies: strategies.strategies
        };

        // Safety Guardrail
        return enforceSafety(rawResult);
    }
}
