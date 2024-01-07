import { Elysia, t } from "elysia";

import console from "console";
import { FormatController } from "./format/format.controller";
import Parse from "./util/parse";
import cors from "@elysiajs/cors";
import InvalidGDScriptError from "./errors/InvalidGDScriptError";
import BaseError from "./errors/BaseError";

const app = new Elysia()
  .use(cors())
  // .use(helmet)
  .decorate("formatController", new FormatController())
  .onError(({ error, set }) => {
    if (error instanceof BaseError) {
      set.status = error.status;
    }
    return error;
  })
  .get("/health", () => {
    return { status: "Server is up and running" };
  })
  .group("/v1", (app) =>
    app.group("/format", (app) =>
      app.post(
        "/gd-script",
        ({ formatController, body, query: { max_line_length } }) => {
          return formatController.formatGDScript(
            body,
            Parse.integer(max_line_length) ?? undefined
          );
        },
        {
          type: "text",
          body: t.String({ minLength: 1, maxLength: 1000000 }),
          query: t.Object({
            max_line_length: t.Optional(t.Numeric({ minimum: 50 })),
          }),
        }
      )
    )
  );

app.listen(3000);

console.log(
  `🐸 Backend is running at ${app.server?.hostname}:${app.server?.port}`
);

export type Server = typeof app;
