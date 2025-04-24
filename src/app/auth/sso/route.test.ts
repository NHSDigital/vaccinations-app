/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from "next/server";
import { GET } from "@src/app/auth/sso/route";
import { getAuthConfig } from "@src/utils/auth/get-auth-config";
import { getClientConfig } from "@src/utils/auth/get-client-config";
import * as client from "openid-client";

jest.mock("@src/utils/auth/get-auth-config");
jest.mock("@src/utils/auth/get-client-config");
jest.mock("openid-client", () => {
  return {
    buildAuthorizationUrl: jest.fn(),
    randomState: jest.fn(() => "randomState"),
  };
});

jest.mock("next/server", () => {
  const actualNextServer = jest.requireActual("next/server");
  return {
    ...actualNextServer,
    NextResponse: {
      json: actualNextServer.NextResponse.json,
      redirect: jest.fn(),
    },
  };
});

const mockNhsLoginUrl = "https://nhs-login-url";
const mockNhsLoginClientId = "vita-client-id";
const mockNhsLoginScope = "openid profile";
const mockRedirectUrl = "https://redirect/url";

const mockAuthConfig = {
  url: mockNhsLoginUrl,
  client_id: mockNhsLoginClientId,
  scope: mockNhsLoginScope,
  redirect_uri: mockRedirectUrl,
};

const mockClientConfig = {} as jest.Mock;

(getAuthConfig as jest.Mock).mockImplementation(() => mockAuthConfig);
(getClientConfig as jest.Mock).mockImplementation(() => mockClientConfig);

describe("SSO route", () => {
  let mockBuildAuthorizationUrl: jest.Mock;
  let nextResponseRedirect: jest.Mock;

  beforeEach(() => {
    mockBuildAuthorizationUrl = client.buildAuthorizationUrl as jest.Mock;
    nextResponseRedirect = NextResponse.redirect as jest.Mock;
  });

  describe("GET endpoint", () => {
    it.skip("passes assertedLoginIdentity JWT on to redirect url", async () => {
      const mockAssertedLoginJWT = "asserted-login-jwt-value";
      const inboundUrlWithAssertedParam = new URL("https://test-inbound-url");
      inboundUrlWithAssertedParam.searchParams.append(
        "assertedLoginIdentity",
        mockAssertedLoginJWT,
      );
      const mockClientBuiltAuthUrl = new URL("https://nhs-login-url");
      mockBuildAuthorizationUrl.mockReturnValue(mockClientBuiltAuthUrl);
      const request = new NextRequest(inboundUrlWithAssertedParam);

      await GET(request);

      expect(nextResponseRedirect).toHaveBeenCalledTimes(1);
      const redirectedUrl = nextResponseRedirect.mock.lastCall[0];
      const searchParams = redirectedUrl.searchParams;
      expect(searchParams.get("asserted_login_identity")).toEqual(
        mockAssertedLoginJWT,
      );
    });

    it.skip("redirects the user to NHS Login with expected query params", async () => {
      const mockAssertedLoginJWT = "asserted-login-jwt-value";
      const inboundUrlWithAssertedParam = new URL("https://test-inbound-url");
      inboundUrlWithAssertedParam.searchParams.append(
        "assertedLoginIdentity",
        mockAssertedLoginJWT,
      );
      const mockClientBuiltAuthUrl = new URL("https://nhs-login-url/authorize");
      mockBuildAuthorizationUrl.mockReturnValue(mockClientBuiltAuthUrl);
      const request = new NextRequest(inboundUrlWithAssertedParam);

      await GET(request);

      expect(nextResponseRedirect).toHaveBeenCalledTimes(1);
      const redirectedUrl: URL = nextResponseRedirect.mock.lastCall[0];
      console.log(redirectedUrl);
      expect(redirectedUrl.origin).toBe(mockAuthConfig.url);
      expect(redirectedUrl.pathname).toBe("/authorize");
      const searchParams = redirectedUrl.searchParams;
      expect(searchParams.get("asserted_login_identity")).toEqual(
        mockAssertedLoginJWT,
      );
      expect(searchParams.get("scope")).toEqual("openid%20profile");
      expect(searchParams.get("client_id")).toEqual(mockAuthConfig.client_id);
      expect(searchParams.get("redirect_uri")).toEqual(
        `${mockAuthConfig.url}/auth/callback`,
      );
      expect(searchParams.get("state")).toBeDefined();
      expect(searchParams.get("nonce")).toBeDefined();
      expect(searchParams.get("prompt")).toEqual("none");
    });

    it("should fail if assertedLoginIdentity query parameter not provided", async () => {
      const urlWithoutAssertedParam = new URL("https://testurl");

      const request = new NextRequest(urlWithoutAssertedParam);

      const response = await GET(request);
      expect(response.status).toBe(400);
    });

    it("should fail if assertedLoginIdentity query parameter is empty", async () => {
      const urlWithEmptyAssertedParam = new URL("https://testurl");
      urlWithEmptyAssertedParam.searchParams.append(
        "assertedLoginIdentity",
        "",
      );

      const request = new NextRequest(urlWithEmptyAssertedParam);

      const response = await GET(request);
      expect(response.status).toBe(400);
    });
  });
});
