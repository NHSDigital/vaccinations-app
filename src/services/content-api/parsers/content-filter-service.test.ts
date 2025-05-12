import {
  getFilteredContentForVaccine,
  _extractDescriptionForVaccine,
  _extractHeadlineForAspect,
  _extractPartsForAspect,
  _findAspect,
  _hasHealthAspect,
  _extractHeadlineForContraindicationsAspect,
  _removeExcludedHyperlinks,
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

    it("should extract and flatten nested expanders from expander groups", () => {
      const expanderGroupPart = {
        position: 1,
        name: "Expander Group",
        identifier: "20",
        "@type": "",
        mainEntity: [
          {
            "@type": "Type",
            position: 0,
            name: "Expander",
            subjectOf: "First Expander subjectOf",
            identifier: "18",
            mainEntity: "<div>First Expander mainEntity</div>",
          },
          {
            "@type": "Type",
            position: 1,
            name: "Expander",
            subjectOf: "Second Expander subjectOf",
            identifier: "18",
            mainEntity: "<div>Second Expander mainEntity</div>",
          },
        ],
      };

      const responseWithExpanderGroup: ContentApiVaccineResponse = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[2],
            hasPart: [expanderGroupPart],
          },
        ],
      };

      const expectedParts: VaccinePageSubsection[] = [
        {
          type: "expanderElement",
          headline: "First Expander subjectOf",
          name: "Expander",
          mainEntity: "<div>First Expander mainEntity</div>",
        },
        {
          type: "expanderElement",
          headline: "Second Expander subjectOf",
          name: "Expander",
          mainEntity: "<div>Second Expander mainEntity</div>",
        },
      ];

      const aspect = "SuitabilityHealthAspect";

      const parts = _extractPartsForAspect(responseWithExpanderGroup, aspect);

      expect(parts).toEqual(expectedParts);
    });

    it("should throw if table is missing required mainEntity property", () => {
      const responseWithInvalidTable: ContentApiVaccineResponse = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[2],
            hasPart: [
              {
                "@type": "WebPageElement",
                name: "Table",
                position: 1,
              },
            ],
          },
        ],
      };

      const aspect = "SuitabilityHealthAspect";

      const errorMessage = () => {
        _extractPartsForAspect(responseWithInvalidTable, aspect);
      };

      expect(errorMessage).toThrow(
        `mainEntity missing or is not a string in Table (position: 1)`,
      );
    });

    it("should throw if table mainEntity property is not a string", () => {
      const responseWithTableMainEntityNotAString: ContentApiVaccineResponse = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[2],
            hasPart: [
              {
                "@type": "WebPageElement",
                name: "Table",
                position: 9,
                mainEntity: [
                  {
                    "@type": "invalid-element",
                    position: 4,
                    name: "invalid-element",
                    subjectOf: "invalid-element",
                    identifier: "5",
                    mainEntity: "invalid-element",
                  },
                ],
              },
            ],
          },
        ],
      };

      const aspect = "SuitabilityHealthAspect";

      const errorMessage = () => {
        _extractPartsForAspect(responseWithTableMainEntityNotAString, aspect);
      };

      expect(errorMessage).toThrow(
        `mainEntity missing or is not a string in Table (position: 9)`,
      );
    });

    it("should throw an error if expander group mainEntity does not contain an array of expanders", async () => {
      const responseWithInvalidExpanderGroup: ContentApiVaccineResponse = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[2],
            hasPart: [
              {
                position: 1,
                name: "Expander Group",
                identifier: "20",
                "@type": "",
                mainEntity: "invalid-string",
              },
            ],
          },
        ],
      };

      const aspect = "SuitabilityHealthAspect";

      const errorMessage = () => {
        _extractPartsForAspect(responseWithInvalidExpanderGroup, aspect);
      };

      expect(errorMessage).toThrow(
        `Expander Group mainEntity does not contain list of expanders for Aspect: ${aspect}`,
      );
    });

    it("should throw if expander is missing mainEntity field", () => {
      const responseExpanderWithoutMainEntityField: ContentApiVaccineResponse =
        {
          ...genericVaccineContentAPIResponse,
          mainEntityOfPage: [
            {
              ...genericVaccineContentAPIResponse.mainEntityOfPage[2],
              hasPart: [
                {
                  "@type": "Type",
                  position: 4,
                  name: "Expander",
                  subjectOf: "First Expander subjectOf",
                  identifier: "18",
                },
              ],
            },
          ],
        };
      const aspect = "SuitabilityHealthAspect";

      const errorMessage = () => {
        _extractPartsForAspect(responseExpanderWithoutMainEntityField, aspect);
      };

      expect(errorMessage).toThrow(
        `mainEntity or subjectOf field missing in Expander (position: 4, identifier: 18)`,
      );
    });

    it("should throw if expander is missing subjectOf field", () => {
      const responseExpanderWithoutSubjectOfField: ContentApiVaccineResponse = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[2],
            hasPart: [
              {
                "@type": "Type",
                position: 7,
                name: "Expander",
                identifier: "10",
                mainEntity: "content",
              },
            ],
          },
        ],
      };
      const aspect = "SuitabilityHealthAspect";

      const errorMessage = () => {
        _extractPartsForAspect(responseExpanderWithoutSubjectOfField, aspect);
      };

      expect(errorMessage).toThrow(
        `mainEntity or subjectOf field missing in Expander (position: 7, identifier: 10)`,
      );
    });

    it("should throw if expander mainEntity is not a valid string value", () => {
      const responseExpanderWithInvalidMainEntityField: ContentApiVaccineResponse =
        {
          ...genericVaccineContentAPIResponse,
          mainEntityOfPage: [
            {
              ...genericVaccineContentAPIResponse.mainEntityOfPage[2],
              hasPart: [
                {
                  "@type": "Type",
                  position: 9,
                  name: "Expander",
                  identifier: "8",
                  subjectOf: "subject",
                  mainEntity: [
                    {
                      "@type": "Type",
                      position: 0,
                      name: "Expander",
                      subjectOf: "invalid Expander",
                      identifier: "2",
                      mainEntity: "invalid-value",
                    },
                  ],
                },
              ],
            },
          ],
        };
      const aspect = "SuitabilityHealthAspect";

      const errorMessage = () => {
        _extractPartsForAspect(
          responseExpanderWithInvalidMainEntityField,
          aspect,
        );
      };

      expect(errorMessage).toThrow(
        `mainEntity in Expander is not a string (position: 9, identifier: 8)`,
      );
    });

    it("should remove excluded hyperlinks", () => {
      const responseWithExcludedLink: ContentApiVaccineResponse = {
        ...genericVaccineContentAPIResponse,
        mainEntityOfPage: [
          {
            ...genericVaccineContentAPIResponse.mainEntityOfPage[5],
            hasPart: [
              {
                position: 0,
                identifier: "1",
                text: '<p>or <a href="/nhs-app">via the NHS app</a></p>',
                "@type": "WebPageElement",
                name: "markdown",
                headline: "",
              },
            ],
          },
        ],
      };
      const aspect = "GettingAccessHealthAspect";

      const parts = _extractPartsForAspect(responseWithExcludedLink, aspect);

      const expectedParts: VaccinePageSubsection[] = [
        {
          type: "simpleElement",
          headline: "",
          name: "markdown",
          text: "<p>or via the NHS app</p>",
        },
      ];

      expect(parts).toEqual(expectedParts);
    });
  });

  describe("_removeExcludedHyperlinks", () => {
    it("should remove excluded links from content mainEntity field", () => {
      const subsectionsWithMainEntity: VaccinePageSubsection[] = [
        {
          type: "expanderElement",
          headline: "First Expander subjectOf",
          name: "Expander",
          mainEntity:
            '<p>Book by <a href="/nhs-services/vaccination-and-booking-services/book-a-vaccine">going to NBS</a> or <a href="/nhs-app">via the NHS app</a></p>',
        },
      ];

      const expectedTextAttr = "<p>Book by going to NBS or via the NHS app</p>";

      const actualSubsections = _removeExcludedHyperlinks(
        subsectionsWithMainEntity,
      );

      actualSubsections.forEach((subsection) => {
        if (
          subsection.type === "expanderElement" ||
          subsection.type === "tableElement"
        ) {
          expect(subsection.mainEntity).toEqual(expectedTextAttr);
        } else {
          throw Error("Unreachable error");
        }
      });
    });

    it("should remove excluded links from content text field", () => {
      const subsectionsWithTextElement: VaccinePageSubsection[] = [
        {
          type: "simpleElement",
          headline: "",
          name: "markdown",
          text: '<p>Book by <a href="https://www.nhs.uk/nhs-services/vaccination-and-booking-services/book-covid-19-vaccination">going to NBS</a> or <a href="/nhs-app">via the NHS app</a></p>',
        },
      ];
      const expectedTextAttr = "<p>Book by going to NBS or via the NHS app</p>";

      const actualSubsections = _removeExcludedHyperlinks(
        subsectionsWithTextElement,
      );

      actualSubsections.forEach((subsection) => {
        if (subsection.type === "simpleElement") {
          expect(subsection.text).toEqual(expectedTextAttr);
        } else {
          throw Error("Unreachable error");
        }
      });
    });

    it("should not alter aspects without links to excluded destinations", () => {
      const expectedText =
        '<p>go to a <a href="https://www.nhs.uk/nhs-services/vaccination-and-booking-services/find-a-walk-in-covid-19-vaccination-site/">walk-in COVID-19 vaccination site</a></p>';

      const subsections: VaccinePageSubsection[] = [
        {
          type: "simpleElement",
          headline: "",
          name: "markdown",
          text: expectedText,
        },
      ];

      const actualSubsections = _removeExcludedHyperlinks(subsections);

      actualSubsections.forEach((subsection) => {
        if (subsection.type === "simpleElement") {
          expect(subsection.text).toEqual(expectedText);
        } else {
          throw Error("Unreachable error");
        }
      });
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
          headline: "Who should have this vaccine",
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

      const pageCopyForPneumococcal = await getFilteredContentForVaccine(
        VaccineTypes.PNEUMOCOCCAL,
        JSON.stringify(genericVaccineContentAPIResponse),
      );

      expect(pageCopyForPneumococcal).toEqual(
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
