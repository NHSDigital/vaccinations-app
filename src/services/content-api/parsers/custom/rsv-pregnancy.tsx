import { SSO_TO_NBS_ROUTE } from "@src/app/api/sso-to-nbs/constants";
import { UrlPathFragment, VaccineInfo, VaccineType } from "@src/models/vaccine";
import { buildFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { ContentParsingError } from "@src/services/content-api/parsers/custom/exceptions";
import {
  HeadingWithContent,
  Overview,
  SimpleSubsection,
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "services-content-api-parsers-custom-rsv-pregnancy" });

const rsvInPregnancyRegExp: RegExp = /<h3>If you're pregnant<\/h3>((?:\s*<p>.*?<\/p>)+)/i;
const paragraphsRegExp: RegExp = /<p>.*?<\/p>/g;

export const buildFilteredContentForRSVPregnancyVaccine = async (apiContent: string): Promise<VaccinePageContent> => {
  const standardFilteredContent: VaccinePageContent = await buildFilteredContentForStandardVaccine(apiContent);

  const howToGetForRsvPregnancy = filterHowToGetSectionToOnlyRsvPregnancyText(standardFilteredContent.howToGetVaccine);

  const recommendation: HeadingWithContent = {
    heading: "The RSV vaccine is recommended if you:",
    content: ["* are over 28 weeks pregnant", "* have not had the vaccine during this pregnancy"].join("\n"),
  };

  const overviewConclusion = createOverviewConclusionFromHowToGetSection(howToGetForRsvPregnancy);

  return {
    overview: standardFilteredContent.overview,
    whatVaccineIsFor: standardFilteredContent.whatVaccineIsFor,
    whoVaccineIsFor: standardFilteredContent.whoVaccineIsFor,
    howToGetVaccine: howToGetForRsvPregnancy,
    vaccineSideEffects: standardFilteredContent.vaccineSideEffects,
    webpageLink: standardFilteredContent.webpageLink,
    callout: undefined,
    recommendation: recommendation,
    actions: [],
    overviewConclusion: overviewConclusion,
  };
};

export const filterHowToGetSectionToOnlyRsvPregnancyText = (
  howToGetVaccine: VaccinePageSection,
): VaccinePageSection => {
  howToGetVaccine.subsections.forEach((subsection: VaccinePageSubsection) => {
    if (subsection.type !== "simpleElement") {
      log.warn({ context: { type: subsection.type } }, "HowToGetSubsection element not found");
      throw new ContentParsingError("HowToGetSubsection element not found");
    }

    const rsvInPregnancyMatches = rsvInPregnancyRegExp.exec(subsection.text);
    if (!rsvInPregnancyMatches) {
      log.warn(
        { context: { text: subsection.text } },
        "HowToGetSubsection header not found - has the content changed?",
      );
      throw new ContentParsingError("HowToGetSubsection header not found - has the content changed?");
    }

    const paragraphsMatches = rsvInPregnancyMatches[1].match(paragraphsRegExp);
    if (!paragraphsMatches) {
      log.warn(
        { context: { text: rsvInPregnancyMatches[1] } },
        "HowToGetSubsection paragraph not found - has the content changed?",
      );
      throw new ContentParsingError("HowToGetSubsection paragraph not found - has the content changed?");
    }

    subsection.text = paragraphsMatches.join("");
    return subsection;
  });

  return howToGetVaccine;
};

const createOverviewConclusionFromHowToGetSection = (howToGetContent: VaccinePageSection): Overview => {
  // TODO: VIA-832 attempt to remove hardcoding for array element zero?
  const howToGetContentText: SimpleSubsection = howToGetContent.subsections[0] as SimpleSubsection;

  const pharmacyBookingInfo = buildPharmacyBookingNBSInfo();
  const howToGetForRsvPregnancyText = `<h3>How to get the vaccine</h3>${howToGetContentText.text}${pharmacyBookingInfo}`;

  return { content: howToGetForRsvPregnancyText, containsHtml: true };
};

const buildPharmacyBookingNBSInfo = () => {
  const vaccineInfo = VaccineInfo[VaccineType.RSV_PREGNANCY];
  const pharmacyBookingLinkText = `book ${vaccineInfo.displayName.indefiniteArticle} ${vaccineInfo.displayName.midSentenceCase} vaccination in a pharmacy`;

  const vaccinePath: UrlPathFragment = vaccineInfo.nbsPath || ("unknown" as UrlPathFragment);
  const nbsSSOLink = `${SSO_TO_NBS_ROUTE}?vaccine=${vaccinePath}`;

  return `<p>In some areas you can also <a href="${nbsSSOLink}">${pharmacyBookingLinkText}</a>.</p>`;
};
