/**
 * @jest-environment node
 */

import { VaccineTypes } from "@src/models/vaccine";
import readContentFromCache from "@src/services/content-api/cache/reader/content-cache-reader";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-service";
import { vaccineTypeToPath } from "@src/services/content-api/constants";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("@src/services/content-api/cache/reader/content-cache-reader");
jest.mock("@src/utils/config", () => () => ({
  CONTENT_CACHE_PATH: "test-path",
}));

describe("Content service", () => {
  describe("getContentForVaccine", () => {
    it("should return response for 6-in-1 vaccine from content cache", async () => {
      (readContentFromCache as jest.Mock).mockResolvedValue(
        JSON.stringify(genericVaccineContentAPIResponse),
      );

      const vaccine = VaccineTypes.SIX_IN_ONE;
      const content = await getContentForVaccine(vaccine);
      expect(readContentFromCache).toHaveBeenCalledWith(
        "test-path",
        `${vaccineTypeToPath[vaccine]}.json`,
      );
      expect(content).toEqual(genericVaccineContentAPIResponse);
    });
  });
});
