import { beforeEach, describe, expect, jest, mock, test } from "bun:test";
import { LintController } from "../lint.controller";

const lintMock = jest.fn();

beforeEach(() => {
  lintMock.mockClear();
});

describe("Lint Controller", () => {
  mock.module("../lint.service.ts", () => {
    return {
      default: { lintGDScript: lintMock },
    };
  });

  test("it correctly calls lint on the service", async () => {
    const controller = new LintController();
    await controller.lintGDScript("test");
    expect(lintMock).toHaveBeenCalledWith("test");
  });
});
