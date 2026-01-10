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
        const coreAnalysis = await AIService.generateStructured(
            `You are an expert communication analyst. Perform a comprehensive analysis and return a JSON object with this EXACT structure:

{
  "subtext_summary": {
    "explicit": "what is directly stated",
    "implied": "what is suggested or hinted at",
    "avoided": "what is being deliberately not mentioned"
  },
  "intent_score": <number 0-100>,
  "confidence": <number 0-100>,
  "emotional_tones": ["tone1", "tone2", ...],
  "risk_flags": [
    {
      "type": "flag name",
      "level": "red" | "yellow" | "green",
      "probability": <number 0-100>,
      "description": "explanation"
    }
  ]
}

DO NOT wrap the response in any outer object. Return the JSON directly with these exact field names.`,
            `Analyze this message:
Input: "${text}"
Context: ${context || "None"}

Provide:
1. Subtext summary (explicit, implied, avoided meanings)
2. Intent score (0-100, how clear is the sender's intent)
3. Confidence level (0-100, how confident you are in this analysis)
4. Emotional tones (list of detected emotions)
5. Risk flags (potential relationship/communication risks)`,
            CoreAnalysisSchema,
            "CoreAnalysis"
        );

        // Step 2: Strategies (Requires the analysis context)
        const strategies = await AIService.generateStructured(
            `You are a communication strategy advisor. Generate response strategies based on the analysis provided.

Return a JSON object with this EXACT structure:

{
  "strategies": [
    {
      "name": "strategy name",
      "optimization_goal": "what this strategy optimizes for",
      "risks": ["risk1", "risk2"],
      "sample_reply": "optional sample text"
    }
  ]
}

DO NOT wrap in any outer object. Return exactly 3 distinct strategies. DO NOT tell the user what to do - offer options they can choose from.`,
            `Based on this analysis, generate 3 response strategies:

Original Input: "${text}"
Analysis Summary: ${JSON.stringify(coreAnalysis)}

Each strategy should:
- Have a clear name
- State what it optimizes for (e.g., "maintaining connection", "seeking clarity", "protecting emotional wellbeing")
- List potential risks of this approach
- Optionally include a sample reply`,
            StrategiesSchema,
            "StrategyList"
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