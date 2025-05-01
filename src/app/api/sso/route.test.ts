import { signIn } from "@project/auth";
import { GET } from "@src/app/api/sso/route";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

jest.mock("@project/auth", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

function getMockRequest(testUrl: string, params?: Record<string, string>) {
  return {
    nextUrl: {
      searchParams: new URLSearchParams(params),
      origin: new URL(testUrl).origin,
      href: testUrl,
    },
  } as NextRequest;
}

describe("GET handler", () => {
  const ASSERTED_LOGIN_IDENTITY_PARAM = "assertedLoginIdentity";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to sso-failure if assertedLoginIdentity parameter is missing", async () => {
    const testUrl = "https://testurl";
    const mockRequest = getMockRequest(testUrl);

    await GET(mockRequest);

    expect(redirect).toHaveBeenCalledWith(
      `/sso-failure?error=Parameter not found: ${ASSERTED_LOGIN_IDENTITY_PARAM}`,
    );
  });

  it("redirects to sso-failure on signIn error", async () => {
    const testUrl = "https://testurl";
    const mockRequest = getMockRequest(testUrl, {
      assertedLoginIdentity: "test-identity",
    });

    (signIn as jest.Mock).mockRejectedValue(new Error("Sign-in failed"));

    await GET(mockRequest);

    expect(redirect).toHaveBeenCalledWith(
      `/sso-failure?error=Error: Sign-in failed`,
    );
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
});
