import {
  getFilteredContentForVaccine,
  _extractDescriptionForVaccine,
  _extractHeadlineForAspect,
  _extractPartsForAspect,
  _findAspect,
  _hasHealthAspect,
  _extractHeadlineForContraindicationsAspect,
} from "@src/services/content-api/parsers/content-filter-service";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";
import { VaccineTypes } from "@src/models/vaccine";
import { contentWithoutBenefitsHealthAspect } from "@test-data/content-api/helpers";
import {
  ContentApiVaccineResponse,
  MainEntityOfPage,
  VaccinePageContent,
  VaccinePageSubsection,
} from "@src/services/content-api/types";

describe("Content Filter", () => {
  describe("_extractDescriptionForVaccine", () => {
    it("should return text from mainEntityOfPage object", async () => {
      const expectedOverview: string =
        "Generic Vaccine Lead Paragraph (overview)";

      const overview = _extractDescriptionForVaccine(
        genericVaccineContentAPIResponse,
        "lead paragraph",
      );

      expect(overview).toEqual(expectedOverview);
    });

    it("should throw error when mainEntity text is undefined", async () => {
      const responseWithoutEntityOfPage = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[0],
            text: undefined,
          },
        ],
      };

      const errorMessage = () =>
        _extractDescriptionForVaccine(
          responseWithoutEntityOfPage,
          "lead paragraph",
        );

      expect(errorMessage).toThrow(
        "Missing text for description: lead paragraph",
      );
    });
  });

  describe("_extractHeadlineForAspect", () => {
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
        mainEntityOfPage: [
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[1],
            headline: undefined,
          },
        ],
      };

      const errorMessage = () =>
        _extractHeadlineForAspect(
          responseWithoutHeadline,
          "BenefitsHealthAspect",
        );

      expect(errorMessage).toThrow(
        "Missing headline for Aspect: BenefitsHealthAspect",
      );
    });
  });

  describe("_extractPartsForAspect", () => {
    it("should extract parts from aspect", async () => {
      const expectedParts: VaccinePageSubsection[] = [
        {
          type: "simpleElement",
          headline: "",
          name: "markdown",
          text: "<p>Benefits Health Aspect paragraph 1</p>",
        },
      ];

      const parts: VaccinePageSubsection[] = _extractPartsForAspect(
        genericVaccineContentAPIResponse,
        "BenefitsHealthAspect",
      );

      expect(parts).toEqual(expectedParts);
    });

    it("should throw an error when subsections are undefined", async () => {
      const aspect = "BenefitsHealthAspect";
      const responseWithoutParts: ContentApiVaccineResponse = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[0],
          },
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[1],
            hasPart: undefined,
          },
        ],
      };

      const errorMessage = () => {
        _extractPartsForAspect(responseWithoutParts, aspect);
      };

      expect(errorMessage).toThrow(`Missing subsections for Aspect: ${aspect}`);
    });
  });

  describe("_findAspect", () => {
    it("should find an aspect", () => {
      const expectedAspect: MainEntityOfPage = {
        ...genericVaccineContentAPIResponse.mainEntityOfPage[1],
      };
      const aspect: MainEntityOfPage = _findAspect(
        genericVaccineContentAPIResponse,
        "BenefitsHealthAspect",
      );

      expect(aspect).toEqual(expectedAspect);
    });

    it("should throw an error when subsections are undefined", async () => {
      const aspect = "BenefitsHealthAspect";
      const responseWithoutAboveAspect: ContentApiVaccineResponse = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[0],
          },
        ],
      };

      const errorMessage = () => {
        _findAspect(responseWithoutAboveAspect, aspect);
      };

      expect(errorMessage).toThrow(`Aspect ${aspect} is not present`);
    });
  });

  describe("_hasHealthAspect", () => {
    it("should return true if healthAspect exists in content", () => {
      const hasHealthAspect = _hasHealthAspect(
        genericVaccineContentAPIResponse,
        "BenefitsHealthAspect",
      );
      expect(hasHealthAspect).toBeTruthy();
    });

    it("should return false if healthAspect does not exist in content", () => {
      const responseWithoutBenefitsHealthAspect =
        contentWithoutBenefitsHealthAspect();

      const hasHealthAspect = _hasHealthAspect(
        responseWithoutBenefitsHealthAspect,
        "BenefitsHealthAspect",
      );
      expect(hasHealthAspect).toBeFalsy();
    });
  });

  describe("_extractHeadlineForContraindicationsAspect", () => {
    it("extracts headline for contraindications aspects", () => {
      const expected: VaccinePageSubsection[] = [
        {
          headline: "Contraindications Health Aspect headline",
          name: "",
          text: "",
          type: "simpleElement",
        },
      ];

      const headline: VaccinePageSubsection[] =
        _extractHeadlineForContraindicationsAspect(
          genericVaccineContentAPIResponse,
        );

      expect(headline).toEqual(expected);
    });
  });

  describe("getFilteredContentForVaccine", () => {
    it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
      const expectedOverview = {
        overview: "Generic Vaccine Lead Paragraph (overview)",
      };

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE,
        JSON.stringify(genericVaccineContentAPIResponse),
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
              type: "simpleElement",
              headline: "",
              name: "markdown",
              text: "<p>Benefits Health Aspect paragraph 1</p>",
            },
          ],
        },
      };

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE,
        JSON.stringify(genericVaccineContentAPIResponse),
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
              type: "simpleElement",
              headline: "",
              name: "markdown",
              text: "<p>Suitability Health Aspect paragraph 1</p><p>Suitability Health Aspect paragraph 2</p>",
            },
            {
              type: "simpleElement",
              headline: "",
              name: "markdown",
              text: "<p>Suitability Health Aspect paragraph 3</p><p>Suitability Health Aspect paragraph 4</p>",
            },
            {
              type: "simpleElement",
              headline: "Contraindications Health Aspect headline",
              name: "",
              text: "",
            },
            {
              type: "simpleElement",
              headline: "",
              name: "markdown",
              text: "<p>Contraindications Health Aspect paragraph 1</p><p>Contraindications Health Aspect paragraph 2</p>",
            },
            {
              type: "simpleElement",
              headline: "",
              name: "Information",
              text: "<h3>Contraindications Health Aspect information heading</h3><p>Contraindications Health Aspect information paragraph</p>",
            },
          ],
        },
      };

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE,
        JSON.stringify(genericVaccineContentAPIResponse),
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
              type: "simpleElement",
              headline: "",
              name: "markdown",
              text: "<p>Getting Access Health Aspect paragraph 1</p>",
            },
            {
              type: "simpleElement",
              headline: "",
              name: "non-urgent",
              text: "<h3>Getting Access Health Aspect urgent heading</h3><div>Getting Access Health Aspect urgent div</div>",
            },
          ],
        },
      };

      const pageCopyFor6in1 = await getFilteredContentForVaccine(
        VaccineTypes.SIX_IN_ONE,
        JSON.stringify(genericVaccineContentAPIResponse),
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
        VaccineTypes.SIX_IN_ONE,
        JSON.stringify(genericVaccineContentAPIResponse),
      );

      expect(pageCopyFor6in1).toEqual(
        expect.objectContaining(expectedWebpageLink),
      );
    });

    it("should not return whatVaccineIsFor section when BenefitsHealthAspect is missing", async () => {
      const responseWithoutBenefitsHealthAspect =
        contentWithoutBenefitsHealthAspect();

      const pageCopyForFlu: VaccinePageContent =
        await getFilteredContentForVaccine(
          VaccineTypes.FLU,
          JSON.stringify(responseWithoutBenefitsHealthAspect),
        );

      expect(pageCopyForFlu.whatVaccineIsFor).toBeUndefined();
    });
  });
});
