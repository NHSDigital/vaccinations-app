import { NhsNumber, VaccineTypes } from "@src/models/vaccine";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import {
  EligibilityErrorTypes,
  EligibilityForPersonType,
  EligibilityStatus,
} from "@src/services/eligibility-api/types";
import dotenv from "dotenv";

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

describe("EliD API contract", () => {
  beforeAll(async () => {
    dotenv.config({ path: ".env.local" });
  });

  describe("successful EliD call over the wire", () => {
    const successTestCases = [
      { nhsNumber: "9686368973" as NhsNumber, expectedStatus: EligibilityStatus.ACTIONABLE, expectCohortElement: true },
      {
        nhsNumber: "9658218989" as NhsNumber,
        expectedStatus: EligibilityStatus.ALREADY_VACCINATED,
        expectCohortElement: false,
      },
      {
        nhsNumber: "9657933617" as NhsNumber,
        expectedStatus: EligibilityStatus.NOT_ELIGIBLE,
        expectCohortElement: true,
      },
    ];

    test.each(successTestCases)(
      "$nhsNumber should be $expectedStatus with cohort $expectCohortElement",
      async ({ nhsNumber, expectedStatus, expectCohortElement }) => {
        const eligibilityForPerson = await getEligibilityForPerson(VaccineTypes.RSV, nhsNumber);

        expect(Object.keys(eligibilityForPerson).length).toEqual(2);
        expect(eligibilityForPerson.eligibility?.status).toEqual(expectedStatus);
        if (expectCohortElement) {
          expect(eligibilityForPerson.eligibility?.content.summary?.cohorts).toBeDefined();
        } else {
          expect(eligibilityForPerson.eligibility?.content.summary?.cohorts).toBeUndefined();
        }
        expect(eligibilityForPerson.eligibilityError).toBeUndefined();
      },
    );
  });

  describe("HTTP Status exception", () => {
    const failureTestCases = [
      { nhsNumber: "9800878378" as NhsNumber, expectedError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR },
      { nhsNumber: "9661033404" as NhsNumber, expectedError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR },
      { nhsNumber: "9451019030" as NhsNumber, expectedError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR },
      { nhsNumber: "9436793375" as NhsNumber, expectedError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR },
    ];

    it.each(failureTestCases)(`$nhsNumber should have error $expectedError `, async ({ nhsNumber, expectedError }) => {
      const eligibilityForPerson: EligibilityForPersonType = await getEligibilityForPerson(VaccineTypes.RSV, nhsNumber);

      expect(Object.keys(eligibilityForPerson).length).toEqual(2);
      expect(eligibilityForPerson.eligibility).toBeUndefined();
      expect(eligibilityForPerson.eligibilityError).toEqual(expectedError);
    });
  });
});
