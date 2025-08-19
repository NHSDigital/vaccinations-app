import { VaccineTypes } from "@src/models/vaccine";
import { getSSOUrlToNBSForVaccine } from "@src/services/nbs/nbs-service";
import { generateAssertedLoginIdentityJwt } from "@src/utils/auth/generate-auth-payload";
import { AppConfig, configProvider } from "@src/utils/config";

jest.mock("@src/utils/config");
jest.mock("@src/utils/auth/generate-auth-payload", () => ({
  generateAssertedLoginIdentityJwt: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const nbsUrlFromConfig = "https://test-nbs-url";
const nbsBookingPathFromConfig = "/test/path/book";

const mockAssertedLoginIdentityJWT = "mock-jwt";

describe("getSSOUrlToNBSForVaccine", () => {
  beforeEach(() => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        NBS_URL: nbsUrlFromConfig,
        NBS_BOOKING_PATH: nbsBookingPathFromConfig,
      }),
    );

    (generateAssertedLoginIdentityJwt as jest.Mock).mockReturnValue(mockAssertedLoginIdentityJWT);
  });

  it("returns sso url of NBS configured in config for RSV vaccine", async () => {
    const nbsRedirectUrl = new URL(await getSSOUrlToNBSForVaccine(VaccineTypes.RSV));
    expect(nbsRedirectUrl.origin).toEqual(nbsUrlFromConfig);
    expect(nbsRedirectUrl.pathname).toEqual(`${nbsBookingPathFromConfig}/rsv`);
  });

  it("should include campaignID query param in NBS URL", async () => {
    const nbsRedirectUrl = new URL(await getSSOUrlToNBSForVaccine(VaccineTypes.RSV));
    expect(nbsRedirectUrl.searchParams.get("wt.mc_id")).toEqual(expect.any(String));
  });

  it("should include assertedLoginIdentity query param in NBS URL", async () => {
    const nbsRedirectUrl = new URL(await getSSOUrlToNBSForVaccine(VaccineTypes.RSV));
    expect(nbsRedirectUrl.searchParams.get("assertedLoginIdentity")).toEqual(mockAssertedLoginIdentityJWT);
  });

  it("should redirect to SSO failure page if error occurs generating assertedLoginIdentity", async () => {
    (generateAssertedLoginIdentityJwt as jest.Mock).mockRejectedValue(
      new Error("Error creating SSO assertedLoginIdentity: id_token.jti attribute missing from session"),
    );

    const nbsRedirectUrl = await getSSOUrlToNBSForVaccine(VaccineTypes.RSV);
    expect(nbsRedirectUrl).toBe("/sso-failure");
  });

  it("should redirect to SSO failure page if NBS Url config invalid", async () => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        NBS_URL: "not-a-valid-url",
        NBS_BOOKING_PATH: nbsBookingPathFromConfig,
      }),
    );

    const nbsRedirectUrl = await getSSOUrlToNBSForVaccine(VaccineTypes.RSV);
    expect(nbsRedirectUrl).toBe("/sso-failure");
  });
});
