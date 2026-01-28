import { VaccineType } from "@src/models/vaccine";
import {
  _extractDescriptionForVaccine,
  _extractHeadlineForAspect,
  _extractHeadlineForContraindicationsAspect,
  _extractPartsForAspect,
  _findAspect,
  _hasHealthAspect,
  getFilteredContentForVaccine,
  removeExcludedHyperlinks,
} from "@src/services/content-api/parsers/content-filter-service";
import { buildFilteredContentForCovid19Vaccine } from "@src/services/content-api/parsers/custom/covid-19";
import { buildFilteredContentForFluForChildrenVaccine } from "@src/services/content-api/parsers/custom/flu-for-children";
import { buildFilteredContentForFluForSchoolAgedChildrenVaccine } from "@src/services/content-api/parsers/custom/flu-for-school-aged-children";
import { buildFilteredContentForFluInPregnancyVaccine } from "@src/services/content-api/parsers/custom/flu-in-pregnancy";
import { buildFilteredContentForFluVaccine } from "@src/services/content-api/parsers/custom/flu-vaccine";
import { buildFilteredContentForMMRandMMRVVaccines } from "@src/services/content-api/parsers/custom/mmr-and-mmrv";
import { buildFilteredContentForWhoopingCoughVaccine } from "@src/services/content-api/parsers/custom/whooping-cough";
import {
  ContentApiVaccineResponse,
  HeadingWithTypedContent,
  MainEntityOfPage,
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";
import { contentWithoutBenefitsHealthAspect, contentWithoutCallout } from "@test-data/content-api/helpers";

jest.mock("@src/services/content-api/parsers/custom/whooping-cough");
jest.mock("@src/services/content-api/parsers/custom/flu-in-pregnancy");
jest.mock("@src/services/content-api/parsers/custom/flu-vaccine");
jest.mock("@src/services/content-api/parsers/custom/flu-for-children");
jest.mock("@src/services/content-api/parsers/custom/flu-for-school-aged-children");
jest.mock("@src/services/content-api/parsers/custom/covid-19");
jest.mock("@src/services/content-api/parsers/custom/mmr-and-mmrv");

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({}));

