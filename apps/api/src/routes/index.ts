import { Elysia } from "elysia";

export const routes = new Elysia()
  .get("/health", () => ({ status: "ok" }));
