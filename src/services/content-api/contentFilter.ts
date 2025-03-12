import { getContentForVaccine } from "@src/services/content-api/contentService";
import { VaccineTypes } from "@src/models/vaccine";

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
  aspect: string,
) => {
  const aspectInfo = contentApiVaccineText.hasPart.find(
    (part: ContentApiHasPart) => part.hasHealthAspect.endsWith(aspect),
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
      part.hasHealthAspect.endsWith("OverviewHealthAspect"),
  ).description;

  const whatVaccineIsFor = extractTextFromAllPartsForAspect(
    contentApiVaccineText,
    "BenefitsHealthAspect",
  );

  return {
    overview: description,
    whatVaccineIsFor,
  };
};

export { getPageCopyForVaccine };
