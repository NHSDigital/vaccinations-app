/**
 * @jest-environment node
 */
import { auth } from "@project/auth";
import { unprotectedUrlPaths } from "@src/app/_components/inactivity/constants";
import { _getHeadersForLogging, config, middleware } from "@src/middleware";
import appConfig from "@src/utils/config";
import { SESSION_ID_COOKIE_NAME } from "@src/utils/constants";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/config");

const middlewareRegex = new RegExp(config.matcher[0]);

function getMockRequest(testUrl: string) {
  const headers = new Headers([
    ["X-Amzn-Trace-Id", "sausages"],
    ["X-Clacks-Overhead", "GNU Terry Pratchett"],
    ["referer", "testing"],
  ]);

  const cookies: RequestCookies = new RequestCookies(headers).set(SESSION_ID_COOKIE_NAME, "session-id-value");

  return {
    nextUrl: {
      origin: new URL(testUrl).origin,
      pathname: new URL(testUrl).pathname,
    },
    url: testUrl,
    headers: headers,
    cookies: cookies,
  };
}

describe("middleware", () => {
  const mockedConfig = appConfig as unknown as ConfigMock;

  beforeEach(() => {
    const defaultConfig = configBuilder()
      .withNhsAppRedirectLoginUrl(new URL("https://nhs-app-redirect-login-url"))
      .build();
    Object.assign(mockedConfig, defaultConfig);

    jest.clearAllMocks();
  });

  it("redirects users without active session to session-logout page and prevent browser caching the redirect", async () => {
    const testUrl = "https://nhs-app-redirect-login-url/";
    const mockRequest = getMockRequest(testUrl);

    (auth as jest.Mock).mockResolvedValue(null); // No authenticated session

    const result = await middleware(mockRequest as NextRequest);

    expect(result.status).toBe(307);
    expect(result.headers.get("Location")).toEqual(testUrl);
    expect(result.headers.get("Cache-Control")).toEqual("no-cache, no-store, max-age=0, must-revalidate");
  });

  it("pass through for users with active session", async () => {
    const testUrl = "https://testurl/abc";
    const mockRequest = getMockRequest(testUrl);

    (auth as jest.Mock).mockResolvedValue({ user: "test" });

    const result = await middleware(mockRequest as NextRequest);
    expect(result.status).toBe(200);
  });

  it("_getHeadersForLogging() contains map of special headers", async () => {
    const testUrl = "https://nhs-app-redirect-login-url/";
    const mockRequest = getMockRequest(testUrl);

    expect(_getHeadersForLogging(mockRequest as NextRequest)).toEqual(
      expect.objectContaining({ referer: "testing", "user-agent": "-" }),
    );
  });

  it.each(unprotectedUrlPaths)("is skipped for unprotected path %s", async (path: string) => {
    // verify the regex does not match unprotected paths
    expect(middlewareRegex.test(path)).toBe(false);
  });

  it("runs for protected paths", async () => {
    // verify the regex matches for protected paths
    expect(middlewareRegex.test("/schedule")).toBe(true);
  });
});
