import { extractHtmlFromSubSectionByHeading } from "@src/services/content-api/parsers/custom/extract-html";
import { buildFilteredContentForRSVPregnancyVaccine } from "@src/services/content-api/parsers/custom/rsv-pregnancy";
import { SimpleSubsection } from "@src/services/content-api/types";
import { genericVaccineContentAPIResponseWithRSVGettingAccess } from "@test-data/content-api/data-rsv";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({ buildNbsUrl: jest.fn() }));
jest.mock("@src/services/content-api/parsers/custom/extract-html");

const expectedHowToGetUnFilteredText =
  "<p>There are different ways to get the RSV vaccine.</p><h3>If you're pregnant</h3><p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you're 28 weeks pregnant or more and have not been offered the vaccine.</p><h3>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</h3><p>If you're aged 75 to 79 (or turned 80 after 1 September 2024) contact your GP surgery to book your RSV vaccination.</p><p>Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email.</p><p>You do not need to wait to be contacted before booking your vaccination.</p>";
const expectedHowToGetFilteredText =
  "<p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you're 28 weeks pregnant or more and have not been offered the vaccine.</p>";
const expectedRsvInPregnancyRegExp: RegExp = /<h3>If you're pregnant<\/h3>((?:\s*<p>.*?<\/p>)+)/i;

const apiResponse = JSON.stringify(genericVaccineContentAPIResponseWithRSVGettingAccess);

describe("buildFilteredContentForRSVPregnancyVaccine", () => {
  beforeEach(() => {
    (extractHtmlFromSubSectionByHeading as jest.Mock).mockReturnValue(expectedHowToGetFilteredText);
  });

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
    expect(extractHtmlFromSubSectionByHeading).toHaveBeenCalledWith(
      expect.objectContaining({ text: expectedHowToGetUnFilteredText }),
      expectedRsvInPregnancyRegExp,
    );
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
