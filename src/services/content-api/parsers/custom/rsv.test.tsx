import { ContentParsingError } from "@src/services/content-api/parsers/custom/exceptions";
import {
  buildFilteredContentForRSVOlderAdultsVaccine,
  filterHowToGetSectionToOnlyRsvOlderAdultsText,
} from "@src/services/content-api/parsers/custom/rsv";
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

const expectedHowToGetOlderAdultsFilteredText =
  "<p>If you're aged 75 to 79 (or turned 80 after 1 September 2024) contact your GP surgery to book your RSV vaccination.</p><p>Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email.</p><p>You do not need to wait to be contacted before booking your vaccination.</p>";

const apiResponse = JSON.stringify(genericVaccineContentAPIResponseWithRSVGettingAccess);

describe("buildFilteredContentForRSVOlderAdultsVaccine", () => {
  it("should return standard vaccine content for most fields", async () => {
    const pageCopyForRSVOlderAdultsVaccine = await buildFilteredContentForRSVOlderAdultsVaccine(apiResponse);

    expect(pageCopyForRSVOlderAdultsVaccine.overview).toBeDefined();
    expect(pageCopyForRSVOlderAdultsVaccine.whatVaccineIsFor).toBeDefined();
    expect(pageCopyForRSVOlderAdultsVaccine.whoVaccineIsFor).toBeDefined();
    expect(pageCopyForRSVOlderAdultsVaccine.howToGetVaccine).toBeDefined();
    expect(pageCopyForRSVOlderAdultsVaccine.vaccineSideEffects).toBeDefined();
    expect(pageCopyForRSVOlderAdultsVaccine.webpageLink).toBeDefined();

    expect(pageCopyForRSVOlderAdultsVaccine.callout).toBeUndefined();
    expect(pageCopyForRSVOlderAdultsVaccine.extraDosesSchedule).toBeUndefined();
  });

  it("should return howToGet section with only text matching pregnancy regex", async () => {
    const pageCopyForRSVOlderAdultsVaccine = await buildFilteredContentForRSVOlderAdultsVaccine(apiResponse);

    expect(pageCopyForRSVOlderAdultsVaccine.howToGetVaccine).toBeDefined();
    expect(pageCopyForRSVOlderAdultsVaccine.howToGetVaccine.subsections.length).toBe(1);
    const howToGetSubsection: SimpleSubsection = pageCopyForRSVOlderAdultsVaccine.howToGetVaccine
      .subsections[0] as SimpleSubsection;
    expect(howToGetSubsection.text).toBe(expectedHowToGetOlderAdultsFilteredText);
  });
});

describe("extractRsvOlderAdultsFromHowToGetSection", () => {
  it("should return howToGet section with selected older adults related text only", () => {
    const filteredHowToGetSection = filterHowToGetSectionToOnlyRsvOlderAdultsText(howToGetVaccineRSV);

    expect(filteredHowToGetSection.subsections.length).toBe(1);
    const subsection: SimpleSubsection = filteredHowToGetSection.subsections[0] as SimpleSubsection;
    expect(subsection.text).toEqual(expectedHowToGetOlderAdultsFilteredText);
  });

  it("throws ContentParsingError if no h3 is found for rsv older adults", () => {
    const howToGetWithoutOlderAdultsHeading: VaccinePageSection = {
      headline: "How to get the RSV vaccine",
      subsections: [
        {
          type: "simpleElement",
          headline: "",
          text: "<p>There are different ways to get the RSV vaccine.</p><h3>If you're pregnant</h3><p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you're 28 weeks pregnant or more and have not been offered the vaccine.</p><p>If you're aged 75 to 79 (or turned 80 after 1 September 2024) contact your GP surgery to book your RSV vaccination.</p><p>Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email.</p><p>You do not need to wait to be contacted before booking your vaccination.</p>",
          name: "markdown",
        },
      ],
    };
    expect(() => {
      filterHowToGetSectionToOnlyRsvOlderAdultsText(howToGetWithoutOlderAdultsHeading);
    }).toThrow(ContentParsingError);
  });

  it("throws ContentParsingError if no paragraphs found for rsv older adults", () => {
    const howToGetWithoutParagraphsInOlderAdults: VaccinePageSection = {
      headline: "How to get the RSV vaccine",
      subsections: [
        {
          type: "simpleElement",
          headline: "",
          text: "<p>There are different ways to get the RSV vaccine.</p><h3>If you're pregnant</h3><p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you're 28 weeks pregnant or more and have not been offered the vaccine.</p><h3>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</h3>",
          name: "markdown",
        },
      ],
    };
    expect(() => {
      filterHowToGetSectionToOnlyRsvOlderAdultsText(howToGetWithoutParagraphsInOlderAdults);
    }).toThrow(ContentParsingError);
  });

  it("throws ContentParsingError if type is not 'simpleElement'", () => {
    const howToGetWithoutSimpleElement: VaccinePageSection = {
      headline: "How to get the RSV vaccine",
      subsections: [mockNonSimpleSubsection],
    };
    expect(() => {
      filterHowToGetSectionToOnlyRsvOlderAdultsText(howToGetWithoutSimpleElement);
    }).toThrow(ContentParsingError);
  });
});
