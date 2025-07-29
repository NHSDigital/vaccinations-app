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

  it("should throw ZodError with correct issues for unpopulated ProcessedSuggestion object", () => {
    // Given
    const apiResponse = { processedSuggestions: [{}] };

    // When
    try {
      EligibilityApiResponseSchema.parse(apiResponse);
      fail("Should have thrown ZodError");
    } catch (error) {
      // Then
      if (error instanceof ZodError) {
        expect(error.issues).toHaveLength(3);
      } else {
        fail("Should have thrown ZodError");
      }
    }
  });

  it("should return empty arrays for valid message with empty eligibilityCohorts, actions and suitabilityRules arrays", () => {
    // Given
    const apiResponse = {
      processedSuggestions: [
        { condition: "RSV", status: "NotActionable", statusText: "You should have the RSV vaccine" },
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
        { condition: "Sausages", status: "Actionable", statusText: "You should have the Sausages vaccine" },
      ],
    };

    // When
    try {
      EligibilityApiResponseSchema.parse(apiResponse);
      fail("Should have thrown ZodError");
    } catch (error) {
      // Then
      if (error instanceof ZodError) {
        expect(error.issues).toHaveLength(1);
        expect(error.issues[0]).toMatchObject({
          code: "invalid_value",
          path: ["processedSuggestions", 0, "condition"],
          message: 'Invalid input: expected "RSV"',
        });
      } else {
        fail("Should have thrown ZodError");
      }
    }
  });

  it("should throw ZodError for invalid status", () => {
    // Given
    const apiResponse = {
      processedSuggestions: [
        {
          condition: "RSV",
          status: "Sausages",
          statusText: "You should have the RSV vaccine",
        },
      ],
    };

    // When
    try {
      EligibilityApiResponseSchema.parse(apiResponse);
      fail("Should have thrown ZodError");
    } catch (error) {
      // Then
      if (error instanceof ZodError) {
        expect(error.issues).toHaveLength(1);
        expect(error.issues[0]).toMatchObject({
          code: "invalid_value",
          path: ["processedSuggestions", 0, "status"],
          message: 'Invalid option: expected one of "NotEligible"|"NotActionable"|"Actionable"',
        });
      } else {
        fail("Should have thrown ZodError");
      }
    }
  });

  it("should throw ZodError for missing statusText", () => {
    // Given
    const apiResponse = { processedSuggestions: [{ condition: "RSV", status: "Actionable" }] };

    // When
    try {
      EligibilityApiResponseSchema.parse(apiResponse);
      fail("Should have thrown ZodError");
    } catch (error) {
      // Then
      if (error instanceof ZodError) {
        expect(error.issues).toHaveLength(1);
        expect(error.issues[0]).toMatchObject({
          code: "invalid_type",
          path: ["processedSuggestions", 0, "statusText"],
          message: "Invalid input: expected string, received undefined",
        });
      } else {
        fail("Should have thrown ZodError");
      }
    }
  });

  it("should parse a fully populated valid response", () => {
    // Given
    const apiResponse = {
      processedSuggestions: [
        {
          condition: "RSV",
          status: "Actionable",
          statusText: "You are eligible for the RSV vaccine.",
          eligibilityCohorts: [
            {
              cohortCode: "AGE_75_79",
              cohortText: "Aged 75 to 79 years",
              cohortStatus: "Actionable",
            },
          ],
          actions: [
            {
              actionType: "ButtonWithAuthLink",
              description: "Book your appointment online.",
              urlLink: "https://www.nhs.uk/book-vaccine",
              urlLabel: "Book now",
            },
          ],
          suitabilityRules: [
            {
              ruleCode: "NotYetDue",
              ruleText: "You will be due for your vaccine soon.",
            },
          ],
        },
      ],
    };

    // When
    const actual = EligibilityApiResponseSchema.parse(apiResponse);

    // Then
    expect(actual).toEqual(apiResponse);
  });

  it("should throw ZodError for an invalid URL in an action", () => {
    // Given
    const apiResponse = {
      processedSuggestions: [
        {
          condition: "RSV",
          status: "Actionable",
          statusText: "Some text",
          actions: [{ actionType: "ButtonWithAuthLink", description: "Some desc", urlLink: "not-a-url" }],
        },
      ],
    };

    // When
    try {
      EligibilityApiResponseSchema.parse(apiResponse);
      fail("Should have thrown ZodError");
    } catch (error) {
      // Then
      if (error instanceof ZodError) {
        expect(error.issues).toHaveLength(1);
        expect(error.issues[0]).toMatchObject({
          code: "invalid_format",
          path: ["processedSuggestions", 0, "actions", 0, "urlLink"],
          message: "Invalid URL",
        });
      } else {
        fail("Should have thrown ZodError");
      }
    }
  });

  it("should throw ZodError for a missing cohortText in an eligibilityCohort", () => {
    // Given
    const apiResponse = {
      processedSuggestions: [
        {
          condition: "RSV",
          status: "NotEligible",
          statusText: "Some text",
          eligibilityCohorts: [{ cohortCode: "SomeCode", cohortStatus: "NotEligible" }],
        },
      ],
    };

    // When
    try {
      EligibilityApiResponseSchema.parse(apiResponse);
      fail("Should have thrown ZodError");
    } catch (error) {
      // Then
      if (error instanceof ZodError) {
        expect(error.issues).toHaveLength(1);
        expect(error.issues[0]).toMatchObject({
          code: "invalid_type",
          path: ["processedSuggestions", 0, "eligibilityCohorts", 0, "cohortText"],
          message: "Invalid input: expected string, received undefined",
        });
      } else {
        fail("Should have thrown ZodError");
      }
    }
  });
});
