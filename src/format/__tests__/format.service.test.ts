import { test, expect, mock, jest, describe } from "bun:test";
import formatService from "../format.service";

const randomUUIDMock = jest.fn().mockReturnValue("mocked-uuid");

mock.module("crypto", () => ({
  randomUUID: randomUUIDMock,
}));

const execMock = jest.fn();

mock.module("child_process", () => ({
  exec: execMock,
}));

const appendFileMock = jest.fn();
const existsMock = jest.fn().mockResolvedValue(false);
const readFileMock = jest.fn().mockResolvedValue("formatted-code");
const unlinkMock = jest.fn();

mock.module("fs/promises", () => ({
  appendFile: appendFileMock,
  exists: existsMock,
  readFile: readFileMock,
  unlink: unlinkMock,
}));

mock.module("util", () => ({
  promisify: mock((fn) => fn),
}));

/** @todo Need to fix exec not being correctly mocked */
describe("Format Service", () => {
  test("successful formatting", async () => {
    const formattedCode = await formatService.formatGDScript("code-to-format");

    expect(formattedCode).toBe("formatted-code");

    expect(appendFileMock).toHaveBeenCalledWith(
      "mocked-uuid.gd",
      "code-to-format"
    );
    expect(execMock).toHaveBeenCalledWith("gdformat mocked-uuid.gd -l 100");
    expect(existsMock).toHaveBeenCalledWith("mocked-uuid.gd");
    expect(unlinkMock).toHaveBeenCalledWith("mocked-uuid.gd");
  });
});
