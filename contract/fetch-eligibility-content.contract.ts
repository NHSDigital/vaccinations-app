import { NhsNumber } from "@src/models/vaccine";
import { EligibilityApiResponse } from "@src/services/eligibility-api/api-types";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { AppConfig } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";
import { readFileSync } from "fs";
import { pactWith } from "jest-pact";

jest.mock("@src/utils/config", () => ({
  configProvider: jest.fn((): Promise<AppConfig> => {
    const value: AppConfig = appConfigBuilder()
      .withELIGIBILITY_API_ENDPOINT(new URL("http://localhost:1234/"))
      .andELIGIBILITY_API_KEY("test-api-key")
      .build();
    return Promise.resolve(value);
  }),
}));

const successfulResponse: EligibilityApiResponse = {
  processedSuggestions: [
    {
      condition: "RSV",
      status: "NotActionable",
      statusText: "You should have the RSV vaccine",
      eligibilityCohorts: [],
      actions: [
        {
          actionType: "InfoText",
          description:
            "## If you think this is incorrect\n\nIf you have not had this vaccination and think you should, speak to your healthcare professional.\n\nFor anything else please see our [help and support page](https://www.nhs.uk/nhs-app/nhs-app-help-and-support/).",
          url: undefined,
          urlLabel: undefined,
        },
      ],
      suitabilityRules: [
        {
          ruleCode: "AlreadyVaccinated",
          ruleText: "## You've had your RSV vaccination\n\nWe believe you had the RSV vaccination on 3 April 2025.",
        },
      ],
    },
  ],
};

pactWith({ consumer: "VitA", provider: "EliD", port: 1234, logLevel: "warn" }, (provider) => {
  describe("EliD returns expected fields", () => {
    const mockNhsNumber = "9450114080" as NhsNumber;
    const vitaTraceId = "mock-trace-id";

    process.env._X_AMZN_TRACE_ID = vitaTraceId;

    const elidResponse = readFileSync(`./wiremock/__files/eligibility/9450114080.json`, "utf-8");

    const interaction = {
      given: "a patient with a valid NHS number exists",
      uponReceiving: "a request to check patient eligibility",
      withRequest: {
        method: "GET",
        path: `/eligibility-signposting-api/patient-check/${mockNhsNumber}`,
        headers: {
          accept: "application/json, application/fhir+json",
          apikey: "test-api-key",
          "X-Correlation-ID": vitaTraceId,
        },
      },
      willRespondWith: {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: elidResponse,
      },
    };

    beforeEach(() => {
      return provider.addInteraction(interaction as any);
    });

    it("fetches eligibility content successfully", async () => {
      const response = await fetchEligibilityContent(mockNhsNumber);
      expect(response).toEqual(successfulResponse);
    });
  });
});
