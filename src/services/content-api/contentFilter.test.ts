import {
  extractAllPartsTextForAspect,
  extractDescriptionForAspect,
  getPageCopyForVaccine,
} from "@src/services/content-api/contentFilter";
import { VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/contentService";
import genericMockVaccineData from "@test-data/genericMockVaccineData";

jest.mock("@src/services/content-api/contentService");

describe("Content Filter", () => {
  describe("getPageCopyForVaccine", () => {
    it("should return overview text from description in vaccine content", async () => {
      const expectedOverview = {
        overview:
          "The generic vaccine helps protect against serious illnesses.",
      };
      (getContentForVaccine as jest.Mock).mockResolvedValue(
        genericMockVaccineData,
      );
      const pageCopyFor6in1 = await getPageCopyForVaccine(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedOverview),
      );
    });

    it("should return all text for what vaccine is for section", async () => {
      const expectedWhatVaccineIsFor = {
        whatVaccineIsFor:
          '<p>Benefits Health Aspect:</p><ul><li><a href="https://www.nhs.uk/conditions/diphtheria/">diphtheria</a></li></ul><p>Second paragraph Benefits Health Aspect.</p><ul><li>Some list</li></ul>',
      };
      (getContentForVaccine as jest.Mock).mockResolvedValue(
        genericMockVaccineData,
      );
      const pageCopyFor6in1 = await getPageCopyForVaccine(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedWhatVaccineIsFor),
      );
    });
  });

  describe("extractAllPartsTextForAspect", () => {
    it("should concatenate multiple hasParts text into a single string", () => {
      const expectedConcatenatedPartsText =
        '<p>Benefits Health Aspect:</p><ul><li><a href="https://www.nhs.uk/conditions/diphtheria/">diphtheria</a></li></ul><p>Second paragraph Benefits Health Aspect.</p><ul><li>Some list</li></ul>';

      const allPartsText = extractAllPartsTextForAspect(
        genericMockVaccineData,
        "BenefitsHealthAspect",
      );

      expect(allPartsText).toEqual(expectedConcatenatedPartsText);
    });
  });

  describe("extractDescriptionForAspect", () => {
    it("should return description field from aspect contentApi text", () => {
      const expectedDescription =
        "The generic vaccine helps protect against serious illnesses.";

      const extractedDescription = extractDescriptionForAspect(
        genericMockVaccineData,
        "OverviewHealthAspect",
      );

      expect(extractedDescription).toEqual(expectedDescription);
    });
  });
});
