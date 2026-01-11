import { Elysia } from "elysia";
import { analyzeRoutes } from "./analyze";
import { cors } from "@elysiajs/cors";

export const routes = new Elysia()
  .use(
    cors({
      origin: [
        "https://signal-web-frontend.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001", // if your frontend runs on a different port locally
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  )
  .get("/health", () => ({ status: "ok" }))
  .use(analyzeRoutes);