/**
 * @jest-environment node
 */

import { auth } from "@project/auth";
import { unprotectedUrlPaths } from "@src/app/_components/inactivity/constants";
import { config, middleware } from "@src/middleware";
import { NextRequest } from "next/server";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
}));

const middlewareRegex = new RegExp(config.matcher[0]);
const otherExcludedPaths = ["/favicon.ico", "/assets", "/js", "/css", "/_next"];

function getMockRequest(testUrl: string) {
  return {
    nextUrl: {
      origin: new URL(testUrl).origin,
      pathname: new URL(testUrl).pathname,
    },
    url: testUrl,
  };
}

describe("middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects users without active session to session-logout page", async () => {
    const testUrl = "https://www.nhsapp.service.nhs.uk/login?redirect_to=index";
    const mockRequest = getMockRequest(testUrl);

    (auth as jest.Mock).mockResolvedValue(null); // No authenticated session

    const result = await middleware(mockRequest as NextRequest);

    expect(result.status).toBe(307);
    expect(result.headers.get("Location")).toEqual(testUrl);
  });

  it("pass through for users with active session", async () => {
    const testUrl = "https://testurl/abc";
    const mockRequest = getMockRequest(testUrl);

    (auth as jest.Mock).mockResolvedValue({ user: "test" });

    const result = await middleware(mockRequest as NextRequest);
    expect(result.status).toBe(200);
  });

  it.each(unprotectedUrlPaths)("is skipped for unprotected path %s", async (path: string) => {
    // verify the regex does not match unprotected paths
    expect(middlewareRegex.test(path)).toBe(false);
  });

  it.each(otherExcludedPaths)("is skipped for static path %s", async (path: string) => {
    // verify the regex does not match the path
    expect(middlewareRegex.test(path)).toBe(false);
  });

  it("runs for protected paths", async () => {
    // verify the regex matches for protected paths
    expect(middlewareRegex.test("/schedule")).toBe(true);
  });
});
