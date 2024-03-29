import { beforeEach, describe, expect, jest, mock, test } from "bun:test";
import convertService from "../convert.service";
import { GodotVersion } from "../../types/Convert";
import { ChatGPTAPI } from "chatgpt";
import BaseError from "../../errors/BaseError";

const sendMessageMock = jest.fn().mockResolvedValue({
  text: "result",
});

beforeEach(() => {
  sendMessageMock.mockClear();
});

const gdScriptMock = `print('hello')`;
const csharpMock = `GD.Print("hello");`;
const version: GodotVersion = "4";
const mockAPIKey = "KEY";

describe("Convert Service", () => {
  mock.module("chatgpt", () => {
    return {
      ChatGPTAPI: jest.fn().mockImplementation(() => {
        return {
          sendMessage: sendMessageMock,
        };
      }),
    };
  });

  test("it throws an error if api key is not in the env variables", async () => {
    process.env.OPENAI_API_KEY = undefined;
    await expect(
      convertService.convert(gdScriptMock, version, "gdscript-c#")
    ).rejects.toThrow(new BaseError("OpenAI API Key not set"));

    // Reset env
    process.env.OPENAI_API_KEY = "KEY";
  });

  test("it correctly passes through the api key to the ChatGPTAPI", async () => {
    await convertService.convert(gdScriptMock, version, "gdscript-c#");
    expect(ChatGPTAPI).toHaveBeenCalledWith({ apiKey: mockAPIKey });
  });

  test("it sends the correct message to chat gpt when doing gdscript to c# conversion", async () => {
    await convertService.convert(gdScriptMock, version, "gdscript-c#");
    expect(sendMessageMock).toHaveBeenCalledWith(
      expect.stringContaining(`Godot version ${version}`)
    );
    expect(sendMessageMock).toHaveBeenCalledWith(
      expect.stringContaining(`GDScript code to C#`)
    );
    expect(sendMessageMock).toHaveBeenCalledWith(
      expect.stringContaining(gdScriptMock)
    );
  });

  test("it sends the correct message to chat gpt when doing c# to gdscript conversion and version 3", async () => {
    await convertService.convert(csharpMock, "3", "c#-gdscript");
    expect(sendMessageMock).toHaveBeenCalledWith(
      expect.stringContaining(`Godot version 3`)
    );
    expect(sendMessageMock).toHaveBeenCalledWith(
      expect.stringContaining(`C# code to GDScript`)
    );
    expect(sendMessageMock).toHaveBeenCalledWith(
      expect.stringContaining(csharpMock)
    );
  });

  test("correctly removes the c# markdown", async () => {
    sendMessageMock.mockResolvedValueOnce({
      text: `\`\`\`csharp
      void Test()
      {
          GD.Print("hello");
      }
      \`\`\``,
    });
    const res = await convertService.convert(
      gdScriptMock,
      version,
      "gdscript-c#"
    );
    expect(res).toEqual(
      'void Test()\n      {\n          GD.Print("hello");\n      }'
    );
  });

  test("correctly removes the gdscript markdown", async () => {
    sendMessageMock.mockResolvedValueOnce({
      text: `\`\`\`gdscript
      func test():
	      print("hello")
      \`\`\``,
    });
    const res = await convertService.convert(
      csharpMock,
      version,
      "c#-gdscript"
    );
    expect(res).toEqual('func test():\n\t      print("hello")');
  });
});
