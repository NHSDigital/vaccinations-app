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

const getPageCopyForVaccine = async (vaccineName: VaccineTypes) => {
  const contentApiVaccineText = await getContentForVaccine(vaccineName);
  const description = contentApiVaccineText.hasPart.find(
    (part: ContentApiHasPart) =>
      part.hasHealthAspect === "http://schema.org/OverviewHealthAspect",
  ).description;
  return {
    overview: description,
  };
};

export { getPageCopyForVaccine };
