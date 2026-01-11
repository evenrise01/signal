import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { routes } from "./routes";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(
    cors({
      origin: [
        "https://signal-web-frontend.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(routes)
  .get("/", () => "Signal MVP API")
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);