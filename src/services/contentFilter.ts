import { VaccineTypes } from "@src/utils/Constants";
import { getContentForVaccine } from "@src/services/contentService";

type ContentApiHasPartSubsection = {
  text: string;
  type: string;
  headline?: string;
};

type ContentApiHasPart = {
  type: string;
  hasHealthAspect: string;
  description: string;
  headline: string;
  url: string;
  hasPart: ContentApiHasPartSubsection[];
};

type ContentApiVaccineResponse = {
  hasPart: ContentApiHasPart[];
};

const extractTextFromAllPartsForAspect = (
  contentApiVaccineText: ContentApiVaccineResponse,
  aspectUrl: string,
) => {
  const aspectInfo = contentApiVaccineText.hasPart.find(
    (part: ContentApiHasPart) => part.hasHealthAspect === aspectUrl,
  );
  const aspectText = aspectInfo!.hasPart
    .map((part: ContentApiHasPartSubsection) => part.text)
    .join("");
  return aspectText;
};

const getPageCopyForVaccine = async (vaccineName: VaccineTypes) => {
  const contentApiVaccineText = await getContentForVaccine(vaccineName);
  const description = contentApiVaccineText.hasPart.find(
    (part: ContentApiHasPart) =>
      part.hasHealthAspect === "http://schema.org/OverviewHealthAspect",
  ).description;

  const whatVaccineIsFor = extractTextFromAllPartsForAspect(
    contentApiVaccineText,
    "http://schema.org/BenefitsHealthAspect",
  );

  return {
    overview: description,
    whatVaccineIsFor,
  };
};

export { getPageCopyForVaccine };
