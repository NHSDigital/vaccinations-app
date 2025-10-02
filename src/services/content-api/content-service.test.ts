import mockRsvVaccineJson from "@project/wiremock/__files/rsv-vaccine.json";
import { VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import { InvalidatedCacheError, S3NoSuchKeyError } from "@src/services/content-api/gateway/exceptions";
import { ContentErrorTypes, GetContentForVaccineResponse } from "@src/services/content-api/types";
import lazyConfig from "@src/utils/lazy-config";
import { AsyncConfigMock, lazyConfigBuilder } from "@test-data/config/builders";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/utils/lazy-config");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("getContentForVaccine()", () => {
  const mockedConfig = lazyConfig as AsyncConfigMock;

  describe("when readContent succeeds", () => {
    beforeEach(() => {
      const defaultConfig = lazyConfigBuilder().withContentCachePath("wiremock/__files/").build();
      Object.assign(mockedConfig, defaultConfig);
    });

    it("should return response for rsv vaccine from content cache", async () => {
      (readContentFromCache as jest.Mock).mockImplementation(() => {
        return JSON.stringify(mockRsvVaccineJson);
      });
      const vaccine: VaccineTypes = VaccineTypes.RSV;
      const { styledVaccineContent, contentError }: GetContentForVaccineResponse = await getContentForVaccine(vaccine);

      expect(styledVaccineContent).toBeDefined();
      expect(styledVaccineContent?.overview).toEqual(mockRsvVaccineJson.mainEntityOfPage[0].text);
      expect(styledVaccineContent?.whatVaccineIsFor?.heading).toEqual(mockRsvVaccineJson.mainEntityOfPage[1].headline);
      expect(styledVaccineContent?.webpageLink.href).toEqual(mockRsvVaccineJson.webpage);
      expect(contentError).toBeUndefined();
    });
  });

  describe("when readContent fails", () => {
    it("should return content error response if content read fails", async () => {
      (readContentFromCache as jest.Mock).mockRejectedValue(new S3NoSuchKeyError("s3 error"));

      const { styledVaccineContent, contentError } = await getContentForVaccine(VaccineTypes.RSV);

      expect(contentError).toEqual(ContentErrorTypes.CONTENT_LOADING_ERROR);
      expect(styledVaccineContent).toBeUndefined();
    });

    it("should return content error response if cache invalidated", async () => {
      (readContentFromCache as jest.Mock).mockRejectedValue(new InvalidatedCacheError("invalidated cache"));

      const { styledVaccineContent, contentError } = await getContentForVaccine(VaccineTypes.RSV);

      expect(contentError).toEqual(ContentErrorTypes.CONTENT_LOADING_ERROR);
      expect(styledVaccineContent).toBeUndefined();
    });
  });
});
