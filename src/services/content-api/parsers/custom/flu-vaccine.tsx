import { buildFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { HeadingWithContent, HeadingWithTypedContent, VaccinePageContent } from "@src/services/content-api/types";

export const buildFilteredContentForFluVaccine = (apiContent: string): VaccinePageContent => {
  const standardFilteredContent = buildFilteredContentForStandardVaccine(apiContent);

  const callout: HeadingWithTypedContent = {
    heading: "Booking service closed",
    content: "Flu vaccine bookings will reopen in autumn 2026",
    contentType: "string",
  };

  const recommendation: HeadingWithContent = {
    heading: "The flu vaccine is recommended if you:",
    content: [
      "* are aged 65 or older (including those who will be 65 by 31 March 2026",
      "* have certain long-term health conditions",
      "* are pregnant",
      "* live in a care home",
      "* are the main carer for an older or disabled person, or receive a carer's allowance",
      "* live with someone who has a weakened immune system",
    ].join("\n"),
  };
  return { ...standardFilteredContent, callout, recommendation };
};
