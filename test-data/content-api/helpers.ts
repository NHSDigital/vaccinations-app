import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";
import { ContentApiVaccineResponse } from "@src/services/content-api/types";

const contentWithoutBenefitsHealthAspect = () => {
  const responseWithoutBenefitsHealthAspect: ContentApiVaccineResponse = {
    ...genericVaccineContentAPIResponse,
    mainEntityOfPage:
      genericVaccineContentAPIResponse.mainEntityOfPage.filter(
        (page) =>
          page.hasHealthAspect !== "http://schema.org/BenefitsHealthAspect"
      )
  };
  return responseWithoutBenefitsHealthAspect;
}

export {contentWithoutBenefitsHealthAspect}
