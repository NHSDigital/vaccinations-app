import { CONTENT_API_PATH_PREFIX, fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { VaccineTypes } from "@src/models/vaccine";
import { vaccineTypeToPath } from "@src/services/content-api/constants";
import { AppConfig, configProvider } from "@src/utils/config";
import axios from "axios";

jest.mock("@src/utils/config");
jest.mock("axios");

describe("fetchContentForVaccine", () => {
  const testApiKey: string = "test-key";
  const testApiEndpoint: URL = new URL("https://test-endpoint/");
  const testApiContent = { test: "content" };

  beforeEach(() => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        CONTENT_CACHE_PATH: "",
        CONTENT_API_KEY: testApiKey,
        CONTENT_API_ENDPOINT: testApiEndpoint,
      }),
    );
  });

  it("should fetch content for vaccine", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: testApiContent });
    const actual = await fetchContentForVaccine(VaccineTypes.RSV);
    expect(axios.get).toHaveBeenCalledWith(`${testApiEndpoint}${CONTENT_API_PATH_PREFIX}${vaccineTypeToPath.RSV}`, {
      headers: {
        accept: "application/json",
        apikey: testApiKey,
      },
      timeout: 30000,
    });
    expect(actual).toBe(JSON.stringify(testApiContent));
  });

  it("should throw an error if axios fails", async () => {
    const errorMessage = "Network Error";
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(fetchContentForVaccine(VaccineTypes.RSV)).rejects.toThrow(errorMessage);
  });
});
