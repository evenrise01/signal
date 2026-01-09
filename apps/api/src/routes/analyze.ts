import { Elysia, t } from "elysia";
import { AnalyzeTextSchema } from "../schemas/analysis";
import { TextAnalysisPipeline } from "../pipelines/text-analysis";

export const analyzeRoutes = new Elysia({ prefix: "/analyze" })
  .post("/text", async ({ body, set }) => {
    try {
      const result = await TextAnalysisPipeline.run(body.text, body.context);
      return result;
    } catch (e) {
      console.error(e);
      set.status = 500;
      return { error: "Analysis failed" };
    }
  }, {
    body: AnalyzeTextSchema
  });
