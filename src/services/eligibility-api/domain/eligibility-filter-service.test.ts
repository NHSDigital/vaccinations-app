import {
  _generateBulletPoints,
  _getStatus,
  getEligibilityForPerson,
} from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { VaccineTypes } from "@src/models/vaccine";
import {
  EligibilityStatus,
  EligibilityForPerson,
  EligibilityErrorTypes,
} from "@src/services/eligibility-api/types";
import {
  mockEligibilityContent,
  mockEligibilityResponse,
  mockEligibilityResponseWithoutCohorts,
} from "@test-data/eligibility-api/data";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { auth } from "@project/auth";
import { ProcessedSuggestion } from "@src/services/eligibility-api/api-types";

jest.mock(
  "@src/services/eligibility-api/gateway/fetch-eligibility-content",
  () => ({
    fetchEligibilityContent: jest.fn(),
  }),
);
jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));

describe("eligibility-filter-service", () => {
  beforeEach(() => {
    (auth as jest.Mock).mockResolvedValue({
      user: {
        nhs_number: "test_nhs_number",
        birthdate: new Date(),
      },
    });
  });
  describe("getEligibilityForPerson", () => {
    it("should convert Eligibility API response into eligibility status and content", async () => {
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(
        mockEligibilityResponse,
      );

      const result: EligibilityForPerson = await getEligibilityForPerson(
        VaccineTypes.RSV,
      );

      expect(result.eligibilityStatus).toEqual(EligibilityStatus.NOT_ELIGIBLE);
      expect(result.eligibilityContent).toEqual(mockEligibilityContent);
      expect(result.eligibilityError).toEqual(undefined);
    });

    it("should not give content when eligibilityCohorts array is empty", async () => {
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(
        mockEligibilityResponseWithoutCohorts,
      );

      const result: EligibilityForPerson = await getEligibilityForPerson(
        VaccineTypes.RSV,
      );

      expect(result.eligibilityStatus).toEqual(EligibilityStatus.NOT_ELIGIBLE);
      expect(result.eligibilityContent).toEqual(undefined);
      expect(result.eligibilityError).toEqual(undefined);
    });

    it("should return error, empty eligibility, and undefined content when session isn't available", async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      const result: EligibilityForPerson = await getEligibilityForPerson(
        VaccineTypes.RSV,
      );

      expect(result.eligibilityStatus).toEqual(EligibilityStatus.EMPTY);
      expect(result.eligibilityContent).toEqual(undefined);
      expect(result.eligibilityError).toEqual(
        EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
      );
    });

    it("should return empty eligibility, and undefined content and error when fetchEligibilityForPerson returns undefined", async () => {
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(undefined);

      const result: EligibilityForPerson = await getEligibilityForPerson(
        VaccineTypes.RSV,
      );

      expect(result.eligibilityStatus).toEqual(EligibilityStatus.EMPTY);
      expect(result.eligibilityContent).toBeUndefined();
      expect(result.eligibilityError).toBeUndefined();
    });
  });

  describe("_generateBulletPoints", () => {
    it("should return only the bullet points when cohortStatus is identical to status", () => {
      const suggestion: ProcessedSuggestion = {
        condition: "RSV",
        status: "NotEligible",
        statusText: "you are not eligible because",
        eligibilityCohorts: [
          {
            cohortCode: "rsv_age_rolling",
            cohortText: "first bullet point",
            cohortStatus: "NotEligible",
          },
          {
            cohortCode: "rsv_age_rolling",
            cohortText: "second bullet point",
            cohortStatus: "Actionable",
          },
        ],
      };

      const result: string[] | undefined = _generateBulletPoints(suggestion);

      expect(result).toEqual(["first bullet point"]);
    });

    it("should return undefined when eligibilityCohorts attribute is missing", () => {
      const suggestion = {
        condition: "RSV",
        status: "NotEligible",
        statusText: "you are not eligible because",
      } as ProcessedSuggestion;

      const result: string[] | undefined = _generateBulletPoints(suggestion);

      expect(result).toEqual(undefined);
    });

    it("should return undefined when eligibilityCohorts are empty array", () => {
      const suggestion: ProcessedSuggestion = {
        condition: "RSV",
        status: "NotEligible",
        statusText: "you are not eligible because",
        eligibilityCohorts: [],
      };

      const result: string[] | undefined = _generateBulletPoints(suggestion);

      expect(result).toEqual(undefined);
    });
  });

  describe("_getStatus", () => {
    it("should return correct eligibility status", () => {
      const suggestion: ProcessedSuggestion = {
        condition: "RSV",
        status: "NotEligible",
        statusText: "you are not eligible because",
        eligibilityCohorts: [],
      };

      const result: EligibilityStatus = _getStatus(suggestion);

      expect(result).toEqual(EligibilityStatus.NOT_ELIGIBLE);
    });

    it("should return empty for any other eligibility statuses", () => {
      const suggestion: ProcessedSuggestion = {
        condition: "RSV",
        status: "Actionable",
        statusText: "you are not eligible because",
        eligibilityCohorts: [],
      };

      const result: EligibilityStatus = _getStatus(suggestion);

      expect(result).toEqual(EligibilityStatus.EMPTY);
    });
  });
});
