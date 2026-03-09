import { ContentParsingError } from "@src/services/content-api/parsers/custom/exceptions";
import {
  buildFilteredContentForRSVPregnancyVaccine,
  filterHowToGetSectionToOnlyRsvPregnancyText,
} from "@src/services/content-api/parsers/custom/rsv-pregnancy";
import { SimpleSubsection, VaccinePageSection, VaccinePageSubsection } from "@src/services/content-api/types";
import { genericVaccineContentAPIResponseWithRSVGettingAccess } from "@test-data/content-api/data-rsv";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({ buildNbsUrl: jest.fn() }));

const mockNonSimpleSubsection: VaccinePageSubsection = {
  type: "tableElement",
  name: "",
  mainEntity: "",
};

const howToGetVaccineRSV: VaccinePageSection = {
  headline: "How to get the RSV vaccine",
  subsections: [
    {
      type: "simpleElement",
      headline: "",
      text: "<p>There are different ways to get the RSV vaccine.</p><h3>If you're pregnant</h3><p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you're 28 weeks pregnant or more and have not been offered the vaccine.</p><h3>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</h3><p>If you're aged 75 to 79 (or turned 80 after 1 September 2024) contact your GP surgery to book your RSV vaccination.</p><p>Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email.</p><p>You do not need to wait to be contacted before booking your vaccination.</p>",
      name: "markdown",
    },
  ],
};

const expectedHowToGetFilteredText =
  "<p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you're 28 weeks pregnant or more and have not been offered the vaccine.</p>";

const apiResponse = JSON.stringify(genericVaccineContentAPIResponseWithRSVGettingAccess);

describe("buildFilteredContentForRSVPregnancyVaccine", () => {
  it("should return standard vaccine content for most fields", async () => {
    const pageCopyForRSVPregnancyVaccine = await buildFilteredContentForRSVPregnancyVaccine(apiResponse);

    expect(pageCopyForRSVPregnancyVaccine.overview).toBeDefined();
    expect(pageCopyForRSVPregnancyVaccine.whatVaccineIsFor).toBeDefined();
    expect(pageCopyForRSVPregnancyVaccine.whoVaccineIsFor).toBeDefined();
    expect(pageCopyForRSVPregnancyVaccine.howToGetVaccine).toBeDefined();
    expect(pageCopyForRSVPregnancyVaccine.vaccineSideEffects).toBeDefined();
    expect(pageCopyForRSVPregnancyVaccine.webpageLink).toBeDefined();

    expect(pageCopyForRSVPregnancyVaccine.callout).toBeUndefined();
    expect(pageCopyForRSVPregnancyVaccine.extraDosesSchedule).toBeUndefined();
  });

  it("should return howToGet section with only text matching pregnancy regex", async () => {
    const pageCopyForRSVPregnancyVaccine = await buildFilteredContentForRSVPregnancyVaccine(apiResponse);

    expect(pageCopyForRSVPregnancyVaccine.howToGetVaccine).toBeDefined();
    expect(pageCopyForRSVPregnancyVaccine.howToGetVaccine.subsections.length).toBe(1);
    const howToGetSubsection: SimpleSubsection = pageCopyForRSVPregnancyVaccine.howToGetVaccine
      .subsections[0] as SimpleSubsection;
    expect(howToGetSubsection.text).toBe(expectedHowToGetFilteredText);
  });

  it("should return custom recommendation for RSV Pregnancy", async () => {
    const expectedRecommendationHeading = "The RSV vaccine is recommended if you:";
    const expectedRecommendationContent =
      "* are over 28 weeks pregnant\n* have not had the vaccine during this pregnancy";

    const pageCopyForRSVPregnancyVaccine = await buildFilteredContentForRSVPregnancyVaccine(apiResponse);

    expect(pageCopyForRSVPregnancyVaccine.recommendation?.heading).toEqual(expectedRecommendationHeading);
    expect(pageCopyForRSVPregnancyVaccine.recommendation?.content).toEqual(expectedRecommendationContent);
  });

  it("should present howToGet text and pharmacy booking link in the overview conclusion", async () => {
    const expectedOverviewConclusion =
      '<h3>How to get the vaccine</h3><p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you\'re 28 weeks pregnant or more and have not been offered the vaccine.</p><p>In some areas you can also <a href="/api/sso-to-nbs?vaccine=rsv">book an RSV vaccination in a pharmacy</a>.</p>';
    const expectedPharmacyBookingLinkForRsv = '<a href="/api/sso-to-nbs?vaccine=rsv">';

    const pageCopyForRSVPregnancyVaccine = await buildFilteredContentForRSVPregnancyVaccine(apiResponse);

    expect(pageCopyForRSVPregnancyVaccine.overviewConclusion?.content).toEqual(expectedOverviewConclusion);
    expect(pageCopyForRSVPregnancyVaccine.overviewConclusion?.containsHtml).toEqual(true);
    expect(pageCopyForRSVPregnancyVaccine.overviewConclusion?.content).toContain(expectedPharmacyBookingLinkForRsv);
  });
});

describe("extractRsvPregnancyFromHowToGetSection", () => {
  it("should return howToGet section with selected pregnancy related text only", () => {
    const filteredHowToGetSection = filterHowToGetSectionToOnlyRsvPregnancyText(howToGetVaccineRSV);

    expect(filteredHowToGetSection.subsections.length).toBe(1);
    const subsection: SimpleSubsection = filteredHowToGetSection.subsections[0] as SimpleSubsection;
    expect(subsection.text).toEqual(expectedHowToGetFilteredText);
  });

  it("throws ContentParsingError if no h3 is found for rsv in pregnancy", () => {
    const howToGetWithoutPregnancyHeading: VaccinePageSection = {
      headline: "How to get the RSV vaccine",
      subsections: [
        {
          type: "simpleElement",
          headline: "",
          text: "<p>There are different ways to get the RSV vaccine.</p><h3>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</h3><p>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</p>",
          name: "markdown",
        },
      ],
    };
    expect(() => {
      filterHowToGetSectionToOnlyRsvPregnancyText(howToGetWithoutPregnancyHeading);
    }).toThrow(ContentParsingError);
  });

  it("throws ContentParsingError if no paragraphs found for rsv in pregnancy", () => {
    const howToGetWithoutParagraphsInPregnancy: VaccinePageSection = {
      headline: "How to get the RSV vaccine",
      subsections: [
        {
          type: "simpleElement",
          headline: "",
          text: "<p>There are different ways to get the RSV vaccine.</p><h3>If you're pregnant</h3><h3>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</h3><p>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</p>",
          name: "markdown",
        },
      ],
    };
    expect(() => {
      filterHowToGetSectionToOnlyRsvPregnancyText(howToGetWithoutParagraphsInPregnancy);
    }).toThrow(ContentParsingError);
  });

  it("throws ContentParsingError if type is not 'simpleElement'", () => {
    const howToGetWithoutSimpleElement: VaccinePageSection = {
      headline: "How to get the RSV vaccine",
      subsections: [mockNonSimpleSubsection],
    };
    expect(() => {
      filterHowToGetSectionToOnlyRsvPregnancyText(howToGetWithoutSimpleElement);
    }).toThrow(ContentParsingError);
  });
});
