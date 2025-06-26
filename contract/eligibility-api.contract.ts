import dotenv from "dotenv";
import { getEligibilityForPerson } from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { VaccineTypes } from "@src/models/vaccine";
import { EligibilityStatus } from "@src/services/eligibility-api/types";

describe("EliD API contract", () => {
  beforeAll(async () => {
    dotenv.config({ path: ".env.local" });
  });

  describe("Actionable", () => {
    it("should be actionable ", async () => {
      const eligibilityForPerson = await getEligibilityForPerson(VaccineTypes.RSV, "9686368973");

      expect(Object.keys(eligibilityForPerson).length).toEqual(2);
      expect(eligibilityForPerson.eligibility.status).toEqual(EligibilityStatus.ACTIONABLE);
    });
  });

  describe("Not Actionable", () => {
    it("shouldn't be actionable - already vaccinated ", async () => {
      const eligibilityForPerson = await getEligibilityForPerson(VaccineTypes.RSV, "9658218989");

      expect(Object.keys(eligibilityForPerson).length).toEqual(2);
      expect(eligibilityForPerson.eligibility.status).toEqual(EligibilityStatus.ALREADY_VACCINATED);
    });
  });

  describe("Not Eligible", () => {
    it("shouldn't be eligible ", async () => {
      const eligibilityForPerson = await getEligibilityForPerson(VaccineTypes.RSV, "9657933617");

      expect(Object.keys(eligibilityForPerson).length).toEqual(2);
      expect(eligibilityForPerson.eligibility.status).toEqual(EligibilityStatus.NOT_ELIGIBLE);
    });
  });
});
