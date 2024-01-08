import { randomUUID } from "crypto";
import { appendFile, exists, unlink } from "fs/promises";
import { promisify } from "util";
import InvalidGDScriptError from "../errors/InvalidGDScriptError";
import BaseError from "../errors/BaseError";
import Parse from "../util/parse";

const exec = promisify(require("child_process").exec);

export class LintService {
  public async lintGDScript(code: string) {
    const fileName = `${randomUUID()}.gd`;

    await appendFile(fileName, code);

    try {
      await exec(`gdlint ${fileName}`);
      return {
        hasIssues: false,
        numberOfProblemsparsed: 0,
        problems: [],
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Unexpected token Token")) {
          throw new InvalidGDScriptError(
            "Code provided is not valid GDScript",
            error.message
          );
        }
        // The command has errored but its actually ran as intended.

        // Extract the number of failures so we can return it properly.
        const failureMessageRegex = /Failure: (\d+) problems found/;
        const match = error.message.match(failureMessageRegex);

        if (match) {
          const numberOfProblems = match[1];
          console.log(`Number of problems: ${numberOfProblems}`);

          // Remove the failed line, changed the filename to something more readable, remove the first line.
          const parsedProblemsArray = error.message
            .replace(failureMessageRegex, "")
            .replaceAll(fileName, "line")
            .replaceAll("Command failed: gdlint line\n", "")
            // Split each line and remove empty ones.
            .split("\n")
            .filter((line) => line);

          // Split each line and remove empty ones.
          return {
            hasIssues: true,
            numberOfProblems: Parse.integer(numberOfProblems),
            problems: parsedProblemsArray,
          };
        }
        console.error(`Error: ${error.message}`);
        throw new BaseError("Internal server error", error.message);
      }
    } finally {
      if (await exists(fileName)) {
        await unlink(fileName);
      }
    }
  }
}

export default new LintService();
