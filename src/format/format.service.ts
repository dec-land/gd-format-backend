import { randomUUID } from "crypto";
import { appendFile, exists, readFile, unlink } from "fs/promises";
import { promisify } from "util";
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
        console.error(`Error: ${error.message}`);
      }
    } finally {
      if (await exists(fileName)) {
        await unlink(fileName);
      }
    }
    return body;
  }
}

export default new FormatService();
