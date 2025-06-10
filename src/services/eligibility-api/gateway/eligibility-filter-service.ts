import { VaccineTypes } from "@src/models/vaccine";
import {
  EligibilityStatus,
  GetEligibilityForPersonResponse,
} from "@src/services/eligibility-api/types";

const getEligibilityForPerson = async (
  nhsNumber: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  vaccineType: VaccineTypes, // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<GetEligibilityForPersonResponse> => {
  const styledEligibilityContent = {
    heading: "dummy heading",
    content: "dummy content",
  };

  return {
    eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
    styledEligibilityContent,
    eligibilityError: undefined,
  };
};

export { getEligibilityForPerson };
