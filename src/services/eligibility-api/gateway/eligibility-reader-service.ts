import { VaccineTypes } from "@src/models/vaccine";
import { GetEligibilityForPersonResponse } from "@src/services/eligibility-api/types";

const getEligibilityForPerson = async (
  nhsNumber: string,
  vaccineType: VaccineTypes,
): Promise<GetEligibilityForPersonResponse> => {
  const styledEligibilityContent = { dummy: "dummy" };

  return { styledEligibilityContent, eligibilityError: undefined };
};

export { getEligibilityForPerson };
