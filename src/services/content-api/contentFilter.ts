import { getContentForVaccine } from "@src/services/content-api/contentService";
import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";

type Aspect =
  | "OverviewHealthAspect"
  | "BenefitsHealthAspect"
  | "SuitabilityHealthAspect"
  | "ContraindicationsHealthAspect"
  | "GettingAccessHealthAspect";

type ContentApiHasPartSubsection = {
  text: string;
  "@type": string;
  headline?: string;
  identifier?: string;
};

type ContentApiHasPart = {
  "@type": string;
  hasHealthAspect: string;
  description: string;
  headline: string;
  url: string;
  hasPart: ContentApiHasPartSubsection[];
};

export type ContentApiVaccineResponse = {
  hasPart: ContentApiHasPart[];
};

type VaccinePageSection = { heading: string; bodyText: string };

export type VaccinePageContent = {
  overview: string;
  whatVaccineIsFor: VaccinePageSection;
  whoVaccineIsFor: VaccinePageSection;
  howToGetVaccine: VaccinePageSection;
  webpageLink: string;
};

const findAspect = (
  contentApiVaccineText: ContentApiVaccineResponse,
  aspect: Aspect,
) => {
  const aspectInfo = contentApiVaccineText.hasPart.find(
    (part: ContentApiHasPart) => part.hasHealthAspect.endsWith(aspect),
  );
  return aspectInfo;
};

const extractAllPartsTextForAspect = (
  contentApiVaccineText: ContentApiVaccineResponse,
  aspect: Aspect,
): string => {
  const aspectInfo = findAspect(contentApiVaccineText, aspect);
  const aspectText = aspectInfo!.hasPart
    .map((part: ContentApiHasPartSubsection) => part.text)
    .join("");
  return aspectText;
};

const extractHeadlineForAspect = (
  contentApiVaccineText: ContentApiVaccineResponse,
  aspect: Aspect,
): string => {
  const aspectInfo = findAspect(contentApiVaccineText, aspect);
  return aspectInfo!.headline;
};

const extractDescriptionForAspect = (
  contentApiVaccineText: ContentApiVaccineResponse,
  aspect: Aspect,
): string => {
  const aspectInfo = findAspect(contentApiVaccineText, aspect);
  return aspectInfo!.description;
};

const generateWhoVaccineIsForHeading = (vaccineType: VaccineTypes) => {
  return `Who should have the ${VaccineDisplayNames[vaccineType]} vaccine`;
};

const getPageCopyForVaccine = async (
  vaccineName: VaccineTypes,
): Promise<VaccinePageContent> => {
  const contentApiVaccineText = await getContentForVaccine(vaccineName);

  const overview = extractDescriptionForAspect(
    contentApiVaccineText,
    "OverviewHealthAspect",
  );

  const whatVaccineIsFor = {
    heading: extractHeadlineForAspect(
      contentApiVaccineText,
      "BenefitsHealthAspect",
    ),
    bodyText: extractAllPartsTextForAspect(
      contentApiVaccineText,
      "BenefitsHealthAspect",
    ),
  };

  const whoVaccineIsFor = {
    heading: generateWhoVaccineIsForHeading(vaccineName),
    bodyText: extractAllPartsTextForAspect(
      contentApiVaccineText,
      "SuitabilityHealthAspect",
    ).concat(
      extractAllPartsTextForAspect(
        contentApiVaccineText,
        "ContraindicationsHealthAspect",
      ),
    ),
  };

  const howToGetVaccine = {
    heading: extractHeadlineForAspect(
      contentApiVaccineText,
      "GettingAccessHealthAspect",
    ),
    bodyText: extractAllPartsTextForAspect(
      contentApiVaccineText,
      "GettingAccessHealthAspect",
    ),
  };

  const webpageLink = contentApiVaccineText.webpage;

  return {
    overview,
    whatVaccineIsFor,
    whoVaccineIsFor,
    howToGetVaccine,
    webpageLink,
  };
};

export {
  getPageCopyForVaccine,
  extractDescriptionForAspect,
  extractAllPartsTextForAspect,
  generateWhoVaccineIsForHeading,
};
