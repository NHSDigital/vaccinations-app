import { buildFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { HeadingWithContent, HeadingWithTypedContent, VaccinePageContent } from "@src/services/content-api/types";

export const buildFilteredContentForFluForChildrenVaccine = async (apiContent: string): Promise<VaccinePageContent> => {
  const standardFilteredContent = await buildFilteredContentForStandardVaccine(apiContent);

  const callout: HeadingWithTypedContent = {
    heading: "Booking service closed",
    content: "Flu vaccine bookings will reopen in autumn 2026",
    contentType: "string",
  };

  const recommendation: HeadingWithContent = {
    heading: "The flu vaccine is recommended for children who:",
    content: ["* are aged 2 or 3 years (born between September 2021 and 31 August 2023)"].join("\n"),
  };
  return { ...standardFilteredContent, callout, recommendation };
};
