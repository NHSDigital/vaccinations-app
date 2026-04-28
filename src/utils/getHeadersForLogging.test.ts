import { getHeadersForLogging } from "@src/utils/getHeadersForLogging";
import { NextRequest } from "next/server";

function buildMockRequest(headers: Record<string, string> = {}): NextRequest {
  return { headers: new Headers(Object.entries(headers)) } as unknown as NextRequest;
}

describe("getHeadersForLogging", () => {
  it("returns '-' for all safe headers when none are present", () => {
    const req = buildMockRequest();

    expect(getHeadersForLogging(req)).toEqual({
      "cache-control": "-",
      "cloudfront-is-desktop-viewer": "-",
      "cloudfront-is-mobile-viewer": "-",
      "cloudfront-is-tablet-viewer": "-",
      "content-length": "-",
      "content-type": "-",
      referer: "-",
      "user-agent": "-",
    });
  });

  it("returns the value of all safe headers when all are present", () => {
    const req = buildMockRequest({
      "cache-control": "no-cache",
      "cloudfront-is-desktop-viewer": "true",
      "cloudfront-is-mobile-viewer": "false",
      "cloudfront-is-tablet-viewer": "false",
      "content-length": "42",
      "content-type": "application/x-www-form-urlencoded",
      referer: "https://example.com/previous-page",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    });

    expect(getHeadersForLogging(req)).toEqual({
      "cache-control": "no-cache",
      "cloudfront-is-desktop-viewer": "true",
      "cloudfront-is-mobile-viewer": "false",
      "cloudfront-is-tablet-viewer": "false",
      "content-length": "42",
      "content-type": "application/x-www-form-urlencoded",
      referer: "https://example.com/previous-page",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    });
  });

  it("does not include headers outside the safe list", () => {
    const req = buildMockRequest({
      authorization: "Bearer token",
      "x-amzn-trace-id": "Root=1-abc",
      cookie: "session=secret",
    });

    const result = getHeadersForLogging(req);

    expect(result).not.toHaveProperty("authorization");
    expect(result).not.toHaveProperty("x-amzn-trace-id");
    expect(result).not.toHaveProperty("cookie");
  });
});
