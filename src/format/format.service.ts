import { randomUUID } from "crypto";
import { appendFile, exists, readFile, unlink } from "fs/promises";
import { promisify } from "util";
const exec = promisify(require("child_process").exec);

export class FormatService {
  public async formatGDScript(body: string) {
    const fileName = `${randomUUID()}.gd`;
    console.log(`Creating file with name ${fileName}`);

    await appendFile(fileName, body);

    try {
      const { stdout, stderr } = await exec(`gdformat ${fileName}`);

      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);

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
