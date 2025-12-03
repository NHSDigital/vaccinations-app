import { getFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { HeadingWithContent, VaccinePageContent } from "@src/services/content-api/types";

export const getFilteredContentForFluForSchoolAgedChildrenVaccine = (apiContent: string): VaccinePageContent => {
  const standardFilteredContent = getFilteredContentForStandardVaccine(apiContent);

  const recommendation: HeadingWithContent = {
    heading: "The flu vaccine is recommended for children who:",
    content: ["* are of school age (Reception to Year 1)"].join("\n"),
  };
  return { ...standardFilteredContent, recommendation };
};
