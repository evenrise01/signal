import { Elysia } from "elysia";
import { analyzeRoutes } from "./analyze";

export const routes = new Elysia()
  .get("/health", () => ({ status: "ok" }))
  .use(analyzeRoutes);