import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const apiKey = process.env.OPENAI_API_KEY;

// Check for API key (but don't crash if missing, just log warning - or fail gracefully)
if (!apiKey) {
    console.warn("OPENAI_API_KEY is not set. AI features will fail.");
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export class AIService {
  static async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodType<T>,
    schemaName: string
  ): Promise<T> {
    try {
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06", // Use latest 4o or simplified
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: zodResponseFormat(schema, schemaName),
        temperature: 0.2, // Low temp for analysis
      });

      const result = completion.choices[0].message.parsed;
      if (!result) {
        throw new Error("AI returned null result");
      }
      return result;
    } catch (error) {
      console.error("AI Service Error:", error);
      // Mask error for client
      throw new Error("Analysis failed. Please try again later.");
    }
  }

  static async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
      try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ]
        });
        return completion.choices[0].message.content || "";
      } catch (error) {
          console.error("AI Service Text Error:", error);
          throw new Error("Processing failed.");
      }
  }
}
