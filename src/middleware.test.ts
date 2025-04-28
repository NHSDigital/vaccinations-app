/**
 * @jest-environment node
 */

import { auth, signIn } from "@project/auth";
import { NHS_LOGIN_PROVIDER_ID } from "@src/app/api/auth/[...nextauth]/provider";
import { middleware } from "@src/middleware";
import { NextRequest } from "next/server";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
}));

function getMockRequest(testUrl: string, params?: Record<string, string>) {
  return {
    nextUrl: {
      searchParams: new URLSearchParams(params),
      origin: new URL(testUrl).origin,
    },
  };
}

describe("middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects unauthenticated users with assertedLoginIdentity", async () => {
    const testUrl = "https://testurl/abc";
    const mockRequest = getMockRequest(testUrl, {
      assertedLoginIdentity: "identity123",
    });

    (signIn as jest.Mock).mockResolvedValue(testUrl);
    (auth as jest.Mock).mockResolvedValue(null); // No authenticated session

    const result = await middleware(mockRequest as NextRequest);

    expect(signIn).toHaveBeenCalledWith(
      NHS_LOGIN_PROVIDER_ID,
      expect.any(Object),
      { asserted_login_identity: "identity123" },
    );

    expect(result.status).toBe(307);
    expect(result.headers.get("Location")).toEqual(encodeURI(testUrl));
  });

  it("error page for unauthenticated users without assertedLoginIdentity", async () => {
    const testUrl = "https://testurl/abc";
    const mockRequest = getMockRequest(testUrl);

    (auth as jest.Mock).mockResolvedValue(null); // No authenticated session

    const result = await middleware(mockRequest as NextRequest);
    expect(result.status).toBe(307);
    const redirectUrl = `${new URL(testUrl).origin}/sso-failure?error=Parameter not found: assertedLoginIdentity`;
    expect(result.headers.get("Location")).toEqual(encodeURI(redirectUrl));
  });

  it("error page for unauthenticated users with assertedLoginIdentity and failed signIn", async () => {
    const testUrl = "https://testurl/abc";
    const mockRequest = getMockRequest(testUrl, {
      assertedLoginIdentity: "identity123",
    });

    (signIn as jest.Mock).mockRejectedValue(new Error("problem with signIn"));
    (auth as jest.Mock).mockResolvedValue(null); // No authenticated session

    const result = await middleware(mockRequest as NextRequest);
    expect(result.status).toBe(307);
    const redirectUrl = `${new URL(testUrl).origin}/sso-failure?error=Error: problem with signIn`;
    expect(result.headers.get("Location")).toEqual(encodeURI(redirectUrl));
  });

  it("pass through for authenticated users", async () => {
    const testUrl = "https://testurl/abc";
    const mockRequest = getMockRequest(testUrl);

    (auth as jest.Mock).mockResolvedValue({
      expires: "test-expiry-date",
    });

    const result = await middleware(mockRequest as NextRequest);
    expect(result.status).toBe(200);
  });
});
