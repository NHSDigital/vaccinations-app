import { CONTENT_API_PATH_PREFIX, fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import lazyConfig from "@src/utils/lazy-config";
import { AsyncConfigMock, lazyConfigBuilder } from "@test-data/config/builders";
import axios from "axios";

jest.mock("axios");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("fetchContentForVaccine", () => {
  const testApiKey: string = "test-key";
  const testApiEndpoint: URL = new URL("https://test-endpoint/");
  const testApiContent = { test: "content" };
  const mockedConfig = lazyConfig as AsyncConfigMock;

  beforeEach(() => {
    const defaultConfig = lazyConfigBuilder()
      .withContentApiKey(testApiKey)
      .andContentApiEndpoint(testApiEndpoint)
      .build();
    Object.assign(mockedConfig, defaultConfig);
  });

  it("should fetch content for vaccine", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: testApiContent });
    const actual = await fetchContentForVaccine(VaccineType.RSV);
    expect(axios.get).toHaveBeenCalledWith(
      `${testApiEndpoint}${CONTENT_API_PATH_PREFIX}${VaccineInfo[VaccineType.RSV].contentPath}`,
      { headers: { accept: "application/json", apikey: testApiKey }, timeout: 30000 },
    );
    expect(actual).toBe(JSON.stringify(testApiContent));
  });

  it("should throw an error if axios fails", async () => {
    const errorMessage = "Network Error";
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(fetchContentForVaccine(VaccineType.RSV)).rejects.toThrow(errorMessage);
  });
});
