/**
 * @jest-environment node
 */

import { vaccineTypeToPath } from "@src/services/content-api/constants";
import { _readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import {
  getStyledContentForVaccine,
  StyledVaccineContent,
} from "@src/services/content-api/parsers/content-styling-service";
import { VaccineTypes } from "@src/models/vaccine";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/utils/config", () => () => ({
  CONTENT_CACHE_PATH: "test-path",
}));

describe("Content API Read Integration Test ", () => {
  it("should return processed data from external cache", async () => {
    (_readContentFromCache as jest.Mock).mockResolvedValue(
      JSON.stringify(genericVaccineContentAPIResponse),
    );

    const styledVaccineContent: StyledVaccineContent =
      await getStyledContentForVaccine(VaccineTypes.RSV);

    expect(_readContentFromCache).toHaveBeenCalledWith(
      "test-path",
      `${vaccineTypeToPath[VaccineTypes.RSV]}.json`,
    );
    expect(styledVaccineContent).not.toBeNull();
    expect(styledVaccineContent.overview).toEqual(
      genericVaccineContentAPIResponse.mainEntityOfPage[0].text,
    );
    expect(styledVaccineContent.webpageLink).toEqual(
      genericVaccineContentAPIResponse.webpage,
    );
  });
});
