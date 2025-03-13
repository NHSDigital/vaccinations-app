import {
  extractAllPartsTextForAspect,
  extractDescriptionForAspect,
  generateWhoVaccineIsForHeading,
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

    it("should return all text for whatVaccineIsFor section", async () => {
      const expectedWhatVaccineIsFor = {
        whatVaccineIsFor: {
          heading: "What the generic vaccine is for",
          bodyText:
            '<p>Benefits Health Aspect:</p><ul><li><a href="https://www.nhs.uk/conditions/diphtheria/">diphtheria</a></li></ul><p>Second paragraph Benefits Health Aspect.</p><ul><li>Some list</li></ul>',
        },
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

    it("should include both Suitability and Contraindications text in whoItIsFor section", async () => {
      const expectedWhoVaccineIsFor = {
        whoVaccineIsFor: {
          heading: "Who should have the 6-in-1 vaccine",
          bodyText:
            '<p>Suitability text part 1 <a href="https://www.nhs.uk/vaccinations/nhs-vaccinations-and-when-to-have-them/">NHS vaccination schedule</a>.</p><p>Suitability text part 2</p><p>Contraindications text part 1</p><ul><li>Contraindication list 1</li><li>Contraindication list 2</li></ul><h3>Contraindication text part 2 Header</h3><p>Contraindications text part 2 paragraph</p>',
        },
      };
      (getContentForVaccine as jest.Mock).mockResolvedValue(
        genericMockVaccineData,
      );
      const pageCopyFor6in1 = await getPageCopyForVaccine(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedWhoVaccineIsFor),
      );
    });

    it("should include howToGetVaccine section", async () => {
      const expectedHowToGet = {
        howToGetVaccine: {
          heading: "How to get the generic vaccine",
          bodyText:
            "<p>How to get part 1</p><p>Second paragraph</p><ul>\n<li>\n  how to get part 2 bullet 1 \n </li>\n<li>\n  how to get part 2 bullet 2\n </li>\n<li>\n  how to get part 2 bullet 3\n </li></ul>\n<p>\n How to get part 2 paragraph 2.\n</p>\n",
        },
      };
      (getContentForVaccine as jest.Mock).mockResolvedValue(
        genericMockVaccineData,
      );
      const pageCopyFor6in1 = await getPageCopyForVaccine(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedHowToGet),
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

  describe("generateWhoVaccineIsForHeading", () => {
    it("should return string containing the vaccine name", () => {
      const whoVaccineIsForHeading = generateWhoVaccineIsForHeading(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(whoVaccineIsForHeading).toEqual(
        "Who should have the 6-in-1 vaccine",
      );
    });
  });
});
