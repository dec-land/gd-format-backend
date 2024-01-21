import {
  afterAll,
  beforeEach,
  describe,
  expect,
  jest,
  mock,
  test,
} from "bun:test";
import { ConvertController } from "../convert.controller";

const convertMock = jest.fn();

beforeEach(() => {
  mock.module("../convert.service.ts", () => {
    return {
      default: { convert: convertMock },
    };
  });
  convertMock.mockClear();
});

describe("Convert Controller", () => {
  test("it correctly calls convert on the service when converting gdscript to c#", async () => {
    const controller = new ConvertController();
    await controller.convertGdScriptToCSharp("test", "4");
    expect(convertMock).toHaveBeenCalledWith("test", "4", "gdscript-c#");
  });

  test("it correctly calls convert on the service when converting c# to gdscript", async () => {
    const controller = new ConvertController();
    await controller.convertCSharpToGdScript("test", "4");
    expect(convertMock).toHaveBeenCalledWith("test", "4", "c#-gdscript");
  });

  test("can specify different version when converting gdscript to c#", async () => {
    const controller = new ConvertController();
    await controller.convertGdScriptToCSharp("test", "3");
    expect(convertMock).toHaveBeenCalledWith("test", "3", "gdscript-c#");
  });

  test("can specify different version when converting c# to gdscript", async () => {
    const controller = new ConvertController();
    await controller.convertCSharpToGdScript("test", "3");
    expect(convertMock).toHaveBeenCalledWith("test", "3", "c#-gdscript");
  });
});
