import { handlers } from "@project/auth";
import { extractRequestContextFromHeadersAndCookies } from "@project/src/utils/requestScopedStorageWrapper";
import { GET } from "@src/app/api/auth/[...nextauth]/route";
import { logger } from "@src/utils/logger";
import { NextRequest } from "next/server";

jest.mock("@project/auth", () => ({
  handlers: {
    GET: jest.fn(),
    POST: jest.fn(),
  },
}));

jest.mock("@src/app/api/auth/[...nextauth]/provider", () => ({
  NHS_LOGIN_PROVIDER_ID: "nhs-login",
}));

jest.mock("@src/utils/logger", () => ({
  logger: {
    child: jest.fn().mockReturnValue({
      error: jest.fn(),
      info: jest.fn(),
    }),
  },
}));

jest.mock("@project/src/utils/requestContext", () => ({
  asyncLocalStorage: {
    run: jest.fn().mockImplementation((_ctx: unknown, callback: () => unknown) => callback()),
  },
}));

jest.mock("@project/src/utils/requestScopedStorageWrapper");

jest.mock("next/server", () => ({
  NextRequest: jest.fn().mockImplementation((url: string, init?: RequestInit) => ({
    url,
    headers: init?.headers ?? new Headers(),
  })),
}));

const buildMockRequest = (pathname: string, params?: Record<string, string>): NextRequest =>
  ({
    method: "GET",
    nextUrl: {
      pathname,
      searchParams: new URLSearchParams(params),
    },
  }) as unknown as NextRequest;

describe("GET", () => {
  const mockLogError = (logger.child as jest.Mock).mock.results[0].value.error as jest.Mock;
  const mockLogInfo = (logger.child as jest.Mock).mock.results[0].value.info as jest.Mock;
  const mockResponse = { status: 200 } as Response;

  const mockContext = { sessionId: "test-session-id", traceId: "test-trace-id", nextUrl: "" };

  beforeEach(() => {
    (handlers.GET as jest.Mock).mockResolvedValue(mockResponse);
    (extractRequestContextFromHeadersAndCookies as jest.Mock).mockReturnValueOnce(mockContext);
  });

  it("should log the pathname on GET request with correct context", async () => {
    const req = buildMockRequest("/api/auth/signin") as unknown as NextRequest;

    await GET(req);

    expect(mockLogInfo).toHaveBeenCalledWith(
      {
        context: { pathname: "/api/auth/signin" },
        sessionId: "test-session-id",
        traceId: "test-trace-id",
        nextUrl: "/api/auth/signin",
      },
      "GET NextAuth route",
    );
  });

  it("should delegate to nextAuth handlers.GET with the original request", async () => {
    const req = buildMockRequest("/api/auth/callback/nhs-login") as unknown as NextRequest;

    await GET(req);

    expect(handlers.GET).toHaveBeenCalledWith(req);
  });

  describe("when the callback URL contains an OAuth error", () => {
    it("should log the error and error_description", async () => {
      const req = buildMockRequest("/api/auth/callback/nhs-login", {
        error: "access_denied",
        error_description: "User cancelled login",
      }) as unknown as NextRequest;

      await GET(req);

      expect(mockLogError).toHaveBeenCalledWith(
        { error: "access_denied", error_description: "User cancelled login" },
        "OAuth provider returned error in callback",
        {
          sessionId: "test-session-id",
          traceId: "test-trace-id",
          nextUrl: "/api/auth/callback/nhs-login",
        },
      );
    });

    it("should log null when error_description is absent", async () => {
      const req = buildMockRequest("/api/auth/callback/nhs-login", { error: "server_error" }) as unknown as NextRequest;

      await GET(req);

      expect(mockLogError).toHaveBeenCalledWith(
        { error: "server_error", error_description: null },
        "OAuth provider returned error in callback",
        {
          sessionId: "test-session-id",
          traceId: "test-trace-id",
          nextUrl: "/api/auth/callback/nhs-login",
        },
      );
    });
  });

  describe("when the callback URL has no error", () => {
    it("should not log an error", async () => {
      const req = buildMockRequest("/api/auth/callback/nhs-login") as unknown as NextRequest;

      await GET(req);

      expect(mockLogError).not.toHaveBeenCalled();
    });
  });

  describe("when the path is not the OAuth callback", () => {
    it("should not log an error even if an error param is present", async () => {
      const req = buildMockRequest("/api/auth/signin", { error: "OAuthCallbackError" }) as unknown as NextRequest;

      await GET(req);

      expect(mockLogError).not.toHaveBeenCalled();
    });
  });
});
