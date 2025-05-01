/**
 * @jest-environment node
 */

import { auth } from "@project/auth";
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
    url: testUrl,
  };
}

describe("middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects users without active session to sso-failure page", async () => {
    const testUrl = "https://testurl/abc";
    const mockRequest = getMockRequest(testUrl);

    (auth as jest.Mock).mockResolvedValue(null); // No authenticated session

    const result = await middleware(mockRequest as NextRequest);

    expect(result.status).toBe(307);
    expect(result.headers.get("Location")).toEqual(
      `${mockRequest.nextUrl.origin}/sso-failure?error=No%20active%20session%20found`,
    );
  });

  it("pass through for users with active session", async () => {
    const testUrl = "https://testurl/abc";
    const mockRequest = getMockRequest(testUrl);

    (auth as jest.Mock).mockResolvedValue({
      user: {
        birthdate: new Date(),
      },
    });

    const result = await middleware(mockRequest as NextRequest);
    expect(result.status).toBe(200);
  });
});
