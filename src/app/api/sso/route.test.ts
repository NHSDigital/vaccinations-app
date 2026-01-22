import { signIn } from "@project/auth";
import { GET } from "@src/app/api/sso/route";
import config from "@src/utils/config";
import { SESSION_ID_COOKIE_NAME } from "@src/utils/constants";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
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
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

jest.mock("next/headers", () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

let randomUUIDSpy: jest.SpyInstance;
const mockRandomUUID = "mock-random-uuid";
const mockedConfig = config as ConfigMock;
const mockMaxSessionAgeMinutes = 8;

const getMockRequest = (testUrl: string, params?: Record<string, string>) => {
  const headers = new Headers([
    ["X-Amzn-Trace-Id", "sausages"],
    ["X-Clacks-Overhead", "GNU Terry Pratchett"],
    ["referer", "testing"],
  ]);

  return {
    nextUrl: {
      searchParams: new URLSearchParams(params),
      origin: new URL(testUrl).origin,
      href: testUrl,
    },
    headers: headers,
  } as NextRequest;
};

let requestCookies: RequestCookies;

describe("GET handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const defaultConfig = configBuilder().withMaxSessionAgeMinutes(mockMaxSessionAgeMinutes).build();
    Object.assign(mockedConfig, defaultConfig);

    const fakeHeaders: ReadonlyHeaders = new Headers([["X-Amzn-Trace-Id", "trace-id"]]);
    (headers as jest.Mock).mockResolvedValue(fakeHeaders);

    requestCookies = new RequestCookies(fakeHeaders);
    (cookies as jest.Mock).mockResolvedValue(requestCookies);

    randomUUIDSpy = jest.spyOn(global.crypto, "randomUUID").mockReturnValue(mockRandomUUID);
  });

  afterAll(() => {
    randomUUIDSpy.mockRestore();
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

  it("should generate and set a session-id cookie", async () => {
    const testUrl = "https://testurl";
    const mockRequest = getMockRequest(testUrl, {
      assertedLoginIdentity: "test-identity",
    });

    await GET(mockRequest);

    expect(requestCookies?.get(SESSION_ID_COOKIE_NAME)?.value).toBe(mockRandomUUID);
  });
});
