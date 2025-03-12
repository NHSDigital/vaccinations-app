import { getContentForVaccine } from "@src/services/content-api/contentService";
import { VaccineTypes } from "@src/models/vaccine";

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

type VaccinePageContent = {
  overview: string;
  whatVaccineIsFor: VaccinePageSection;
  whoVaccineIsFor: string;
  howToGetVaccine: VaccinePageSection;
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

  const whoVaccineIsFor = extractAllPartsTextForAspect(
    contentApiVaccineText,
    "SuitabilityHealthAspect",
  ).concat(
    extractAllPartsTextForAspect(
      contentApiVaccineText,
      "ContraindicationsHealthAspect",
    ),
  );

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

  return {
    overview,
    whatVaccineIsFor,
    whoVaccineIsFor,
    howToGetVaccine,
  };
};

export {
  getPageCopyForVaccine,
  extractDescriptionForAspect,
  extractAllPartsTextForAspect,
};
