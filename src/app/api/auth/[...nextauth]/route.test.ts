import { handlers } from "@project/auth";
import { extractRequestContextFromHeadersAndCookies } from "@project/src/utils/requestScopedStorageWrapper";
import { GET, POST } from "@src/app/api/auth/[...nextauth]/route";
import { logger } from "@src/utils/logger";
import { NextRequest } from "next/server";

jest.mock("@project/auth", () => ({
  handlers: {
    GET: jest.fn(),
    POST: jest.fn(),
  },
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

jest.mock("@src/utils/getHeadersForLogging", () => ({
  getHeadersForLogging: jest.fn().mockReturnValue({ "mock-header": "mock-value" }),
}));

const buildMockGetRequest = (
  pathname: string,
  params?: Record<string, string>,
  headers: Headers = new Headers(),
): NextRequest =>
  ({
    method: "GET",
    nextUrl: {
      pathname,
      searchParams: new URLSearchParams(params),
    },
    headers,
  }) as unknown as NextRequest;

describe("NextAuth API Route", () => {
  const mockLogError = (logger.child as jest.Mock).mock.results[0].value.error as jest.Mock;
  const mockLogInfo = (logger.child as jest.Mock).mock.results[0].value.info as jest.Mock;
  const mockResponse = { status: 200 } as Response;
  const mockContext = { sessionId: "test-session-id", traceId: "test-trace-id", nextUrl: "" };

  beforeEach(() => {
    (handlers.GET as jest.Mock).mockResolvedValue(mockResponse);
    (handlers.POST as jest.Mock).mockResolvedValue(mockResponse);
    (extractRequestContextFromHeadersAndCookies as jest.Mock).mockReturnValueOnce(mockContext);
  });

  describe("GET", () => {
    it("should log the pathname on GET request with correct context", async () => {
      const req = buildMockGetRequest("/api/auth/signin") as unknown as NextRequest;

      await GET(req);

      expect(mockLogInfo).toHaveBeenCalledWith(
        {
          context: {
            method: "GET",
            pathname: "/api/auth/signin",
            headers: { "mock-header": "mock-value" },
          },
          sessionId: "test-session-id",
          traceId: "test-trace-id",
          nextUrl: "/api/auth/signin",
        },
        "NextAuth route",
      );
    });

    it("should delegate the request to nextAuth handlers.GET", async () => {
      const req = buildMockGetRequest("/api/auth/callback/nhs-login") as unknown as NextRequest;

      await GET(req);

      expect(handlers.GET as jest.Mock).toHaveBeenCalledWith(req);
    });

    describe("when the callback URL is called", () => {
      it("should log the error and error_description when present", async () => {
        const req = buildMockGetRequest("/api/auth/callback/nhs-login", {
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
        const req = buildMockGetRequest("/api/auth/callback/nhs-login", {
          error: "access_denied",
        }) as unknown as NextRequest;

        await GET(req);

        expect(mockLogError).toHaveBeenCalledWith(
          { error: "access_denied", error_description: null },
          "OAuth provider returned error in callback",
          {
            sessionId: "test-session-id",
            traceId: "test-trace-id",
            nextUrl: "/api/auth/callback/nhs-login",
          },
        );
      });

      it("should carry on and delegate to handlers.GET when error not present", async () => {
        const req = buildMockGetRequest("/api/auth/callback/nhs-login") as unknown as NextRequest;

        await GET(req);

        expect(handlers.GET as jest.Mock).toHaveBeenCalledWith(req);
      });
    });

    describe("when a non-callback url is called", () => {
      it("should not log an error even if an error param is present", async () => {
        const req = buildMockGetRequest("/api/auth/signin", { error: "OAuthCallbackError" }) as unknown as NextRequest;

        await GET(req);

        expect(mockLogError).not.toHaveBeenCalled();
      });
    });
  });

  describe("POST", () => {
    it("should log the pathname and method on POST request with correct context", async () => {
      const req = {
        method: "POST",
        nextUrl: { pathname: "/api/auth/callback/nhs-login" },
        headers: new Headers(),
      } as unknown as NextRequest;

      await POST(req);

      expect(mockLogInfo).toHaveBeenCalledWith(
        {
          context: {
            method: "POST",
            pathname: "/api/auth/callback/nhs-login",
            headers: { "mock-header": "mock-value" },
          },
          sessionId: "test-session-id",
          traceId: "test-trace-id",
          nextUrl: "/api/auth/callback/nhs-login",
        },
        "NextAuth route",
      );
    });

    it("should delegate the request to nextAuth handlers.POST", async () => {
      const req = {
        method: "POST",
        nextUrl: { pathname: "/api/auth/callback/nhs-login" },
        headers: new Headers(),
      } as unknown as NextRequest;

      (extractRequestContextFromHeadersAndCookies as jest.Mock).mockReturnValueOnce(mockContext);

      await POST(req);

      expect(handlers.POST as jest.Mock).toHaveBeenCalledWith(req);
    });
  });
});
