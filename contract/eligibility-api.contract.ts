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
      {nhsNumber: "9686368973", expectedStatus: EligibilityStatus.ACTIONABLE},
      {nhsNumber: "9658218989", expectedStatus: EligibilityStatus.ALREADY_VACCINATED},
      {nhsNumber: "9657933617", expectedStatus: EligibilityStatus.NOT_ELIGIBLE},
    ];

    test.each(testCases)('$nhsNumber should be $expectedStatus', async ({nhsNumber, expectedStatus}) => {
      const eligibilityForPerson = await getEligibilityForPerson(VaccineTypes.RSV, nhsNumber);

      expect(Object.keys(eligibilityForPerson).length).toEqual(2);
      expect(eligibilityForPerson.eligibility?.status).toEqual(expectedStatus);
    });
  });
});
