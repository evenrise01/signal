import { Elysia } from "elysia";
import { routes } from "./routes";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(routes)
  .get("/", () => "Signal MVP API")
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);