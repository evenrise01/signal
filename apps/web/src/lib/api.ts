import type { AnalysisResult, AnalyzeTextInput, AnalyzeScreenshotInput } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiClient {
  static async analyzeText(input: AnalyzeTextInput): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_URL}/analyze/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Analysis failed");
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  static async analyzeScreenshot(input: AnalyzeScreenshotInput): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_URL}/analyze/screenshot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Analysis failed");
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
}

