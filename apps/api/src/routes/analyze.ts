import { Elysia, t } from "elysia";
import { AnalyzeTextSchema } from "../schemas/analysis";
import { TextAnalysisPipeline } from "../pipelines/text-analysis";

export const analyzeRoutes = new Elysia({ prefix: "/analyze" })
  .post("/text", async ({ body, set }) => {
    try {
      console.log("📥 Received analysis request:", { 
        text: body.text?.substring(0, 100), 
        context: body.context 
      });
      
      const result = await TextAnalysisPipeline.run(body.text, body.context);
      
      console.log("✅ Analysis completed successfully");
      return result;
      
    } catch (e) {
      // Detailed error logging
      console.error("❌ Analysis Pipeline Error:");
      console.error("Error type:", e?.constructor?.name);
      console.error("Error message:", e?.message);
      console.error("Full error:", e);
      console.error("Stack trace:", e?.stack);
      
      set.status = 500;
      
      // Return more specific error message during development
      return { 
        error: e instanceof Error ? e.message : "Analysis failed",
        // Remove in production:
        details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
      };
    }
  }, {
    body: AnalyzeTextSchema
  });