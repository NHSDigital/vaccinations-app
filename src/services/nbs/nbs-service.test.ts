import { AppConfig, configProvider } from "@src/utils/config";
import { getNBSBookingUrlForVaccine } from "@src/services/nbs/nbs-service";
import { VaccineTypes } from "@src/models/vaccine";
import { generateAssertedLoginIdentityJwt } from "@src/utils/auth/generate-auth-payload";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@src/utils/config");
jest.mock("@src/utils/auth/generate-auth-payload");

const nbsUrlFromConfig = "https://test-nbs-url";
const nbsBookingPathFromConfig = "/test/path/book";

const mockAssertedLoginIdentityJWT = "mock-jwt";

describe("getNBSLinkWithSSOForVaccine", () => {});

describe("getNBSUrl", () => {
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

  it("should return the url of NBS configured in config for RSV vaccine", async () => {
    const nbsUrl: URL = await getNBSBookingUrlForVaccine(VaccineTypes.RSV);

    expect(nbsUrl.origin).toEqual(nbsUrlFromConfig);
    expect(nbsUrl.pathname).toEqual(`${nbsBookingPathFromConfig}/rsv`);
  });

  it("should include campaignID query param in NBS URL", async () => {
    const nbsUrl: URL = await getNBSBookingUrlForVaccine(VaccineTypes.RSV);

    expect(nbsUrl.searchParams.get("wt.mc_id")).toEqual(expect.any(String));
  });

  it("should include assertedLoginIdentity query param in NBS URL", async () => {
    const nbsUrl: URL = await getNBSBookingUrlForVaccine(VaccineTypes.RSV);

    expect(nbsUrl.searchParams.get("assertedLoginIdentity")).toEqual(
      mockAssertedLoginIdentityJWT,
    );
  });
});
