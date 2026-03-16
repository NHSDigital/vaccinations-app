import { _sanitiseErrorContext } from "./error-utils";

describe("_sanitiseErrorContext", () => {
  it("returns undefined for non-object inputs", () => {
    expect(_sanitiseErrorContext(null)).toBeUndefined();
    expect(_sanitiseErrorContext(undefined)).toBeUndefined();
    expect(_sanitiseErrorContext("string error")).toBeUndefined();
    expect(_sanitiseErrorContext(123)).toBeUndefined();
  });

  it("filters out keys that are not in the allowlist", () => {
    const raw = {
      message: "Something went wrong",
      test: "test key",
    };
    const result = _sanitiseErrorContext(raw);

    expect(result).toHaveProperty("message");
    expect(result).not.toHaveProperty("test");
  });

  it("only includes keys that have string values", () => {
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
  });

  it("truncates fields longer than 2000 characters", () => {
    const longString = "a".repeat(3000);
    const result = _sanitiseErrorContext({ message: longString });

    expect(result?.message).toHaveLength(2000);
  });

  it("removes control characters", () => {
    const raw = {
      message: "Line1\nLine2\rLine3\x09Tabbed\x00Hidden",
    };
    const result = _sanitiseErrorContext(raw);

    expect(result?.message).toBe("Line1Line2Line3TabbedHidden");
  });

  it("escapes HTML characters to prevent XSS", () => {
    const raw = {
      message: '<script>alert("xss")</script>',
      filename: "file&name.ts",
    };
    const result = _sanitiseErrorContext(raw);

    expect(result?.message).toBe("&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;");
    expect(result?.filename).toBe("file&amp;name.ts");
  });

  it("truncates BEFORE escaping to prevent broken HTML entities", () => {
    const longInput = "a".repeat(1999) + "<";
    const result = _sanitiseErrorContext({ message: longInput });

    expect(result?.message).toBe("a".repeat(1999) + "&lt;");
  });

  it("returns undefined if no allowed keys are present", () => {
    const raw = { someRandomKey: "no allowed keys here" };
    expect(_sanitiseErrorContext(raw)).toBeUndefined();
  });

  it("handles a full valid error context object", () => {
    const fullContext = {
      message: "Error message",
      stack: "Error: message at Object",
      digest: "next-digest-123",
      filename: "index.ts",
      lineno: "5",
      colno: "12",
    };
    const result = _sanitiseErrorContext(fullContext);
    expect(result).toEqual(fullContext);
  });
});
