import { randomUUID } from "crypto";
import { appendFile, exists, readFile, unlink } from "fs/promises";
import { promisify } from "util";
import InvalidGDScriptError from "../errors/InvalidGDScriptError";
import BaseError from "../errors/BaseError";
const exec = promisify(require("child_process").exec);

export class FormatService {
  public async formatGDScript(body: string, max_line_length: number = 100) {
    const fileName = `${randomUUID()}.gd`;

    await appendFile(fileName, body);

    try {
      await exec(`gdformat ${fileName} -l ${max_line_length}`);

      const formatted = await readFile(fileName, "utf8");

      return formatted;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Unexpected token Token")) {
          throw new InvalidGDScriptError(
            "Code provided is not valid GDScript",
            error.message
          );
        }
        console.error(`Error: ${error.message}`);
        throw new BaseError('Internal server error', error.message);
      }
    } finally {
      if (await exists(fileName)) {
        await unlink(fileName);
      }
    }
  }
}

export default new FormatService();
