import { Matchers } from "@pact-foundation/pact";
import { EligibilityApiResponse } from "@src/services/eligibility-api/api-types";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { AppConfig } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";
import { eligibilityApiResponseBuilder } from "@test-data/eligibility-api/builders";
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

pactWith({ consumer: "VitA", provider: "EliD", port: 1234, logLevel: "warn" }, (provider) => {
  describe("EliD returns expected fields", () => {
    const mockNhsNumber = "5123456789";
    const vitaTraceId = "mock-trace-id";

    process.env._X_AMZN_TRACE_ID = vitaTraceId;

    const successfulResponse: EligibilityApiResponse = eligibilityApiResponseBuilder().build();

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
        body: Matchers.like(successfulResponse),
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
