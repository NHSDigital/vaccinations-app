import dotenv from "dotenv";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { VaccineTypes } from "@src/models/vaccine";
import { EligibilityStatus } from "@src/services/eligibility-api/types";

describe("EliD API contract", () => {
  beforeAll(async () => {
    dotenv.config({ path: ".env.local" });
  });

  describe("EliD call over the wire", () => {
    const testCases = [
      {nhsNumber: "9686368973", expectedStatus: EligibilityStatus.ACTIONABLE, expectCohortElement: true},
      {nhsNumber: "9658218989", expectedStatus: EligibilityStatus.ALREADY_VACCINATED, expectCohortElement: false},
      {nhsNumber: "9657933617", expectedStatus: EligibilityStatus.NOT_ELIGIBLE, expectCohortElement: true},
    ];

    test.each(testCases)("$nhsNumber should be $expectedStatus with cohort $expectCohortElement", async ({nhsNumber, expectedStatus, expectCohortElement}) => {
      const eligibilityForPerson = await getEligibilityForPerson(VaccineTypes.RSV, nhsNumber);

      expect(Object.keys(eligibilityForPerson).length).toEqual(2);
      expect(eligibilityForPerson.eligibility?.status).toEqual(expectedStatus);
      if (expectCohortElement) {
        expect(eligibilityForPerson.eligibility?.content.summary?.cohorts).toBeDefined();
      } else {
        expect(eligibilityForPerson.eligibility?.content.summary?.cohorts).toBeUndefined();
      }
      expect(eligibilityForPerson.eligibilityError).toBeUndefined();
    });
  });
});