describe("Content Filter", () => {
  describe("_extractDescriptionForVaccine", () => {
    it("should return text from mainEntityOfPage object", async () => {
      const expectedOverview: string = "Generic Vaccine Lead Paragraph (overview)";

      const overview = _extractDescriptionForVaccine(genericVaccineContentAPIResponse, "lead paragraph");

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

      const errorMessage = () => _extractDescriptionForVaccine(responseWithoutEntityOfPage, "lead paragraph");

      expect(errorMessage).toThrow("Missing text for description: lead paragraph");
    });
  });

  describe("_extractHeadlineForAspect", () => {
    it("should extract headline from aspect", async () => {
      const expectedHeadline: string = "Getting Access Health Aspect headline";

      const headline: string = _extractHeadlineForAspect(genericVaccineContentAPIResponse, "GettingAccessHealthAspect");

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

      const errorMessage = () => _extractHeadlineForAspect(responseWithoutHeadline, "BenefitsHealthAspect");

      expect(errorMessage).toThrow("Missing headline for Aspect: BenefitsHealthAspect");
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

      expect(errorMessage).toThrow(`mainEntity missing or is not a string in Table (position: 1)`);
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

      expect(errorMessage).toThrow(`mainEntity missing or is not a string in Table (position: 9)`);
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
      const responseExpanderWithoutMainEntityField: ContentApiVaccineResponse = {
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

      expect(errorMessage).toThrow(`mainEntity or subjectOf field missing in Expander (position: 4, identifier: 18)`);
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

      expect(errorMessage).toThrow(`mainEntity or subjectOf field missing in Expander (position: 7, identifier: 10)`);
    });

    it("should throw if expander mainEntity is not a valid string value", () => {
      const responseExpanderWithInvalidMainEntityField: ContentApiVaccineResponse = {
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
        _extractPartsForAspect(responseExpanderWithInvalidMainEntityField, aspect);
      };

      expect(errorMessage).toThrow(`mainEntity in Expander is not a string (position: 9, identifier: 8)`);
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

      const actualSubsections = removeExcludedHyperlinks(subsectionsWithMainEntity);

      actualSubsections.forEach((subsection) => {
        if (subsection.type === "expanderElement" || subsection.type === "tableElement") {
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

      const actualSubsections = removeExcludedHyperlinks(subsectionsWithTextElement);

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

      const actualSubsections = removeExcludedHyperlinks(subsections);

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
      const aspect: MainEntityOfPage = _findAspect(genericVaccineContentAPIResponse, "BenefitsHealthAspect");

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
      const hasHealthAspect = _hasHealthAspect(genericVaccineContentAPIResponse, "BenefitsHealthAspect");
      expect(hasHealthAspect).toBeTruthy();
    });

    it("should return false if healthAspect does not exist in content", () => {
      const responseWithoutBenefitsHealthAspect = contentWithoutBenefitsHealthAspect();

      const hasHealthAspect = _hasHealthAspect(responseWithoutBenefitsHealthAspect, "BenefitsHealthAspect");
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

      const headline: VaccinePageSubsection[] = _extractHeadlineForContraindicationsAspect(
        genericVaccineContentAPIResponse,
      );

      expect(headline).toEqual(expected);
    });
  });

  describe("getFilteredContentForVaccine", () => {
    describe("for standard vaccines", () => {
      it("should return overview text from lead paragraph mainEntityOfPage object", async () => {
        const expectedOverview = {
          overview: { content: "Generic Vaccine Lead Paragraph (overview)", containsHtml: false },
        };

        const pageCopyForRsv = await getFilteredContentForVaccine(
          VaccineType.RSV,
          JSON.stringify(genericVaccineContentAPIResponse),
        );

        expect(pageCopyForRsv).toEqual(expect.objectContaining(expectedOverview));
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

        const pageCopyForRsv = await getFilteredContentForVaccine(
          VaccineType.RSV,
          JSON.stringify(genericVaccineContentAPIResponse),
        );

        expect(pageCopyForRsv).toEqual(expect.objectContaining(expectedWhatVaccineIsFor));
      });

      it("should return all parts for whoVaccineIsFor section", async () => {
        const expectedWhoVaccineIsFor = {
          whoVaccineIsFor: {
            headline: "Suitability Health Aspect headline",
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
                headline: "Suitability Health Aspect reveal headline",
                name: "",
                text: "",
              },
              {
                type: "simpleElement",
                headline: "",
                name: "markdown",
                text: "<p>Suitability Health Aspect reveal text</p>",
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

        const pageCopyForRsv = await getFilteredContentForVaccine(
          VaccineType.RSV,
          JSON.stringify(genericVaccineContentAPIResponse),
        );

        expect(pageCopyForRsv).toEqual(expect.objectContaining(expectedWhoVaccineIsFor));
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

        const pageCopyForRsv = await getFilteredContentForVaccine(
          VaccineType.RSV,
          JSON.stringify(genericVaccineContentAPIResponse),
        );

        expect(pageCopyForRsv).toEqual(expect.objectContaining(expectedHowToGetVaccine));
      });

      it("should return all parts for vaccineSideEffects section", async () => {
        const expectedVaccineSideEffects: VaccinePageSection = {
          headline: "Side effects of the generic vaccine",
          subsections: [
            {
              type: "simpleElement",
              headline: "",
              name: "markdown",
              text: "<p>Like all medicines, the generic vaccine can cause side effects, but not all babies get them.</p><h3>Common side effects</h3><p>Common side effects of the generic vaccine include:</p><ul><li>swelling or pain where the injection was given</li><li>a high temperature</li><li>feeling tired</li><li>loss of appetite</li><li>being sick or diarrhoea</li><li>irritability</li></ul><p>You can give babies <a href=\"https://www.nhs.uk/medicines/paracetamol-for-children/\">child's paracetamol</a> to ease any symptoms.</p><p>Check the packaging or leaflet to make sure the medicine is suitable for your child, or speak to a pharmacist or doctor if you're not sure.</p>",
            },
            {
              type: "simpleElement",
              headline: "",
              name: "urgent",
              text: '<h3>Ask for an urgent GP appointment or call 111 if your baby:</h3><div class="block-richtext">\n<ul><li>is under 3 months old and has a temperature of 38C or higher, or you think they have a high temperature</li><li>is 3 to 6 months old and has a temperature of 39C or higher, or you think they have a high temperature</li><li>is unwell and you\'re worried about them</li></ul>\n</div>',
            },
            {
              type: "simpleElement",
              headline: "Allergic reactions",
              name: "markdown",
              text: '<p>More serious side effects such as a severe allergic reaction (<a href="https://www.nhs.uk/conditions/anaphylaxis/">anaphylaxis</a>) are very rare and usually happen within minutes.</p><p>The person who vaccinates your child will be trained to deal with allergic reactions and treat them immediately.</p>',
            },
          ],
        };

        const pageCopyForRsv: VaccinePageContent = await getFilteredContentForVaccine(
          VaccineType.RSV,
          JSON.stringify(genericVaccineContentAPIResponse),
        );

        expect(pageCopyForRsv.vaccineSideEffects).toEqual(expectedVaccineSideEffects);
      });

      it("should include nhs webpage link to vaccine info", async () => {
        const expectedWebpageLink = {
          webpageLink: new URL("https://www.nhs.uk/vaccinations/generic-vaccine/"),
        };

        const pageCopyForRsv = await getFilteredContentForVaccine(
          VaccineType.RSV,
          JSON.stringify(genericVaccineContentAPIResponse),
        );

        expect(pageCopyForRsv).toEqual(expect.objectContaining(expectedWebpageLink));
      });

      it("should not return whatVaccineIsFor section when BenefitsHealthAspect is missing", async () => {
        const responseWithoutBenefitsHealthAspect = contentWithoutBenefitsHealthAspect();

        const pageCopyForFlu: VaccinePageContent = await getFilteredContentForVaccine(
          VaccineType.RSV,
          JSON.stringify(responseWithoutBenefitsHealthAspect),
        );

        expect(pageCopyForFlu.whatVaccineIsFor).toBeUndefined();
      });

      it("should return all parts for callout section", async () => {
        const expectedCallout: HeadingWithTypedContent = {
          heading: "Callout heading",
          content: "<p>Callout content</p>",
          contentType: "html",
        };

        const pageCopyForRsv: VaccinePageContent = await getFilteredContentForVaccine(
          VaccineType.RSV,
          JSON.stringify(genericVaccineContentAPIResponse),
        );

        expect(pageCopyForRsv.callout).toEqual(expectedCallout);
      });

      it("should not return callout section when Callout is missing", async () => {
        const responseWithoutCallout = contentWithoutCallout();

        const pageCopyForFlu: VaccinePageContent = await getFilteredContentForVaccine(
          VaccineType.RSV,
          JSON.stringify(responseWithoutCallout),
        );

        expect(pageCopyForFlu.callout).toBeUndefined();
      });
    });

    describe("for specific vaccines", () => {
      it("should call getFilteredContentForWhoopingCoughVaccine for whooping cough vaccine", async () => {
        const mockApiContent = "testContent";

        await getFilteredContentForVaccine(VaccineType.WHOOPING_COUGH, mockApiContent);

        expect(buildFilteredContentForWhoopingCoughVaccine).toHaveBeenCalledWith(mockApiContent);
      });

      it("should call getFilteredContentForFluVaccine for flu vaccine", async () => {
        const mockApiContent = "testContent";

        await getFilteredContentForVaccine(VaccineType.FLU_FOR_ADULTS, mockApiContent);

        expect(buildFilteredContentForFluVaccine).toHaveBeenCalledWith(mockApiContent);
      });

      it("should call getFilteredContentForFluInPregnancyVaccine for flu in pregnancy vaccine", async () => {
        const mockApiContent = "testContent";

        await getFilteredContentForVaccine(VaccineType.FLU_IN_PREGNANCY, mockApiContent);

        expect(buildFilteredContentForFluInPregnancyVaccine).toHaveBeenCalledWith(mockApiContent);
      });

      it("should call getFilteredContentForFluForChildrenVaccine for flu for children vaccine", async () => {
        const mockApiContent = "testContent";

        await getFilteredContentForVaccine(VaccineType.FLU_FOR_CHILDREN_AGED_2_TO_3, mockApiContent);

        expect(buildFilteredContentForFluForChildrenVaccine).toHaveBeenCalledWith(mockApiContent);
      });

      it("should return standard vaccine content and recommendation for school aged children's flu vaccine", async () => {
        const mockApiContent = "testContent";

        await getFilteredContentForVaccine(VaccineType.FLU_FOR_SCHOOL_AGED_CHILDREN, mockApiContent);
        expect(buildFilteredContentForFluForSchoolAgedChildrenVaccine).toHaveBeenCalledWith(mockApiContent);
      });

      it("should call buildFilteredContentForCovid19Vaccine for flu in pregnancy vaccine", async () => {
        const mockApiContent = "testContent";

        await getFilteredContentForVaccine(VaccineType.COVID_19, mockApiContent);

        expect(buildFilteredContentForCovid19Vaccine).toHaveBeenCalledWith(mockApiContent);
      });

      it("should call buildFilteredContentForMMRVVaccine for MMRV vaccine", async () => {
        const mockApiContent = "testContent";

        await getFilteredContentForVaccine(VaccineType.MMRV, mockApiContent);

        expect(buildFilteredContentForMMRandMMRVVaccines).toHaveBeenCalledWith(mockApiContent);
      });
    });
  });
});
