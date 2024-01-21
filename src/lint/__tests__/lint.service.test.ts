import { test, expect, mock, jest, describe } from "bun:test";
import lintService from "../lint.service";

mock.module("crypto", () => ({
  randomUUID: mock(() => "mocked-uuid"),
}));

const execMock = jest.fn();

mock.module("child_process", () => ({
  exec: execMock,
}));

const appendFileMock = jest.fn();
const existsMock = jest.fn().mockResolvedValue(false);
const unlinkMock = jest.fn();

mock.module("fs/promises", () => ({
  appendFile: appendFileMock,
  exists: existsMock,
  unlink: unlinkMock,
}));

mock.module("../util/parse", () => ({
  integer: mock((value) => +value),
}));

describe("Lint Service", () => {
  test("successful linting", async () => {
    const lintResult = await lintService.lintGDScript("code-to-lint");

    expect(lintResult).toEqual({
      hasIssues: false,
      numberOfProblemsparsed: 0,
      problems: [],
    });

    expect(appendFileMock).toHaveBeenCalledWith(
      "mocked-uuid.gd",
      "code-to-lint"
    );
    expect(execMock).toHaveBeenCalledWith("gdlint mocked-uuid.gd");
    expect(existsMock).toHaveBeenCalledWith("mocked-uuid.gd");
    expect(unlinkMock).toHaveBeenCalledWith("mocked-uuid.gd");
  });
});
