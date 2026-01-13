import {
  _getSubsection,
  buildFilteredContentForStandardVaccine,
  removeExcludedHyperlinks,
} from "@src/services/content-api/parsers/content-filter-service";
import {
  ContentApiVaccineResponse,
  HasPartSubsection,
  MainEntityOfPage,
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";

const buildFilteredContentForMMRandMMRVVaccines = async (apiContent: string): Promise<VaccinePageContent> => {
  const content: ContentApiVaccineResponse = JSON.parse(apiContent);
  const standardFilteredContent = await buildFilteredContentForStandardVaccine(apiContent);
  let additionalInformation: VaccinePageSection | undefined;
  let additionalInformationSubsection: VaccinePageSubsection[] | undefined;

  const infoBlock = content.mainEntityOfPage.find((page: MainEntityOfPage) => page.position === 1);
  if (infoBlock && infoBlock.hasPart) {
    additionalInformationSubsection = infoBlock.hasPart.flatMap((part: HasPartSubsection) => {
      return _getSubsection(part);
    });
    if (additionalInformationSubsection.length > 0) {
      additionalInformation = {
        headline: "",
        subsections: removeExcludedHyperlinks(additionalInformationSubsection),
      };
    }
  }

  return { ...standardFilteredContent, additionalInformation };
};

export { buildFilteredContentForMMRandMMRVVaccines };
