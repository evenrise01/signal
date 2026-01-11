import { Elysia } from "elysia";
import { routes } from "./routes";
import cors from "@elysiajs/cors";

const port = process.env.PORT || 3000;

const app = new Elysia()
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
  .use(routes)
  .get("/", () => "Signal MVP API")
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);