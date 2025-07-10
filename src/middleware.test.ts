/**
 * @jest-environment node
 */
import { auth } from "@project/auth";
import { unprotectedUrlPaths } from "@src/app/_components/inactivity/constants";
import { config, middleware } from "@src/middleware";
import { AppConfig, configProvider } from "@src/utils/config";
import { NextRequest } from "next/server";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock("@src/utils/config");

const middlewareRegex = new RegExp(config.matcher[0]);
const otherExcludedPaths = ["/favicon.ico", "/assets", "/js", "/css", "/_next"];

function getMockRequest(testUrl: URL) {
  return {
    nextUrl: {
      origin: testUrl.origin,
      pathname: testUrl.pathname,
    },
    url: testUrl.href,
  };
}

describe("middleware", () => {
  beforeEach(() => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        NHS_APP_REDIRECT_LOGIN_URL: new URL("https://nhs-app-redirect-login-url"),
      }),
    );
    jest.clearAllMocks();
  });

  it("redirects users without active session to session-logout page", async () => {
    const testUrl = new URL("https://nhs-app-redirect-login-url/");
    const mockRequest = getMockRequest(testUrl);

    (auth as jest.Mock).mockResolvedValue(null); // No authenticated session

    const result = await middleware(mockRequest as NextRequest);

    expect(result.status).toBe(307);
    expect(result.headers.get("Location")).toEqual(testUrl.href);
  });

  it("pass through for users with active session", async () => {
    const testUrl = new URL("https://testurl/abc");
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
