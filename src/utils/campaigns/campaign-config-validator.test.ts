import {
  validateCampaignConfig,
  validateCampaignConfigForEnvironment,
} from "@src/utils/campaigns/campaign-config-validator";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("CampaignConfigValidator", () => {
  describe("validateCampaignConfigForEnvironment", () => {
    // this is the actual functional test for now... (likely moving up a layer later);
    // can we mock fs here? it's reading the file system so prob. not much we can do to test the file reading part of the test
    it("dev: Campaign Preopen dates should be valid for each vaccine", () => {
      validateCampaignConfigForEnvironment("dev");
    });
  });

  describe("validateCampaignConfig", () => {
    const mockEnvName = "unitTestEnv";

    it("should succeed if campaign config preopen dates are valid for all vaccines", () => {
      const validCampaignConfigString =
        '{"COVID_19": [{ "preStart": "2025-11-09T09:00:00Z", "start": "2025-11-12T09:00:00Z", "end": "2026-01-31T17:00:00Z" }, { "preStart": "2026-01-07T08:00:00Z", "start": "2026-04-13T08:00:00Z", "end": "2026-06-30T16:00:00Z" }], "FLU_FOR_ADULTS": [{ "preStart": "2026-03-01T08:00:00Z", "start": "2026-03-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }], "FLU_FOR_CHILDREN_AGED_2_TO_3": [{ "preStart": "2025-10-01T08:00:00Z", "start": "2025-10-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }], "FLU_IN_PREGNANCY": [{ "preStart": "2025-10-01T08:00:00Z", "start": "2025-10-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }]}';
      validateCampaignConfig(validCampaignConfigString, mockEnvName);
    });

    it("should fail if campaign config preopen dates are invalid for flu", () => {
      const invalidFluCampaignConfigString =
        '{"COVID_19": [{ "preStart": "2025-11-09T09:00:00Z", "start": "2025-11-12T09:00:00Z", "end": "2026-01-31T17:00:00Z" }, { "preStart": "2026-01-07T08:00:00Z", "start": "2026-04-13T08:00:00Z", "end": "2026-06-30T16:00:00Z" }], "FLU_FOR_ADULTS": [{ "preStart": "2026-02-21T08:00:00Z", "start": "2026-03-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }], "FLU_FOR_CHILDREN_AGED_2_TO_3": [{ "preStart": "2025-10-01T08:00:00Z", "start": "2025-10-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }], "FLU_IN_PREGNANCY": [{ "preStart": "2025-10-01T08:00:00Z", "start": "2025-10-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }]}';

      expect(() => {
        validateCampaignConfig(invalidFluCampaignConfigString, mockEnvName);
      }).toThrow("nope");
    });
  });
});
