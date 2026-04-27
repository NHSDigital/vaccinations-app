import { signIn } from "@project/auth";
import { GET } from "@src/app/api/sso/route";
import config from "@src/utils/config";
import { SESSION_ID_COOKIE_NAME } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { ResponseCookie, ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

jest.mock("@project/auth", () => ({
  signIn: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));
jest.mock("@src/utils/getHeadersForLogging", () => ({
  getHeadersForLogging: jest.fn().mockReturnValue({ "mock-header": "mock-value" }),
}));
jest.mock("@src/utils/logger", () => ({
  logger: {
    child: jest.fn().mockReturnValue({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    }),
  },
  extractRootTraceIdFromAmznTraceId: jest.fn().mockReturnValue("mock-trace-id"),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

let randomUUIDSpy: jest.SpyInstance;
const mockRandomUUID = "mock-random-uuid";
const mockedConfig = config as ConfigMock;
const mockMaxSessionAgeMinutes = 8;
const mockNowTimeInSeconds = 1749052001;

const getMockRequest = (testUrl: string, params?: Record<string, string>) => {
  const headers = new Headers([
    ["X-Amzn-Trace-Id", "sausages"],
    ["X-Clacks-Overhead", "GNU Terry Pratchett"],
    ["referer", "testing"],
  ]);
  const url = new URL(testUrl);

  return {
    nextUrl: {
      searchParams: new URLSearchParams(params),
      origin: url.origin,
      href: testUrl,
      pathname: url.pathname,
    },
    method: "GET",
    headers: headers,
  } as NextRequest;
};

let responseCookies: ResponseCookies;

describe("GET handler", () => {
  const mockLogInfo = (logger.child as jest.Mock).mock.results[0].value.info as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(mockNowTimeInSeconds * 1000);
    const defaultConfig = configBuilder().withMaxSessionAgeMinutes(mockMaxSessionAgeMinutes).build();
    Object.assign(mockedConfig, defaultConfig);

    const fakeHeaders: ReadonlyHeaders = new Headers([["X-Amzn-Trace-Id", "trace-id"]]);
    (headers as jest.Mock).mockResolvedValue(fakeHeaders);

    responseCookies = new ResponseCookies(fakeHeaders);
    (cookies as jest.Mock).mockResolvedValue(responseCookies);

    randomUUIDSpy = jest.spyOn(global.crypto, "randomUUID").mockReturnValue(mockRandomUUID);
  });

  afterAll(() => {
    randomUUIDSpy.mockRestore();
    jest.useRealTimers();
  });

  it("logs method, pathname and headers when the route is invoked", async () => {
    const testUrl = "https://testurl/api/sso";
    const mockRequest = getMockRequest(testUrl, { assertedLoginIdentity: "test-identity" });

    (signIn as jest.Mock).mockResolvedValue("/some-url");

    await GET(mockRequest);

    expect(mockLogInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.objectContaining({
          method: "GET",
          pathname: "/api/sso",
          headers: { "mock-header": "mock-value" },
        }),
      }),
      "SSO route invoked",
    );
  });

  it("redirects to sso-failure if assertedLoginIdentity parameter is missing", async () => {
    const testUrl = "https://testurl";
    const mockRequest = getMockRequest(testUrl);

    await GET(mockRequest);

    expect(redirect).toHaveBeenCalledWith("/sso-failure");
  });

  it("redirects to sso-failure on signIn error", async () => {
    const testUrl = "https://testurl";
    const mockRequest = getMockRequest(testUrl, {
      assertedLoginIdentity: "test-identity",
    });

    (signIn as jest.Mock).mockRejectedValue(new Error("Sign-in failed"));

    await GET(mockRequest);

    expect(redirect).toHaveBeenCalledWith("/sso-failure");
  });

  it("redirects to the URL returned by signIn", async () => {
    const testUrl = "https://testurl";
    const mockRequest = getMockRequest(testUrl, {
      assertedLoginIdentity: "test-identity",
    });

    (signIn as jest.Mock).mockResolvedValue("https://testurl/path");

    await GET(mockRequest);

    expect(redirect).toHaveBeenCalledWith("https://testurl/path");
  });

  it("should generate and set a session-id cookie with expiry time equal to session expiry", async () => {
    const testUrl = "https://testurl";
    const mockRequest = getMockRequest(testUrl, {
      assertedLoginIdentity: "test-identity",
    });

    await GET(mockRequest);

    const sessionIdCookie: ResponseCookie | undefined = responseCookies?.get(SESSION_ID_COOKIE_NAME);
    expect(sessionIdCookie?.value).toBe(mockRandomUUID);
    const expectedSessionCookieExpiry = new Date(mockNowTimeInSeconds * 1000 + mockMaxSessionAgeMinutes * 60 * 1000);
    expect(sessionIdCookie?.expires).toEqual(expectedSessionCookieExpiry); // now + mockMaxSessionAgeMinutes
  });
});
