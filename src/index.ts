import { Elysia, t } from "elysia";

import console from "console";
import { FormatController } from "./format/format.controller";
import Parse from "./util/parse";
import cors from "@elysiajs/cors";
import BaseError from "./errors/BaseError";
import { LintController } from "./lint/lint.controller";
// import { helmet } from "elysia-helmet";
import { ConvertController } from "./convert/convert.controller";
import { logger } from "@grotto/logysia";
import { helmet } from "elysia-helmet";

const app = new Elysia()
  // .use(cors())
  .use(logger())
  .use(cors({ origin: ["https://gdscriptformatter.com"] }))
  .use(helmet())
  .decorate("formatController", new FormatController())
  .decorate("lintController", new LintController())
  .decorate("convertController", new ConvertController())
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
    app
      .group("/format", (app) =>
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
      .group("/lint", (app) =>
        app.post(
          "/gd-script",
          ({ lintController, body }) => {
            return lintController.lintGDScript(body);
          },
          {
            type: "text",
            body: t.String({ minLength: 1, maxLength: 1000000 }),
          }
        )
      )
      .group("/convert", (app) =>
        app
          .post(
            "/gdscript-csharp",
            async ({ convertController, body, query: { version } }) => {
              return convertController.convertGdScriptToCSharp(body, version);
            },
            {
              type: "text",
              body: t.String({ minLength: 1, maxLength: 10000 }),
              query: t.Object({
                version: t.Union([t.Literal("3"), t.Literal("4")]),
              }),
            }
          )
          .post(
            "/csharp-gdscript",
            async ({ convertController, body, query: { version } }) => {
              return convertController.convertCSharpToGdScript(body, version);
            },
            {
              type: "text",
              body: t.String({ minLength: 1, maxLength: 10000 }),
              query: t.Object({
                version: t.Union([t.Literal("3"), t.Literal("4")]),
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
