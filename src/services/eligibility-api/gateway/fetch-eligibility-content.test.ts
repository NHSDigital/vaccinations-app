/**
 * @jest-environment node
 */

import { expect } from "@playwright/test";
import { mockEligibilityResponse } from "@test-data/eligibility-api/data";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { AppConfig, configProvider } from "@src/utils/config";

jest.mock("@src/utils/config");

describe("getEligibilityContentForPerson", () => {
  const testApiKey: string = "api key";
  const testApiEndpoint: string =
    "http://localhost:8081/eligibility-signposting-api/"; // is wiremock, but will not work in CI/CD

  beforeEach(() => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        ELIGIBILITY_API_KEY: testApiKey,
        ELIGIBILITY_API_ENDPOINT: testApiEndpoint,
      }),
    );
  });

  it("return eligibility content for non-eligible person", async () => {
    const nhsNumber: string = "5000000014";

    const response = await fetchEligibilityContent(nhsNumber);

    expect(response).toEqual(mockEligibilityResponse);
  });
});
