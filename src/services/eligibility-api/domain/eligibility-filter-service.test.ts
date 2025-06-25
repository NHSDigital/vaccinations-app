import {
  _extractAllCohortText,
  _generateActions,
  _getStatus,
  getEligibilityForPerson,
} from "@src/services/eligibility-api/domain/eligibility-filter-service";
import { VaccineTypes } from "@src/models/vaccine";
import {
  // TODO VIA-321 2025-06-25 resolve temporarily unused import  EligibilityErrorTypes,
  EligibilityForPerson,
  EligibilityStatus,
} from "@src/services/eligibility-api/types";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { ProcessedSuggestion } from "@src/services/eligibility-api/api-types";
import {
  actionBuilder,
  actionFromApiBuilder,
  eligibilityApiResponseBuilder,
  eligibilityCohortBuilder,
  eligibilityContentBuilder,
  processedSuggestionBuilder,
  statusContentBuilder,
} from "@test-data/eligibility-api/builders";

jest.mock(
  "@src/services/eligibility-api/gateway/fetch-eligibility-content",
  () => ({
    fetchEligibilityContent: jest.fn(),
  }),
);

const nhsNumber = "5123456789";

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
                  .andCohortText(
                    "You did not turn 80 between 2nd September 2024 and 31st August 2025",
                  )
                  .build(),
              ])
              .andActions([
                actionFromApiBuilder()
                  .withActionType("InfoText")
                  .andDescription("Text")
                  .build(),
              ])
              .build(),
          ])
          .build(),
      );

      const result: EligibilityForPerson = await getEligibilityForPerson(
        VaccineTypes.RSV,
        nhsNumber,
      );

      expect(result.eligibility.status).toEqual(EligibilityStatus.NOT_ELIGIBLE);
      expect(result.eligibility.content).toEqual(
        eligibilityContentBuilder()
          .withStatus(
            statusContentBuilder()
              .withHeading("We do not believe you should have this vaccine")
              .andIntroduction("This is because you:")
              .andPoints([
                "You are not aged 75 to 79 years old.",
                "You did not turn 80 between 2nd September 2024 and 31st August 2025",
              ])
              .build(),
          )
          .andActions([
            actionBuilder().withType("paragraph").andContent("Text").build(),
          ])
          .build(),
      );
      expect(result.eligibilityError).toEqual(undefined);
    });

    it("should not give content when eligibilityCohorts array is empty", async () => {
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(
        eligibilityApiResponseBuilder()
          .withProcessedSuggestions([
            processedSuggestionBuilder()
              .withCondition("RSV")
              .andStatus("NotEligible")
              .andEligibilityCohorts([])
              .build(),
          ])
          .build(),
      );

      const result: EligibilityForPerson = await getEligibilityForPerson(
        VaccineTypes.RSV,
        nhsNumber,
      );

      expect(result.eligibility.status).toEqual(EligibilityStatus.NOT_ELIGIBLE);
      expect(result.eligibility.content).toEqual(undefined);
      expect(result.eligibilityError).toEqual(undefined);
    });

    it("should return undefined error, eligibility and content when no suggestion is found for the vaccine", async () => {
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(
        eligibilityApiResponseBuilder().withProcessedSuggestions([]).build(),
      );

      const result: EligibilityForPerson = await getEligibilityForPerson(
        VaccineTypes.RSV,
        nhsNumber,
      );

      expect(result.eligibility.status).toEqual(undefined);
      expect(result.eligibility.content).toEqual(undefined);
      expect(result.eligibilityError).toEqual(undefined);
    });

    it("should return undefined eligibility, content and error when fetchEligibilityForPerson returns undefined", async () => {
      (fetchEligibilityContent as jest.Mock).mockResolvedValue(undefined);

      const result: EligibilityForPerson = await getEligibilityForPerson(
        VaccineTypes.RSV,
        nhsNumber,
      );

      expect(result.eligibility.status).toBeUndefined();
      expect(result.eligibility.content).toBeUndefined();
      expect(result.eligibilityError).toBeUndefined();
    });
  });

  describe("_generateBulletPoints", () => {
    it("should return all bullet points irrespective of cohortStatus", () => {
      const suggestion: ProcessedSuggestion = processedSuggestionBuilder()
        .withCondition("RSV")
        .andStatus("Actionable")
        .andEligibilityCohorts([
          eligibilityCohortBuilder()
            .withCohortStatus("Actionable")
            .andCohortText("test1")
            .build(),
          eligibilityCohortBuilder()
            .withCohortStatus("NotActionable")
            .andCohortText("test2")
            .build(),
        ])
        .build();

      const result: string[] | undefined = _extractAllCohortText(suggestion);
      expect(result).toEqual(["test1", "test2"]);
    });

    it("should return undefined when eligibilityCohorts attribute is missing", () => {
      const suggestion = {
        condition: "RSV",
        status: "NotEligible",
        statusText: "you are not eligible because",
      } as ProcessedSuggestion;

      const result: string[] | undefined = _extractAllCohortText(suggestion);

      expect(result).toEqual(undefined);
    });

    it("should return undefined when eligibilityCohorts are empty array", () => {
      const suggestion: ProcessedSuggestion = {
        condition: "RSV",
        status: "NotEligible",
        statusText: "you are not eligible because",
        eligibilityCohorts: [],
        actions: [],
      };

      const result: string[] | undefined = _extractAllCohortText(suggestion);

      expect(result).toEqual(undefined);
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

      expect(_getStatus(suggestion)).toEqual(EligibilityStatus.NOT_ELIGIBLE);
    });

    it("should return eligible status when status is actionable", () => {
      const suggestion: ProcessedSuggestion = {
        condition: "RSV",
        status: "Actionable",
        statusText: "you are not eligible because",
        eligibilityCohorts: [],
        actions: [],
      };

      const result: EligibilityStatus | undefined = _getStatus(suggestion);

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

      const result: EligibilityStatus | undefined = _getStatus(suggestion);

      expect(result).toEqual(EligibilityStatus.ALREADY_VACCINATED);
    });
  });

  describe("_getActions", () => {
    it("should filter actions and only return InfoText action type", async () => {
      const processedSuggestion: ProcessedSuggestion =
        processedSuggestionBuilder()
          .withActions([
            actionFromApiBuilder()
              .withActionType("InfoText")
              .andDescription("InfoText Markdown")
              .build(),
            actionFromApiBuilder()
              .withActionType("CardWithText")
              .andDescription("CardWithText Markdown")
              .build(),
          ])
          .build();

      const result = _generateActions(processedSuggestion);

      expect(result).toEqual([
        {
          type: "paragraph",
          content: "InfoText Markdown",
        },
      ]);
    });

    it("should ensure actions are returned in the same order", async () => {
      const processedSuggestion: ProcessedSuggestion =
        processedSuggestionBuilder()
          .withActions([
            actionFromApiBuilder()
              .withActionType("InfoText")
              .andDescription("InfoText Markdown 1")
              .build(),
            actionFromApiBuilder()
              .withActionType("InfoText")
              .andDescription("InfoText Markdown 2")
              .build(),
          ])
          .build();

      const result = _generateActions(processedSuggestion);

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

      const result = _generateActions(suggestion);

      expect(result).toEqual([]);
    });
  });
});
