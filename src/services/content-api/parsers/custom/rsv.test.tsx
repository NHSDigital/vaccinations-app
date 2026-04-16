import { extractHtmlWithHeadingFromSubSectionByHeading } from "@src/services/content-api/parsers/custom/extract-html";
import { buildFilteredContentForRSVOlderAdultsVaccine } from "@src/services/content-api/parsers/custom/rsv";
import { SimpleSubsection } from "@src/services/content-api/types";
import { genericVaccineContentAPIResponseWithRSVGettingAccess } from "@test-data/content-api/data-rsv";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({ buildNbsUrl: jest.fn() }));
jest.mock("@src/services/content-api/parsers/custom/extract-html");

const expectedHowToGetOlderAdultsUnFilteredText =
  "<p>There are different ways to get the RSV vaccine.</p><h3>If you're pregnant</h3><p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you're 28 weeks pregnant or more and have not been offered the vaccine.</p><h3>If you're aged 75 or over</h3><p>Contact your GP surgery to book your RSV vaccination.</p><p>Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email.</p><p>You do not need to wait to be contacted before booking your vaccination.</p><h3>If you live in a care home for older adults</h3><p>Speak to a member of staff at your care home or your GP surgery about how to get the RSV vaccine.</p><p>Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email.</p>";
const expectedOlderAdultsFilteredText =
  "<h3>If you're aged 75 or over</h3><p>Contact your GP surgery to book your RSV vaccination.</p><p>Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email.</p><p>You do not need to wait to be contacted before booking your vaccination.</p>";
const expectedOlderAdultsInCareHomeFilteredText =
  "<h3>If you live in a care home for older adults</h3><p>Speak to a member of staff at your care home or your GP surgery about how to get the RSV vaccine.</p><p>Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email.</p>";
const expectedOlderAdultsRegExp: RegExp = /<h3>If you're aged \d+ or over<\/h3>((?:\s*<p>.*?<\/p>)+)/i;
const expectedOlderAdultsInCareHomeRegExp: RegExp =
  /<h3>If you live in a care home for older adults<\/h3>((?:\s*<p>.*?<\/p>)+)/i;

const apiResponse = JSON.stringify(genericVaccineContentAPIResponseWithRSVGettingAccess);

describe("buildFilteredContentForRSVOlderAdultsVaccine", () => {
  beforeEach(() => {
    (extractHtmlWithHeadingFromSubSectionByHeading as jest.Mock)
      .mockReturnValueOnce(expectedOlderAdultsFilteredText)
      .mockReturnValueOnce(expectedOlderAdultsInCareHomeFilteredText);
  });

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

  it("should return howToGet section with two subsections for older adults and care home", async () => {
    const pageCopyForRSVOlderAdultsVaccine = await buildFilteredContentForRSVOlderAdultsVaccine(apiResponse);

    expect(pageCopyForRSVOlderAdultsVaccine.howToGetVaccine).toBeDefined();
    expect(pageCopyForRSVOlderAdultsVaccine.howToGetVaccine.subsections.length).toBe(2);

    const olderAdultsSubsection = pageCopyForRSVOlderAdultsVaccine.howToGetVaccine.subsections[0] as SimpleSubsection;
    const careHomeSubsection = pageCopyForRSVOlderAdultsVaccine.howToGetVaccine.subsections[1] as SimpleSubsection;

    expect(olderAdultsSubsection.text).toBe(expectedOlderAdultsFilteredText);
    expect(careHomeSubsection.text).toBe(expectedOlderAdultsInCareHomeFilteredText);

    expect(extractHtmlWithHeadingFromSubSectionByHeading).toHaveBeenCalledWith(
      expect.objectContaining({ text: expectedHowToGetOlderAdultsUnFilteredText }),
      expectedOlderAdultsRegExp,
    );
    expect(extractHtmlWithHeadingFromSubSectionByHeading).toHaveBeenCalledWith(
      expect.objectContaining({ text: expectedHowToGetOlderAdultsUnFilteredText }),
      expectedOlderAdultsInCareHomeRegExp,
    );
  });
});
