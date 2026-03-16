import { VaccinePageSubsection } from "../../types";
import { ContentParsingError } from "./exceptions";
import { extractHtmlFromSubSectionByHeading } from "./extract-html";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("extract-html", () => {
  describe("extractHtmlFromSubSectionByHeading", () => {
    const rsvInPregnancyRegExp: RegExp = /<h3>If you're pregnant<\/h3>((?:\s*<p>.*?<\/p>)+)/i;

    const subSection: VaccinePageSubsection = {
      type: "simpleElement",
      headline: "",
      text: "<p>There are different ways to get the RSV vaccine.</p><h3>If you're pregnant</h3><p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you're 28 weeks pregnant or more and have not been offered the vaccine.</p><h3>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</h3><p>If you're aged 75 to 79 (or turned 80 after 1 September 2024) contact your GP surgery to book your RSV vaccination.</p><p>Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email.</p><p>You do not need to wait to be contacted before booking your vaccination.</p>",
      name: "markdown",
    };

    it("should return html when matching section header and paragraph is found", () => {
      const expectedExtractedHtml =
        "<p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you're 28 weeks pregnant or more and have not been offered the vaccine.</p>";

      const extractedHtml = extractHtmlFromSubSectionByHeading(subSection, rsvInPregnancyRegExp);

      expect(extractedHtml).toEqual(expectedExtractedHtml);
    });

    it("throws ContentParsingError if no heading matching section heading is found", () => {
      const subSectionWithNoMatchingHeader: VaccinePageSubsection = {
        ...subSection,
        text: "<p>There are different ways to get the RSV vaccine.</p><h3>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</h3><p>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</p>",
      };

      expect(() => {
        extractHtmlFromSubSectionByHeading(subSectionWithNoMatchingHeader, rsvInPregnancyRegExp);
      }).toThrow(ContentParsingError);
    });

    it("throws ContentParsingError if no paragraphs found for section heading", () => {
      const subSectionWithNoParagraphs: VaccinePageSubsection = {
        ...subSection,
        text: "<p>There are different ways to get the RSV vaccine.</p><h3>If you're pregnant</h3><h3>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</h3><p>If you're aged 75 to 79 (or turned 80 after 1 September 2024)</p>",
      };

      expect(() => {
        extractHtmlFromSubSectionByHeading(subSectionWithNoParagraphs, rsvInPregnancyRegExp);
      }).toThrow(ContentParsingError);
    });

    it("throws ContentParsingError if type is not 'simpleElement'", () => {
      const subSectionWithoutSimpleElement: VaccinePageSubsection = {
        type: "tableElement",
        name: "",
        mainEntity: "",
      };
      expect(() => {
        extractHtmlFromSubSectionByHeading(subSectionWithoutSimpleElement, rsvInPregnancyRegExp);
      }).toThrow(ContentParsingError);
    });
  });
});
