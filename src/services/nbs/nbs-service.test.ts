import { VaccineType } from "@src/models/vaccine";
import { getSSOUrlToNBSForVaccine } from "@src/services/nbs/nbs-service";
import { generateAssertedLoginIdentityJwt } from "@src/utils/auth/generate-auth-payload";
import config from "@src/utils/config";
import { AsyncConfigMock, configBuilder } from "@test-data/config/builders";

jest.mock("@src/utils/auth/generate-auth-payload", () => ({
  generateAssertedLoginIdentityJwt: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const nbsUrlFromConfig = new URL("https://test-nbs-url.example.com/sausages");
const nbsBookingPathFromConfig = "/test/path/book";

const mockAssertedLoginIdentityJWT = "mock-jwt";

describe("getSSOUrlToNBSForVaccine", () => {
  const mockedConfig = config as AsyncConfigMock;

  describe("when NBS config is valid", () => {
    beforeEach(() => {
      const defaultConfig = configBuilder()
        .withNbsUrl(nbsUrlFromConfig)
        .andNbsBookingPath(nbsBookingPathFromConfig)
        .build();
      Object.assign(mockedConfig, defaultConfig);

      (generateAssertedLoginIdentityJwt as jest.Mock).mockReturnValue(mockAssertedLoginIdentityJWT);
    });

    it("returns sso url of NBS configured in config for RSV vaccine", async () => {
      const nbsRedirectUrl = new URL(await getSSOUrlToNBSForVaccine(VaccineType.RSV));
      expect(nbsRedirectUrl.origin).toEqual(nbsUrlFromConfig.origin);
      expect(nbsRedirectUrl.pathname).toEqual(`/sausages${nbsBookingPathFromConfig}/rsv`);
      expect(nbsRedirectUrl.href).toMatch(/^https:\/\/test-nbs-url\.example\.com\/sausages\/test\/path\/book\/rsv.*/);
    });

    it("should include campaignID query param in NBS URL", async () => {
      const nbsRedirectUrl = new URL(await getSSOUrlToNBSForVaccine(VaccineType.RSV));
      expect(nbsRedirectUrl.searchParams.get("wt.mc_id")).toEqual(expect.any(String));
    });

    it("should include assertedLoginIdentity query param in NBS URL", async () => {
      const nbsRedirectUrl = new URL(await getSSOUrlToNBSForVaccine(VaccineType.RSV));
      expect(nbsRedirectUrl.searchParams.get("assertedLoginIdentity")).toEqual(mockAssertedLoginIdentityJWT);
    });

    it("should redirect to SSO failure page if error occurs generating assertedLoginIdentity", async () => {
      (generateAssertedLoginIdentityJwt as jest.Mock).mockRejectedValue(
        new Error("Error creating SSO assertedLoginIdentity: id_token.jti attribute missing from session"),
      );

      const nbsRedirectUrl = await getSSOUrlToNBSForVaccine(VaccineType.RSV);
      expect(nbsRedirectUrl).toBe("/sso-failure");
    });
  });

  describe("Without valid config", () => {
    it("should redirect to SSO failure page if NBS Url config invalid", async () => {
      const defaultConfig = {};
      Object.assign(mockedConfig, defaultConfig);

      const nbsRedirectUrl = await getSSOUrlToNBSForVaccine(VaccineType.RSV);
      expect(nbsRedirectUrl).toBe("/sso-failure");
    });
  });
});
