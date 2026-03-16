import { buildFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { extractHtmlFromSubSectionByHeading } from "@src/services/content-api/parsers/custom/extract-html";
import { VaccinePageContent, VaccinePageSection, VaccinePageSubsection } from "@src/services/content-api/types";

const olderAdultsRegExp: RegExp =
  /<h3>If you're aged \d+ to \d+(?: \(or turned \d+ after .*\))?<\/h3>((?:\s*<p>.*?<\/p>)+)/i;

export const buildFilteredContentForRSVOlderAdultsVaccine = async (apiContent: string): Promise<VaccinePageContent> => {
  const standardFilteredContent: VaccinePageContent = await buildFilteredContentForStandardVaccine(apiContent);

  const howToGetForRsvOlderAdults = filterHowToGetSectionToOnlyRsvOlderAdultsText(
    standardFilteredContent.howToGetVaccine,
  );

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

export const filterHowToGetSectionToOnlyRsvOlderAdultsText = (
  howToGetVaccine: VaccinePageSection,
): VaccinePageSection => {
  const subsections = howToGetVaccine.subsections.map((subsection: VaccinePageSubsection) => {
    return {
      ...subsection,
      text: extractHtmlFromSubSectionByHeading(subsection, olderAdultsRegExp),
    };
  });

  return { ...howToGetVaccine, subsections };
};
