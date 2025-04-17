/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "@src/app/auth/sso/route";
import { configProvider } from "@src/utils/config";

jest.mock("@src/utils/config");

const mockNhsLoginUrl = "nhs-login/url";
const mockNhsLoginScope = "openid profile";
const mockNhsLoginClientId = "vita-client-id";
const mockVaccinationAppUrl = "vita-base-url";

(configProvider as jest.Mock).mockImplementation(() => ({
  NHS_LOGIN_URL: mockNhsLoginUrl,
  NHS_LOGIN_CLIENT_ID: mockNhsLoginClientId,
  NHS_LOGIN_SCOPE: mockNhsLoginScope,
  VACCINATION_APP_URL: mockVaccinationAppUrl,
}));

describe("SSO route", () => {
  describe("GET endpoint", () => {
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
