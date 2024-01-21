import { beforeEach, describe, expect, jest, mock, test } from "bun:test";
import { FormatController } from "../format.controller";

const formatMock = jest.fn();

beforeEach(() => {
  formatMock.mockClear();
});

describe("Format Controller", () => {
  mock.module("../format.service.ts", () => {
    return {
      default: { formatGDScript: formatMock },
    };
  });

  test("it correctly calls format on the service with max line length not specified", async () => {
    const controller = new FormatController();
    await controller.formatGDScript("test");
    expect(formatMock).toHaveBeenCalledWith("test", undefined);
  });

  test("it correctly calls format on the service with max line length specified", async () => {
    const controller = new FormatController();
    await controller.formatGDScript("test", 100);
    expect(formatMock).toHaveBeenCalledWith("test", 100);
  });
});
