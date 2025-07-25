import { EligibilityApiResponseSchema } from "@src/services/eligibility-api/gateway/elid-schema";
import { ZodError } from "zod";

describe("elid-schema", () => {
  it("should return empty processedSuggestions array for valid message with no processedSuggestions", () => {
    // Given
    const apiResponse = {};

    // When
    const actual = EligibilityApiResponseSchema.parse(apiResponse);

    // Then
    expect(actual.processedSuggestions).toHaveLength(0);
  });

  it("should return empty processedSuggestions array for valid message with empty processedSuggestions array", () => {
    // Given
    const apiResponse = { processedSuggestions: [] };

    // When
    const actual = EligibilityApiResponseSchema.parse(apiResponse);

    // Then
    expect(actual.processedSuggestions).toHaveLength(0);
  });

  it("should throw ZodError for unpopulated ProcessedSuggestion object", () => {
    // Given
    const apiResponse = { processedSuggestions: [{}] };

    // When
    expect(() => {
      EligibilityApiResponseSchema.parse(apiResponse);
    }).toThrow(ZodError);
  });

  it("should return empty processedSuggestions array for valid message with empty processedSuggestions array", () => {
    // Given
    const apiResponse = {
      processedSuggestions: [
        {
          condition: "RSV",
          status: "NotActionable",
          statusText: "You should have the RSV vaccine",
        },
      ],
    };

    // When
    const actual = EligibilityApiResponseSchema.parse(apiResponse);

    // Then
    expect(actual.processedSuggestions[0].eligibilityCohorts).toHaveLength(0);
    expect(actual.processedSuggestions[0].actions).toHaveLength(0);
    expect(actual.processedSuggestions[0].suitabilityRules).toHaveLength(0);
  });

  it("should throw ZodError for invalid condition", () => {
    // Given
    const apiResponse = {
      processedSuggestions: [
        {
          condition: "Sausages",
          status: "Actionable",
          statusText: "You should have the Sausages vaccine",
        },
      ],
    };

    // When
    expect(() => {
      EligibilityApiResponseSchema.parse(apiResponse);
    }).toThrow(ZodError);
  });

  it("should throw ZodError for invalid status", () => {
    // Given
    const apiResponse = {
      processedSuggestions: [
        {
          condition: "RSV",
          status: "Whatever",
          statusText: "You should have the RSV vaccine",
        },
      ],
    };

    // When
    expect(() => {
      EligibilityApiResponseSchema.parse(apiResponse);
    }).toThrow(ZodError);
  });

  it("should throw ZodError for missing statusText", () => {
    // Given
    const apiResponse = {
      processedSuggestions: [
        {
          condition: "RSV",
          status: "Actionable",
        },
      ],
    };

    // When
    expect(() => {
      EligibilityApiResponseSchema.parse(apiResponse);
    }).toThrow(ZodError);
  });
});
