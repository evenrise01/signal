import { Elysia, t } from "elysia";
import { AnalyzeTextSchema, AnalyzeScreenshotSchema } from "../schemas/analysis";
import { TextAnalysisPipeline } from "../pipelines/text-analysis";

export const analyzeRoutes = new Elysia({ prefix: "/analyze" })
  .post("/text", async ({ body, set }) => {
    try {
      console.log("📥 Received text analysis request:", { 
        text: body.text?.substring(0, 100), 
        context: body.context 
      });
      
      const result = await TextAnalysisPipeline.run(body.text, body.context);
      
      console.log("✅ Analysis completed successfully");
      return result;
      
    } catch (e: any) {
      console.error("❌ Analysis Pipeline Error:", e?.message);
      set.status = 500;
      return { 
        error: e instanceof Error ? e.message : "Analysis failed",
        details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
      };
    }
  }, {
    body: AnalyzeTextSchema
  })
  .post("/screenshot", async ({ body, set }) => {
    try {
      console.log("📥 Received screenshot analysis request", {
        context: body.context
      });
      
      // image is expected as base64 string
      const result = await TextAnalysisPipeline.run(undefined, body.context, body.image);
      
      console.log("✅ Screenshot analysis completed");
      return result;
      
    } catch (e: any) {
      console.error("❌ Screenshot Pipeline Error:", e?.message);
      set.status = 500;
      return { 
        error: e instanceof Error ? e.message : "Analysis failed",
        details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
      };
    }
  }, {
    body: AnalyzeScreenshotSchema
  });