import { buildFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { extractHtmlWithHeadingFromSubSectionByHeading } from "@src/services/content-api/parsers/custom/extract-html";
import { VaccinePageContent, VaccinePageSection, VaccinePageSubsection } from "@src/services/content-api/types";

const olderAdultsRegExp: RegExp = /<h3>If you're aged \d+ or over<\/h3>((?:\s*<p>.*?<\/p>)+)/i;
const olderAdultsInCareHomeRegExp: RegExp =
  /<h3>If you live in a care home for older adults<\/h3>((?:\s*<p>.*?<\/p>)+)/i;

export const buildFilteredContentForRSVOlderAdultsVaccine = async (apiContent: string): Promise<VaccinePageContent> => {
  const standardFilteredContent: VaccinePageContent = await buildFilteredContentForStandardVaccine(apiContent);

  const howToGetForRsvOlderAdults = filterHowToGetSectionForRsv(standardFilteredContent.howToGetVaccine);

  return {
    overview: standardFilteredContent.overview,
    whatVaccineIsFor: standardFilteredContent.whatVaccineIsFor,
    whoVaccineIsFor: standardFilteredContent.whoVaccineIsFor,
    howToGetVaccine: howToGetForRsvOlderAdults,
    vaccineSideEffects: standardFilteredContent.vaccineSideEffects,
    webpageLink: standardFilteredContent.webpageLink,
    callout: undefined,
    recommendation: undefined,
    actions: [],
  };
};

export const filterHowToGetSectionForRsv = (howToGetVaccine: VaccinePageSection): VaccinePageSection => {
  const subsections = howToGetVaccine.subsections.flatMap((subsection: VaccinePageSubsection) => {
    const olderAdultsText = extractHtmlWithHeadingFromSubSectionByHeading(subsection, olderAdultsRegExp);

    const olderAdultsInCareHomeText = extractHtmlWithHeadingFromSubSectionByHeading(
      subsection,
      olderAdultsInCareHomeRegExp,
    );

    return [
      { ...subsection, text: olderAdultsText },
      { ...subsection, text: olderAdultsInCareHomeText },
    ];
  });

  return { ...howToGetVaccine, subsections };
};
