import { buildFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { ContentParsingError } from "@src/services/content-api/parsers/custom/exceptions";
import { VaccinePageContent, VaccinePageSection, VaccinePageSubsection } from "@src/services/content-api/types";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "services-content-api-parsers-custom-rsv" });

const olderAdultsRegExp: RegExp =
  /<h3>If you're aged \d+ to \d+(?: \(or turned \d+ after .*\))?<\/h3>((?:\s*<p>.*?<\/p>)+)/i;
const paragraphsRegExp: RegExp = /<p>.*?<\/p>/g;

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
  howToGetVaccine.subsections.map((subsection: VaccinePageSubsection) => {
    if (subsection.type !== "simpleElement") {
      log.warn({ context: { type: subsection.type } }, "HowToGetSubsection element not found");
      throw new ContentParsingError("HowToGetSubsection element not found");
    }

    const rsvInOlderAdultsMatches = olderAdultsRegExp.exec(subsection.text);
    if (!rsvInOlderAdultsMatches) {
      log.warn(
        { context: { text: subsection.text } },
        "HowToGetSubsection header not found - has the content changed?",
      );
      throw new ContentParsingError("HowToGetSubsection header not found - has the content changed?");
    }

    const paragraphsMatches = rsvInOlderAdultsMatches[1].match(paragraphsRegExp);
    if (!paragraphsMatches) {
      log.warn(
        { context: { text: rsvInOlderAdultsMatches[1] } },
        "HowToGetSubsection paragraph not found - has the content changed?",
      );
      throw new ContentParsingError("HowToGetSubsection paragraph not found - has the content changed?");
    }

    subsection.text = paragraphsMatches.join("");
    return subsection;
  });

  return howToGetVaccine;
};
