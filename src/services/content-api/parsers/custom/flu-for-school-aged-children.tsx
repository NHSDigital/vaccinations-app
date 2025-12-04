import { buildFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import {
  ExpanderSubsection,
  HeadingWithContent,
  VaccinePageContent,
  VaccinePageSubsection,
} from "@src/services/content-api/types";

export const buildFilteredContentForFluForSchoolAgedChildrenVaccine = (apiContent: string): VaccinePageContent => {
  const standardFilteredContent = buildFilteredContentForStandardVaccine(apiContent);

  const overviewConclusion: VaccinePageSubsection | undefined =
    standardFilteredContent.howToGetVaccine.subsections.find((subsection: VaccinePageSubsection) => {
      return subsection.type == "expanderElement" && subsection.headline.startsWith("School");
    }) as ExpanderSubsection | undefined;

  const recommendation: HeadingWithContent = {
    heading: "The flu vaccine is recommended for children who:",
    content: ["* are of school age (Reception to Year 1)"].join("\n"),
  };

  return {
    ...standardFilteredContent,
    recommendation,
    overviewConclusion: overviewConclusion?.mainEntity
      ? { content: overviewConclusion.mainEntity, containsHtml: true }
      : undefined,
  };
};
