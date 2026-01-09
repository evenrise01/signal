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

// Intermediate Schemas for pipeline steps
const ExtractionSchema = z.object({
    subtext_summary: z.object({
        explicit: z.string(),
        implied: z.string(),
        avoided: z.string()
    })
});

const EmotionSchema = z.object({
    intent_score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    emotional_tones: z.array(z.string())
});

const RisksSchema = z.object({
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
        
        // Step 1: Signal Extraction
        const signals = await AIService.generateStructured(
            "You are an expert communication analyst. Extract explicit meaning, implied meaning, and what is being avoided in the text.",
            `Input: "${text}". Context: ${context || "None"}.`,
            ExtractionSchema,
            "signal_extraction"
        );

        // Step 2: Emotion & Intent
        const emotion = await AIService.generateStructured(
            "Analyze the emotional tone and intent of the message. Intent score: 0 (disinterested) to 100 (highly interested).",
            `Input: "${text}". Signals: ${JSON.stringify(signals)}.`,
            EmotionSchema,
            "emotion_analysis"
        );

        // Step 3: Patterns (Mocked for MVP initially, or basic text analysis)
        // Ideally this checks DB, but for now we look for patterns within the text itself or mark as 'insufficient data'
        const patterns = []; // Empty for single-shot MVP without history

        // Step 4: Risk Scoring
        const risks = await AIService.generateStructured(
            "Identify risk flags (Red: dangerous/toxic, Yellow: caution, Green: healthy). Assign probabilities.",
            `Input: "${text}". Emotion: ${JSON.stringify(emotion)}.`,
            RisksSchema,
            "risk_scoring"
        );

        // Step 5: Strategies
        const strategies = await AIService.generateStructured(
            "Generate 3 distinct response strategies based on the analysis. DO NOT tell the user what to do, offer options.",
            `Input: "${text}". Risks: ${JSON.stringify(risks)}. Emotion: ${JSON.stringify(emotion)}.`,
            StrategiesSchema,
            "strategy_synthesis"
        );

        // Assemble Result
        const rawResult: AnalysisResult = {
            intent_score: emotion.intent_score,
            confidence: emotion.confidence,
            emotional_tones: emotion.emotional_tones,
            subtext_summary: signals.subtext_summary,
            patterns: [], // TODO: real patterns
            risk_flags: risks.risk_flags,
            strategies: strategies.strategies
        };

        // Safety Guardrail
        return enforceSafety(rawResult);
    }
}
