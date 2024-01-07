import { Elysia, t } from "elysia";

import { helmet } from "elysia-helmet";

import console from "console";
import cors from "@elysiajs/cors";
import { FormatController } from "./format/format.controller";
import { Is } from "@dec-land/as-is";
import Parse from "./util/parse";

const app = new Elysia()
  .use(cors({ origin: ["http://localhost:3001"] }))
  .use(helmet)
  .decorate("formatController", new FormatController())

  .get("/health", () => {
    return { status: "Server is up and running" };
  })
  .group("/v1", (app) =>
    app.group("/format", (app) =>
      app.post(
        "/gd-script",
        ({ formatController, body, query: { max_line_length }, set }) => {
          if (
            max_line_length &&
            (!Is.integer(max_line_length) || max_line_length < 50)
          ) {
            set.status = 422;
            throw new Error("max_line_length must be an integer >= 50");
          }
          return formatController.formatGDScript(body, max_line_length);
        },
        {
          transform: ({ query }) => {
            // Parse as integer if its provided
            if (query.max_line_length) {
              query.max_line_length = Parse.integer(
                query.max_line_length,
                undefined
              );
            }
          },
          type: "text",
          body: t.String({ minLength: 1, maxLength: 1000000 }),
          query: t.Object({
            max_line_length: t.Optional(t.Integer({ minimum: 50 })),
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
