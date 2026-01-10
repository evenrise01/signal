import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
}
const genAI = new GoogleGenerativeAI(apiKey || "");

export class AIService {
  static async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodType<T>,
    schemaName: string
  ): Promise<T> {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash-lite", 
          systemInstruction: systemPrompt,
          generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.5,
          }
        });
  
        const fullPrompt = `${userPrompt}\n\nIMPORTANT: Return valid JSON matching this structure: ${schemaName}.`;
        
        console.log("📤 Sending prompt:", fullPrompt.substring(0, 200));
        
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();
        
        console.log("📥 Raw AI response:");
        console.log(text); // <-- SEE WHAT'S ACTUALLY RETURNED
        
        if (!text) {
            throw new Error("AI returned empty result");
        }
  
        let cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        let parsed;
        try {
          parsed = JSON.parse(cleanText);
          
          console.log("✅ Parsed JSON:");
          console.log(JSON.stringify(parsed, null, 2)); // <-- SEE PARSED STRUCTURE
        } catch (e) {
           console.error("JSON PARSE ERROR", e);
           throw new Error(`JSON Parse Failed: ${cleanText.slice(0, 100)}...`);
        }
  
        // Validate with Zod
        const validated = schema.parse(parsed);
        console.log("✅ Validation successful");
        return validated;
  
      } catch (error: any) {
        console.error("AI Service Error:", error);
        if (error instanceof z.ZodError) {
            console.error("Schema Validation Error:", JSON.stringify(error.issues, null, 2));
        }
        // Mask error for client
        throw new Error("Analysis failed. Please try again later.");
      }
  }
}
