import { getContentForVaccine } from "@src/services/content-api/contentService";
import { getFilteredContentForVaccine } from "@src/services/content-api/contentFilterSpike";
import genericMockVaccineData from "@test-data/genericMockVaccineData";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock("@src/services/content-api/contentService");

describe("Content Filter", () => {
  describe("getPageCopyForVaccine", () => {
    it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
      const expectedOverview = {
        overview: "Generic Vaccine Lead Paragraph (overview)",
      };

      (getContentForVaccine as jest.Mock).mockResolvedValue(
        genericMockVaccineData,
      );

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedOverview),
      );
    });

    it("should return all parts for whatVaccineIsFor section", async () => {
      const expectedWhatVaccineIsFor = {
        whatVaccineIsFor: {
          headline: "Benefits Health Aspect headline",
          subsections: [
            {
              headline: "",
              name: "markdown",
              text: "<p>Benefits Health Aspect paragraph 1</p>",
            },
          ],
        },
      };

      (getContentForVaccine as jest.Mock).mockResolvedValue(
        genericMockVaccineData,
      );

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedWhatVaccineIsFor),
      );
    });

    it("should return all parts for whoVaccineIsFor section", async () => {
      const expectedWhoVaccineIsFor = {
        whoVaccineIsFor: {
          headline: "Who should have the 6-in-1 vaccine",
          subsections: [
            {
              headline: "",
              name: "markdown",
              text: "<p>Suitability Health Aspect paragraph 1</p><p>Suitability Health Aspect paragraph 2</p>",
            },
            {
              headline: "",
              name: "markdown",
              text: "<p>Suitability Health Aspect paragraph 3</p><p>Suitability Health Aspect paragraph 4</p>",
            },
            {
              headline: "",
              name: "markdown",
              text: "<p>Contraindications Health Aspect paragraph 1</p><p>Contraindications Health Aspect paragraph 2</p>",
            },
            {
              name: "Information",
              text: "<h3>Contraindications Health Aspect information heading</h3><p>Contraindications Health Aspect information paragraph</p>",
            },
          ],
        },
      };

      (getContentForVaccine as jest.Mock).mockResolvedValue(
        genericMockVaccineData,
      );

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedWhoVaccineIsFor),
      );
    });

    it("should return all parts for howToGetVaccine section", async () => {
      const expectedHowToGetVaccine = {
        howToGetVaccine: {
          headline: "Getting Access Health Aspect headline",
          subsections: [
            {
              headline: "",
              name: "markdown",
              text: "<p>Getting Access Health Aspect paragraph 1</p>",
            },
            {
              name: "non-urgent",
              text: "<h3>Getting Access Health Aspect urgent heading</h3><div>Getting Access Health Aspect urgent div</div>",
            },
          ],
        },
      };

      (getContentForVaccine as jest.Mock).mockResolvedValue(
        genericMockVaccineData,
      );
      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedHowToGetVaccine),
      );
    });

    it("should include nhs webpage link to vaccine info", async () => {
      const expectedWebpageLink = {
        webpageLink: "https://www.nhs.uk/vaccinations/generic-vaccine/",
      };

      (getContentForVaccine as jest.Mock).mockResolvedValue(
        genericMockVaccineData,
      );
      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedWebpageLink),
      );
    });
  });
});
