import { buildFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { HeadingWithContent, VaccinePageContent } from "@src/services/content-api/types";

export const buildFilteredContentForFluForSchoolAgedChildrenVaccine = async (
  apiContent: string,
): Promise<VaccinePageContent> => {
  const standardFilteredContent = await buildFilteredContentForStandardVaccine(apiContent);

  const overviewConclusion = {
    content:
      '<h2 class="nhsuk-heading-m">How to get the vaccine</h2>' +
      '<div class="block-richtext">' +
      "<p>Most school-aged children (Reception to Year 11) get their flu vaccine at school.</p>" +
      "<p>You should get an invitation from your child's school or the School Age Immunisation Service to get their vaccine, usually during the autumn term.</p>" +
      "<p>If your child misses their vaccination at school or if they are home educated (home-schooled), they should be offered a flu vaccine at a community clinic.</p>" +
      "<p>If your child is 4 years old but has not started school yet, they can get vaccinated at either:</p>" +
      "<ul><li>a community clinic – if they turned 4 years of age on or before 31 August 2025</li><li>their GP surgery or a pharmacy that offers flu vaccination – if they turned 4 years of age after 31 August 2025</li></ul>" +
      "</div>",
    containsHtml: true,
  };

  const recommendation: HeadingWithContent = {
    heading: "The flu vaccine is recommended for children who:",
    content: ["* are of school age (Reception to Year 11)"].join("\n"),
  };
  return { ...standardFilteredContent, recommendation, overviewConclusion };
};
