import { Elysia } from "elysia";
import { analyzeRoutes } from "./analyze";

// NO CORS HERE - it's already at root level
export const routes = new Elysia()
  .get("/health", () => ({ status: "ok" }))
  .use(analyzeRoutes);