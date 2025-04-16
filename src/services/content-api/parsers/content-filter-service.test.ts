import {
  getFilteredContentForVaccine,
  _extractDescriptionForVaccine,
  _extractHeadlineForAspect,
  _extractPartsForAspect,
  ContentApiVaccineResponse,
} from "@src/services/content-api/parsers/content-filter-service";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";
import { VaccineTypes } from "@src/models/vaccine";

describe("Content Filter", () => {
  describe("_extractDescriptionForVaccine", () => {
    it("should return text from mainEntityOfPage object", async () => {
      const expectedOverview: string = "Generic Vaccine Lead Paragraph (overview)";

      const overview = _extractDescriptionForVaccine(
        genericVaccineContentAPIResponse,
        "lead paragraph",
      );

      expect(overview).toEqual(expectedOverview);
    });

    it("should throw error when mainEntity text is undefined", async () => {
      const responseWithoutEntityOfPage = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [{ ...genericVaccineContentAPIResponse.mainEntityOfPage, text: undefined }],
      };

      const errorMessage = () => _extractDescriptionForVaccine(
        responseWithoutEntityOfPage,
        "lead paragraph",
      )

      expect(errorMessage).toThrow("Missing text for description: lead paragraph");
    });

    it("should throw error when mainEntity text is null", async () => {
      const responseWithoutEntityOfPage = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [{ ...genericVaccineContentAPIResponse.mainEntityOfPage, text: null }],
      };

      const errorMessage = () => _extractDescriptionForVaccine(
        responseWithoutEntityOfPage,
        "lead paragraph",
      )

      expect(errorMessage).toThrow("Missing text for description: lead paragraph");
    });
  });

  describe('_extractHeadlineForAspect', () => {
    it("should extract headline from aspect", async () => {
      const expectedHeadline: string = "Getting Access Health Aspect headline";

      const headline: string = _extractHeadlineForAspect(
        genericVaccineContentAPIResponse,
        "GettingAccessHealthAspect",
      );

      expect(headline).toEqual(expectedHeadline);
    });

    it("should throw error when headline is undefined", async () => {
      const responseWithoutHeadline = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [{ ...genericVaccineContentAPIResponse.mainEntityOfPage, headline: undefined }],
      };

      const errorMessage = () => _extractHeadlineForAspect(
        responseWithoutHeadline,
        "GettingAccessHealthAspect",
      )

      expect(errorMessage).toThrow("Missing headline for Aspect: GettingAccessHealthAspect");
    });

    it("should throw error when mainEntity headline is null", async () => {
      const responseWithoutHeadline = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [{ ...genericVaccineContentAPIResponse.mainEntityOfPage, headline: null }],
      };

      const errorMessage = () => _extractHeadlineForAspect(
        responseWithoutHeadline,
        "GettingAccessHealthAspect",
      )

      expect(errorMessage).toThrow("Missing headline for Aspect: GettingAccessHealthAspect");
    });

    it("should throw error when aspect is non-existent", async () => {
      const errorMessage = () => _extractHeadlineForAspect(
        genericVaccineContentAPIResponse,
        "non-existent aspect",
      )

      expect(errorMessage).toThrow("Missing headline for Aspect: non-existent aspect");
    });
  });

  describe('_extractPartsForAspect', () => {
    it("should extract parts from aspect", async () => {
      const expectedParts: VaccinePageSubsection[] = [
        {
          headline: "",
          name: "markdown",
          text: "<p>Getting Access Health Aspect paragraph 1</p>",
        },
        {
          headline: "",
          name: "non-urgent",
          text: "<h3>Getting Access Health Aspect urgent heading</h3><div>Getting Access Health Aspect urgent div</div>",
        },
      ];

      const parts: VaccinePageSubsection[] = _extractPartsForAspect(
        genericVaccineContentAPIResponse,
        "GettingAccessHealthAspect"
      )

      expect(parts).toEqual(expectedParts);
    });

    it.skip("should throw error when subsection is non-existent", async () => {
      const responseWithoutHeadline = {
        ...genericVaccineContentAPIResponse,
        hasPart: [{name: undefined}],
      };

      const errorMessage = () => _extractPartsForAspect(responseWithoutHeadline,
        "GettingAccessHealthAspect")

      expect(errorMessage).toThrow("kjljkj");
    });
  });

  describe("getFilteredContentForVaccine", () => {
    it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
      const expectedOverview = {
        overview: "Generic Vaccine Lead Paragraph (overview)",
      };

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE, JSON.stringify(genericVaccineContentAPIResponse)
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

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE, JSON.stringify(genericVaccineContentAPIResponse)
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
              headline: "",
              name: "Information",
              text: "<h3>Contraindications Health Aspect information heading</h3><p>Contraindications Health Aspect information paragraph</p>",
            },
          ],
        },
      };

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE, JSON.stringify(genericVaccineContentAPIResponse)
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
              headline: "",
              name: "non-urgent",
              text: "<h3>Getting Access Health Aspect urgent heading</h3><div>Getting Access Health Aspect urgent div</div>",
            },
          ],
        },
      };

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE, JSON.stringify(genericVaccineContentAPIResponse)
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedHowToGetVaccine),
      );
    });

    it("should include nhs webpage link to vaccine info", async () => {
      const expectedWebpageLink = {
        webpageLink: "https://www.nhs.uk/vaccinations/generic-vaccine/",
      };

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE, JSON.stringify(genericVaccineContentAPIResponse)
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedWebpageLink),
      );
    });
  });
});
