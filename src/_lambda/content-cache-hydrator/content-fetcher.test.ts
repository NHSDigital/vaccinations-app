import {
  CONTENT_API_PATH_PREFIX,
  fetchContentForVaccine,
} from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { VaccineTypes } from "@src/models/vaccine";
import { vaccineTypeToPath } from "@src/services/content-api/constants";
import { AppConfig, configProvider } from "@src/utils/config";
import axios from "axios";

jest.mock("@src/utils/config");
jest.mock("axios");

describe("fetchContentForVaccine", () => {
  const testApiKey: string = "test-key";
  const testApiEndpoint: string = "https://test-endpoint/";
  const testApiContent = { test: "content" };

  beforeEach(() => {
    (configProvider as jest.Mock).mockImplementation(
      (): AppConfig => ({
        CONTENT_CACHE_PATH: "",
        CONTENT_API_KEY: testApiKey,
        CONTENT_API_ENDPOINT: testApiEndpoint,
      }),
    );
  });

  it("should fetch content for vaccine", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: testApiContent });
    const actual = await fetchContentForVaccine(VaccineTypes.SIX_IN_ONE);
    expect(axios.get).toHaveBeenCalledWith(
      `${testApiEndpoint}${CONTENT_API_PATH_PREFIX}${vaccineTypeToPath.SIX_IN_ONE}`,
      {
        headers: {
          accept: "application/json",
          apikey: testApiKey,
        },
      },
    );
    expect(actual).toBe(JSON.stringify(testApiContent));
  });

  it("should throw an error if axios fails", async () => {
    const errorMessage = "Network Error";
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(
      fetchContentForVaccine(VaccineTypes.SIX_IN_ONE),
    ).rejects.toThrow(errorMessage);
  });
});
