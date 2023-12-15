import { describe, test, expect } from "vitest";
import { LoggingTaskSpecParseError, parseLoggingTaskSpec } from "./util.js";

describe("parsing logging task spec", () => {
  test("throws on invalid specification", () => {
    expect(() => {
      parseLoggingTaskSpec("1:");
    }).toThrow(LoggingTaskSpecParseError);
  });

  test("can contain a numeric range", () => {
    expect(parseLoggingTaskSpec("1:0..10")).toEqual({
      chainId: 1,
      startBlock: 0,
      endBlock: 10,
    });
  });

  test("allows specifying `last`", () => {
    expect(parseLoggingTaskSpec("1:0..last")).toEqual({
      chainId: 1,
      startBlock: 0,
      endBlock: "last",
    });
  });

  test("allows specifying `origin`", () => {
    expect(parseLoggingTaskSpec("1:origin..last")).toEqual({
      chainId: 1,
      startBlock: 0,
      endBlock: "last",
    });
  });

  test("allows specifying `ongoing`", () => {
    expect(parseLoggingTaskSpec("1:0..ongoing")).toEqual({
      chainId: 1,
      startBlock: 0,
      endBlock: "ongoing",
    });
  });

  test.todo("allows specifying negative indices");
});
