import { expect, describe, test } from "bun:test";
import Parse from "../parse";

describe("Parse", () => {
  test("integer", async () => {
    expect(Parse.integer("5")).toStrictEqual(5);
    expect(Parse.integer("-10")).toStrictEqual(-10);
    expect(Parse.integer("5.5")).toBeNull();
    expect(Parse.integer("Infinity")).toBeNull();

    expect(Parse.integer("")).toBeNull();
    expect(Parse.integer("false")).toBeNull();
    expect(Parse.integer(null)).toBeNull();
    expect(Parse.integer("", 0)).toStrictEqual(0);
  });
});
