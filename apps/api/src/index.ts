import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { routes } from "./routes";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get("origin");
        const allowedOrigins = [
          "https://signal-web-frontend.vercel.app",
          "http://localhost:3000",
          "http://localhost:3001",
        ];
        
        // Allow requests from allowed origins or no origin (like Postman)
        return allowedOrigins.includes(origin || "") || !origin;
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
      exposeHeaders: ["Content-Type"],
      maxAge: 86400, // 24 hours
    })
  )
  .use(routes)
  .get("/", () => "Signal MVP API")
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);