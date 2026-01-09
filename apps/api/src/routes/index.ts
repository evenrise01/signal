import { Elysia } from "elysia";
import { analyzeRoutes } from "./analyze";

import { cors } from "@elysiajs/cors";

export const routes = new Elysia()
  .use(cors())
  .get("/health", () => ({ status: "ok" }))
  .use(analyzeRoutes);
