import { _sanitiseErrorContext } from "./error-utils";

describe("_sanitiseErrorContext", () => {
  it("returns undefined for non-object inputs", () => {
    expect(_sanitiseErrorContext(null)).toBeUndefined();
    expect(_sanitiseErrorContext(undefined)).toBeUndefined();
    expect(_sanitiseErrorContext("string error")).toBeUndefined();
    expect(_sanitiseErrorContext(123)).toBeUndefined();
  });

  it("should filter out keys that are not in the allowlist", () => {
    const raw = {
      message: "Something went wrong",
      test: "test key",
    };
    const result = _sanitiseErrorContext(raw);

    expect(result).toHaveProperty("message");
    expect(result).not.toHaveProperty("test");
  });

  it("should only include keys that have string values", () => {
    const raw = {
      message: "Valid message",
      lineno: 42,
      colno: "10",
    };
    const result = _sanitiseErrorContext(raw);

    expect(result).toEqual({
      message: "Valid message",
      colno: "10",
    });
    expect(result).not.toHaveProperty("lineno");
  });

  it("should truncate fields longer than 2000 characters", () => {
    const longString = "a".repeat(3000);
    const result = _sanitiseErrorContext({ message: longString });

    expect(result?.message).toHaveLength(2000);
    expect(result?.message).toBe(longString.slice(0, 2000));
  });

  it("should remove forbidden control characters but keeps tabs and newlines", () => {
    // \x00 is 'Null Character' (forbidden), \n is 'Newline' (allowed), \t is 'Tab' (allowed)
    const raw = {
      message: "Hello\x00World\nThis\tis\rfine",
    };
    const result = _sanitiseErrorContext(raw);

    expect(result?.message).toBe("HelloWorld\nThis\tis\rfine");
  });

  it("should return undefined if the final object is empty", () => {
    const raw = { someRandomKey: "no allowed keys here" };
    expect(_sanitiseErrorContext(raw)).toBeUndefined();
  });

  it("should handle a full valid error context object", () => {
    const fullContext = {
      message: "Error message",
      stack: "Error: message\n at Object.<anonymous>...",
      digest: "next-digest-123",
      filename: "index.ts",
      lineno: "5",
      colno: "12",
    };
    const result = _sanitiseErrorContext(fullContext);
    expect(result).toEqual(fullContext);
  });
});
