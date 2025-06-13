import {
  _generateBulletPoints,
  _getStatus,
  getEligibilityForPerson,
} from "@src/services/eligibility-api/gateway/eligibility-filter-service";
import { VaccineTypes } from "@src/models/vaccine";
import {
  EligibilityStatus,
  EligibilityForPerson,
  ProcessedSuggestion,
} from "@src/services/eligibility-api/types";
import {
  mockEligibilityContent,
  mockEligibilityResponse,
  mockEligibilityResponseWithoutCohorts,
} from "@test-data/eligibility-api/data";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";

jest.mock("@src/services/eligibility-api/gateway/fetch-eligibility-content");

describe("eligibility-filter-service", () => {
  describe("getEligibilityForPerson", () => {
    it("should convert Eligibility API response into eligibility status and content", async () => {
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(
        mockEligibilityResponse,
      );

      const result: EligibilityForPerson = await getEligibilityForPerson(
        "900001234",
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
        "900001234",
        VaccineTypes.RSV,
      );

      expect(result.eligibilityStatus).toEqual(EligibilityStatus.NOT_ELIGIBLE);
      expect(result.eligibilityContent).toEqual(undefined);
      expect(result.eligibilityError).toEqual(undefined);
    });
  });

  describe("_generateBulletPoints", () => {
    it("should return all bullet points when eligibilityCohorts are defined", () => {
      const suggestion: ProcessedSuggestion = {
        condition: "RSV",
        status: "NotEligible",
        statusText: "you are not eligible because",
        eligibilityCohorts: [
          {
            cohortCode: "rsv_age_rolling",
            cohortText: "first bullet point",
            cohortStatus: "nonEligible",
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
