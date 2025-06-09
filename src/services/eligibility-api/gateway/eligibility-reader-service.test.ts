import { getEligibilityContentForPerson } from "@src/services/eligibility-api/gateway/eligibility-reader-service";
import { VaccineTypes } from "@src/models/vaccine";
import {
  EligibilityStatus,
  GetEligibilityForPersonResponse,
} from "@src/services/eligibility-api/types";
import { expect } from "@playwright/test";
import { mockEligibilityResponse } from "@test-data/eligibility-api/data";

describe("getEligibilityContentForPerson", () => {
  it("return eligibility content for elderly person and RSV vaccine", async () => {
    const {
      eligibilityStatus,
      styledEligibilityContent,
      eligibilityError,
    }: GetEligibilityForPersonResponse = await getEligibilityContentForPerson(
      "5000000014",
      VaccineTypes.RSV,
    );

    expect(eligibilityStatus).toEqual(EligibilityStatus.NOT_ELIGIBLE);
    expect(styledEligibilityContent).toEqual(mockEligibilityResponse);
    expect(eligibilityError).toBeUndefined();
  });
});
