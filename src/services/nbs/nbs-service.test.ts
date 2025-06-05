import { AppConfig, configProvider } from "@src/utils/config";
import { getNBSBookingUrlForVaccine } from "@src/services/nbs/nbs-service";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock("@src/utils/config");

const nbsUrlFromConfig = "https://test-nbs-url";
const nbsBookingPathFromConfig = "/test/path/book";

describe("getNBSLinkWithSSOForVaccine", () => {});

describe("getNBSUrl", () => {
  beforeEach(() => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        NBS_URL: nbsUrlFromConfig,
        NBS_BOOKING_PATH: nbsBookingPathFromConfig,
      }),
    );
  });

  it("should return the url of NBS configured in config for RSV vaccine", async () => {
    const nbsUrl: URL = await getNBSBookingUrlForVaccine(VaccineTypes.RSV);

    expect(nbsUrl.origin).toEqual(nbsUrlFromConfig);
    expect(nbsUrl.pathname).toEqual(`${nbsBookingPathFromConfig}/rsv`);
  });
});
