import { NhsNumber, VaccineTypes } from "@src/models/vaccine";
import { ProcessedSuggestion } from "@src/services/eligibility-api/api-types";
import {
  _extractAllCohortText,
  _generateActions,
  _getStatus,
  getEligibilityForPerson,
} from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { EligibilityApiHttpStatusError } from "@src/services/eligibility-api/gateway/exceptions";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import {
  ActionType,
  EligibilityErrorTypes,
  EligibilityForPersonType,
  EligibilityStatus,
} from "@src/services/eligibility-api/types";
import {
  actionFromApiBuilder,
  eligibilityApiResponseBuilder,
  eligibilityCohortBuilder,
  processedSuggestionBuilder,
} from "@test-data/eligibility-api/builders";

jest.mock("@src/services/eligibility-api/gateway/fetch-eligibility-content", () => ({
  fetchEligibilityContent: jest.fn(),
}));

const nhsNumber = "5123456789" as NhsNumber;

describe("eligibility-filter-service", () => {
  describe("getEligibilityForPerson", () => {
    it("should convert Eligibility API response into eligibility status and content", async () => {
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(
        eligibilityApiResponseBuilder()
          .withProcessedSuggestions([
            processedSuggestionBuilder()
              .withCondition("RSV")
              .andStatus("NotEligible")
              .andStatusText("We do not believe you should have this vaccine")
              .andEligibilityCohorts([
                eligibilityCohortBuilder()
                  .withCohortStatus("NotEligible")
                  .andCohortText("You are not aged 75 to 79 years old.")
                  .build(),
                eligibilityCohortBuilder()
                  .withCohortStatus("NotEligible")
                  .andCohortText("You did not turn 80 between 2nd September 2024 and 31st August 2025")
                  .build(),
              ])
              .andActions([actionFromApiBuilder().withActionType("InfoText").andDescription("Text").build()])
              .build(),
          ])
          .build(),
      );

      const expectedEligibilityContent = {
        summary: {
          heading: "We do not believe you should have this vaccine",
          introduction: "This is because you:",
          cohorts: [
            "You are not aged 75 to 79 years old.",
            "You did not turn 80 between 2nd September 2024 and 31st August 2025",
          ],
        },
        actions: [
          {
            type: "paragraph",
            content: "Text",
          },
        ],
      };

      const result: EligibilityForPersonType = await getEligibilityForPerson(VaccineTypes.RSV, nhsNumber);

      expect(result.eligibility?.status).toEqual(EligibilityStatus.NOT_ELIGIBLE);
      expect(result.eligibility?.content).toEqual(expectedEligibilityContent);
      expect(result.eligibilityError).toEqual(undefined);
    });

    it("should return error response when no suggestion is found for the vaccine", async () => {
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(
        eligibilityApiResponseBuilder().withProcessedSuggestions([]).build(),
      );

      const result: EligibilityForPersonType = await getEligibilityForPerson(VaccineTypes.RSV, nhsNumber);

      expect(result.eligibility).toBeUndefined();
      expect(result.eligibilityError).toEqual(EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR);
    });

    it("should return status even if eligibilityCohorts attribute is missing", async () => {
      const status = "NotEligible";
      const statusText = "you are not eligible because";
      (fetchEligibilityContent as jest.Mock).mockResolvedValue({
        processedSuggestions: [
          {
            condition: "RSV",
            status: status,
            statusText: statusText,
          } as ProcessedSuggestion,
        ],
      });

      const result: EligibilityForPersonType = await getEligibilityForPerson(VaccineTypes.RSV, nhsNumber);

      expect(result.eligibility?.status).toBe(status);
      expect(result.eligibility?.content.summary).toBeUndefined();
      expect(result.eligibilityError).toBeUndefined();
    });

    it("should not give content when eligibilityCohorts array is empty", async () => {
      const status = "NotEligible";
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(
        eligibilityApiResponseBuilder()
          .withProcessedSuggestions([
            processedSuggestionBuilder().withCondition("RSV").andStatus(status).andEligibilityCohorts([]).build(),
          ])
          .build(),
      );

      const result: EligibilityForPersonType = await getEligibilityForPerson(VaccineTypes.RSV, nhsNumber);

      expect(result.eligibility?.status).toBe(status);
      expect(result.eligibility?.content.summary).toBeUndefined();
      expect(result.eligibilityError).toBeUndefined();
    });

    it("should return loading error when fetchEligibilityContent fails", async () => {
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(undefined);

      const result: EligibilityForPersonType = await getEligibilityForPerson(VaccineTypes.RSV, nhsNumber);

      expect(result.eligibility).toBeUndefined();
      expect(result.eligibilityError).toBe(EligibilityErrorTypes.UNKNOWN);
    });

    it("should return error response when call to fetchEligibilityContent throws error", async () => {
      (fetchEligibilityContent as jest.Mock).mockRejectedValue(
        new EligibilityApiHttpStatusError("Call to EliD failed"),
      );

      const result: EligibilityForPersonType = await getEligibilityForPerson(VaccineTypes.RSV, nhsNumber);

      expect(result.eligibility).toBeUndefined();
      expect(result.eligibilityError).toBe(EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR);
    });
  });

  describe("_extractAllCohortText", () => {
    it("should return all cohort text irrespective of cohortStatus", () => {
      const suggestion: ProcessedSuggestion = processedSuggestionBuilder()
        .withCondition("RSV")
        .andStatus("Actionable")
        .andEligibilityCohorts([
          eligibilityCohortBuilder().withCohortStatus("Actionable").andCohortText("test1").build(),
          eligibilityCohortBuilder().withCohortStatus("NotActionable").andCohortText("test2").build(),
        ])
        .build();

      const result: string[] | undefined = _extractAllCohortText(suggestion);
      expect(result).toEqual(["test1", "test2"]);
    });
  });

  describe("_getStatus", () => {
    it("should return non-eligible status when status is non-eligible", () => {
      const suggestion: ProcessedSuggestion = {
        condition: "RSV",
        status: "NotEligible",
        statusText: "you are not eligible because",
        eligibilityCohorts: [],
        actions: [],
      };

      expect(_getStatus(suggestion, nhsNumber)).toEqual(EligibilityStatus.NOT_ELIGIBLE);
    });

    it("should return eligible status when status is actionable", () => {
      const suggestion: ProcessedSuggestion = {
        condition: "RSV",
        status: "Actionable",
        statusText: "you are not eligible because",
        eligibilityCohorts: [],
        actions: [],
      };

      const result: EligibilityStatus | undefined = _getStatus(suggestion, nhsNumber);

      expect(result).toEqual(EligibilityStatus.ACTIONABLE);
    });

    it("should return eligible status when status is not-actionable", () => {
      const suggestion: ProcessedSuggestion = {
        condition: "RSV",
        status: "NotActionable",
        statusText: "you are not eligible because",
        eligibilityCohorts: [],
        actions: [],
      };

      const result: EligibilityStatus | undefined = _getStatus(suggestion, nhsNumber);

      expect(result).toEqual(EligibilityStatus.ALREADY_VACCINATED);
    });
  });

  describe("_generateActions", () => {
    it("should filter actions and return correct action types", async () => {
      const processedSuggestion: ProcessedSuggestion = processedSuggestionBuilder()
        .withActions([
          actionFromApiBuilder().withActionType("InfoText").andDescription("InfoText Markdown").build(),
          actionFromApiBuilder().withActionType("CardWithText").andDescription("CardWithText Markdown").build(),
          actionFromApiBuilder()
            .withActionType("ButtonWithAuthLink")
            .andDescription("ButtonWithAuthLink Markdown")
            .andUrlLabel("Button Label")
            .andUrlLink("https://test.example.com/foo/bar/")
            .build(),
        ])
        .build();

      const result = _generateActions(processedSuggestion, VaccineTypes.RSV, nhsNumber);

      expect(result).toEqual([
        {
          type: ActionType.paragraph,
          content: "InfoText Markdown",
        },
        {
          type: ActionType.card,
          content: "CardWithText Markdown",
        },
        {
          type: ActionType.authButton,
          content: "ButtonWithAuthLink Markdown",
          button: { label: "Button Label", url: new URL("https://test.example.com/foo/bar/") },
        },
      ]);
    });

    it("should ensure actions are returned in the same order", async () => {
      const processedSuggestion: ProcessedSuggestion = processedSuggestionBuilder()
        .withActions([
          actionFromApiBuilder().withActionType("InfoText").andDescription("InfoText Markdown 1").build(),
          actionFromApiBuilder().withActionType("InfoText").andDescription("InfoText Markdown 2").build(),
        ])
        .build();

      const result = _generateActions(processedSuggestion, VaccineTypes.RSV, nhsNumber);

      expect(result).toEqual([
        {
          type: "paragraph",
          content: "InfoText Markdown 1",
        },
        {
          type: "paragraph",
          content: "InfoText Markdown 2",
        },
      ]);
    });

    it("should return empty array when actions array is missing", async () => {
      const suggestion = {
        condition: "RSV",
        status: "Actionable",
        statusText: "you are not eligible because",
        eligibilityCohorts: [],
      } as unknown as ProcessedSuggestion;

      const result = _generateActions(suggestion, VaccineTypes.RSV, nhsNumber);

      expect(result).toEqual([]);
    });
  });
});
