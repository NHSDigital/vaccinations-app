import { AppConfig, configProvider } from "@src/utils/config";
import { redirectToNBSBookingPageForVaccine } from "@src/services/nbs/nbs-service";
import { VaccineTypes } from "@src/models/vaccine";
import { generateAssertedLoginIdentityJwt } from "@src/utils/auth/generate-auth-payload";
import { redirect } from "next/navigation";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@src/utils/config");
jest.mock("@src/utils/auth/generate-auth-payload");
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const nbsUrlFromConfig = "https://test-nbs-url";
const nbsBookingPathFromConfig = "/test/path/book";

const mockAssertedLoginIdentityJWT = "mock-jwt";

describe("redirectToNBSBookingPageForVaccine", () => {
  beforeEach(() => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        NBS_URL: nbsUrlFromConfig,
        NBS_BOOKING_PATH: nbsBookingPathFromConfig,
      }),
    );

    (generateAssertedLoginIdentityJwt as jest.Mock).mockReturnValue(
      mockAssertedLoginIdentityJWT,
    );
  });

  it("should redirect to the url of NBS configured in config for RSV vaccine", async () => {
    await redirectToNBSBookingPageForVaccine(VaccineTypes.RSV);

    expect(redirect).toHaveBeenCalled();
    const redirectCallArgs = (redirect as unknown as jest.Mock).mock
      .calls[0][0];
    const nbsRedirectUrl = new URL(redirectCallArgs);
    expect(nbsRedirectUrl.origin).toEqual(nbsUrlFromConfig);
    expect(nbsRedirectUrl.pathname).toEqual(`${nbsBookingPathFromConfig}/rsv`);
  });

  it("should include campaignID query param in NBS URL", async () => {
    await redirectToNBSBookingPageForVaccine(VaccineTypes.RSV);

    const redirectCallArgs = (redirect as unknown as jest.Mock).mock
      .calls[0][0];
    const nbsRedirectUrl = new URL(redirectCallArgs);
    expect(nbsRedirectUrl.searchParams.get("wt.mc_id")).toEqual(
      expect.any(String),
    );
  });

  it("should include assertedLoginIdentity query param in NBS URL", async () => {
    await redirectToNBSBookingPageForVaccine(VaccineTypes.RSV);

    const redirectCallArgs = (redirect as unknown as jest.Mock).mock
      .calls[0][0];
    const nbsRedirectUrl = new URL(redirectCallArgs);
    expect(nbsRedirectUrl.searchParams.get("assertedLoginIdentity")).toEqual(
      mockAssertedLoginIdentityJWT,
    );
  });

  it("should redirect to SSO failure page if error occurs generating assertedLoginIdentity", async () => {
    (generateAssertedLoginIdentityJwt as jest.Mock).mockRejectedValue(
      new Error(
        "Error creating SSO assertedLoginIdentity: id_token.jti attribute missing from session",
      ),
    );

    await redirectToNBSBookingPageForVaccine(VaccineTypes.RSV);

    expect(redirect).toHaveBeenCalledWith("/sso-failure");
  });

  it("should redirect to SSO failure page if NBS Url config invalid", async () => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        NBS_URL: "not-a-valid-url",
        NBS_BOOKING_PATH: nbsBookingPathFromConfig,
      }),
    );

    await redirectToNBSBookingPageForVaccine(VaccineTypes.RSV);

    expect(redirect).toHaveBeenCalledWith("/sso-failure");
  });
});
