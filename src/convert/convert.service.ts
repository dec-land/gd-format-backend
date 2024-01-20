import { ChatGPTAPI } from "chatgpt";
import { ConversionType, GodotVersion } from "../types/Convert";
import BaseError from "../errors/BaseError";
import console from "console";

export class ConvertService {
  public async convert(
    code: string,
    version: GodotVersion,
    type: ConversionType
  ) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new BaseError("OpenAI API Key not set");

    const api = new ChatGPTAPI({
      apiKey,
    });

    try {
      const codeMessage =
        type === "gdscript-c#" ? "GDScript code to C#" : "C# code to GDScript";

      const res =
        await api.sendMessage(`Convert the following ${codeMessage} for Godot version ${version}. Return the converted code and nothing else.
        
        ${code}`);

      if (res.text.includes("```csharp")) {
        return res.text
          .replaceAll("```csharp", "")
          .replaceAll("```", "")
          .trim();
      }

      return res.text;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error receiving message from chat gpt: ${error.message}`
        );
        throw new BaseError("Internal server error", error.message);
      }
    }
  }
}

export default new ConvertService();
