import { NhsNumber, VaccineTypes } from "@src/models/vaccine";
import { ActionType, ProcessedSuggestion } from "@src/services/eligibility-api/api-types";
import {
  _extractAllCohortText,
  _generateActions,
  _generateSuitabilityRules,
  _getStatus,
  getEligibilityForPerson,
} from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { EligibilityApiHttpStatusError } from "@src/services/eligibility-api/gateway/exceptions";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import {
  ActionDisplayType,
  EligibilityErrorTypes,
  EligibilityForPersonType,
  EligibilityStatus,
  RuleDisplayType,
} from "@src/services/eligibility-api/types";
import {
  actionFromApiBuilder,
  eligibilityApiResponseBuilder,
  eligibilityCohortBuilder,
  processedSuggestionBuilder,
  suitabilityRuleFromApiBuilder,
} from "@test-data/eligibility-api/builders";

jest.mock("@src/services/eligibility-api/gateway/fetch-eligibility-content", () => ({
  fetchEligibilityContent: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

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
              .andSuitabilityRules([
                suitabilityRuleFromApiBuilder().withRuleCode("AlreadyVaccinated").andRuleText("Test").build(),
              ])
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
        actions: [{ type: ActionDisplayType.infotext, content: "Text", delineator: true }],
        suitabilityRules: [{ content: "Test", type: RuleDisplayType.card, delineator: false }],
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

    it("should not give content when eligibilityCohorts array is empty", async () => {
      const status = "NotEligible";
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(
        eligibilityApiResponseBuilder()
          .withProcessedSuggestions([
            processedSuggestionBuilder()
              .withCondition("RSV")
              .andStatus(status)
              .andEligibilityCohorts([])
              .andSuitabilityRules([suitabilityRuleFromApiBuilder().withRuleCode("AlreadyVaccinated").build()])
              .build(),
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
        suitabilityRules: [],
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
        suitabilityRules: [],
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
        suitabilityRules: [],
      };

      const result: EligibilityStatus | undefined = _getStatus(suggestion, nhsNumber);

      expect(result).toEqual(EligibilityStatus.NOT_ACTIONABLE);
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
            .andUrl(new URL("https://test.example.com/foo/bar/"))
            .build(),
        ])
        .build();

      const result = _generateActions(processedSuggestion, nhsNumber);

      expect(result).toEqual([
        { type: ActionDisplayType.infotext, content: "InfoText Markdown", delineator: true },
        { type: ActionDisplayType.card, content: "CardWithText Markdown", delineator: false },
        {
          type: ActionDisplayType.authButton,
          content: "ButtonWithAuthLink Markdown",
          button: { label: "Button Label", url: new URL("https://test.example.com/foo/bar/") },
          delineator: true,
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

      const result = _generateActions(processedSuggestion, nhsNumber);

      expect(result).toEqual([
        { type: RuleDisplayType.infotext, content: "InfoText Markdown 1", delineator: true },
        { type: RuleDisplayType.infotext, content: "InfoText Markdown 2", delineator: true },
      ]);
    });

    it("should return infotext card for unrecognised action types", async () => {
      const processedSuggestion: ProcessedSuggestion = processedSuggestionBuilder()
        .withActions([
          actionFromApiBuilder()
            .withActionType("SomeNewActionType" as ActionType)
            .andDescription("InfoText Markdown")
            .build(),
        ])
        .build();

      const result = _generateActions(processedSuggestion, nhsNumber);
      expect(result).toEqual([{ type: RuleDisplayType.infotext, content: "InfoText Markdown", delineator: true }]);
    });
  });

  describe("_generateSuitabilityRules", () => {
    it("should filter suitability rules and return correct suitabilityRule types", async () => {
      const processedSuggestion: ProcessedSuggestion = processedSuggestionBuilder()
        .withSuitabilityRules([
          suitabilityRuleFromApiBuilder()
            .withRuleCode("AlreadyVaccinated")
            .andRuleText("AlreadyVaccinated Markdown")
            .build(),
          suitabilityRuleFromApiBuilder().withRuleCode("OtherSetting").andRuleText("OtherSetting Markdown").build(),
        ])
        .build();

      const result = _generateSuitabilityRules(processedSuggestion, nhsNumber);

      expect(result).toEqual([
        { type: RuleDisplayType.card, content: "AlreadyVaccinated Markdown", delineator: false },
        { type: RuleDisplayType.infotext, content: "OtherSetting Markdown", delineator: true },
      ]);
    });

    it("should ensure suitability rules are returned in the same order", async () => {
      const processedSuggestion: ProcessedSuggestion = processedSuggestionBuilder()
        .withSuitabilityRules([
          suitabilityRuleFromApiBuilder()
            .withRuleCode("AlreadyVaccinated")
            .andRuleText("AlreadyVaccinated Markdown 1")
            .build(),
          suitabilityRuleFromApiBuilder()
            .withRuleCode("AlreadyVaccinated")
            .andRuleText("AlreadyVaccinated Markdown 2")
            .build(),
        ])
        .build();

      const result = _generateSuitabilityRules(processedSuggestion, nhsNumber);

      expect(result).toEqual([
        { type: RuleDisplayType.card, content: "AlreadyVaccinated Markdown 1", delineator: false },
        { type: RuleDisplayType.card, content: "AlreadyVaccinated Markdown 2", delineator: false },
      ]);
    });

    it("should display unknown rule codes as infotext", async () => {
      const processedSuggestion: ProcessedSuggestion = processedSuggestionBuilder()
        .withSuitabilityRules([
          suitabilityRuleFromApiBuilder().withRuleCode("TooClose").andRuleText("TooClose Markdown").build(),
        ])
        .build();

      const result = _generateSuitabilityRules(processedSuggestion, nhsNumber);

      expect(result).toEqual([{ type: RuleDisplayType.infotext, content: "TooClose Markdown", delineator: true }]);
    });
  });
});
