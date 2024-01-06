import { Elysia, t } from "elysia";

import { helmet } from "elysia-helmet";

import console from "console";
import cors from "@elysiajs/cors";
import { FormatController } from "./format/format.controller.ts";

const app = new Elysia()
  .use(cors())
  .use(helmet)
  // .use(rateLimit)
  .decorate("formatController", new FormatController())

  .get("/health", () => {
    return { status: "Server is up and running" };
  })
  .group("/v1", (app) =>
    app.group("/format", (app) =>
      app.post(
        "/gd-script",
        ({ formatController, body }) => {
          return formatController.formatGDScript(body);
        },
        {
          type: "text",
          body: t.String({ minLength: 1, maxLength: 1000000 }),
        }
      )
    )
  );

app.listen(3001);

console.log(
  `🐸 Backend is running at ${app.server?.hostname}:${app.server?.port}`
);

export type Server = typeof app;
