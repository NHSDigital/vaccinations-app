import { ContentApiVaccineResponse } from "@src/services/content-api/types";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

const contentWithoutBenefitsHealthAspect = () => {
  const responseWithoutBenefitsHealthAspect: ContentApiVaccineResponse = {
    ...genericVaccineContentAPIResponse,
    mainEntityOfPage: genericVaccineContentAPIResponse.mainEntityOfPage.filter(
      (page) => page.hasHealthAspect !== "http://schema.org/BenefitsHealthAspect",
    ),
  };
  return responseWithoutBenefitsHealthAspect;
};

const contentWithoutCallout = (): ContentApiVaccineResponse => {
  const responseWithoutCallout: ContentApiVaccineResponse = {
    ...genericVaccineContentAPIResponse,
    mainEntityOfPage: genericVaccineContentAPIResponse.mainEntityOfPage.map((section) => {
      // Callouts are nested deep inside 'section heading' elements
      if (section.hasPart && Array.isArray(section.hasPart)) {
        return {
          ...section,
          hasPart: section.hasPart.filter((element) => element.name !== "Callout"),
        };
      }
      return section;
    }),
  };
  return responseWithoutCallout;
};

export { contentWithoutBenefitsHealthAspect, contentWithoutCallout };
