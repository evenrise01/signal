export interface PatternSignal {
  type: string;
  strength: number;
  trend: "increasing" | "stable" | "decreasing";
  description: string;
}

export interface RiskFlag {
  type: string;
  level: "red" | "yellow" | "green";
  probability: number;
  description: string;
}

export interface Strategy {
  name: string;
  optimization_goal: string;
  risks: string[];
  sample_reply?: string;
}

export interface AnalysisResult {
  intent_score: number;
  confidence: number;
  emotional_tones: string[];
  subtext_summary: {
    explicit: string;
    implied: string;
    avoided: string;
  };
  patterns: PatternSignal[];
  risk_flags: RiskFlag[];
  strategies: Strategy[];
}

export interface AnalyzeTextInput {
  text: string;
  context?: string;
}

export interface AnalyzeScreenshotInput {
  image: string; // Base64
  context?: string;
}

