import { validateCampaignConfig } from "@src/utils/campaigns/campaign-config-validator";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("CampaignConfigValidator", () => {
  describe("validateCampaignConfig", () => {
    const mockEnvName = "unitTestEnv";

    it("should succeed if campaign config PreOpen dates are valid for all vaccines", () => {
      const validCampaignConfigString =
        '{"COVID_19": [{ "preStart": "2025-11-09T09:00:00Z", "start": "2025-11-12T09:00:00Z", "end": "2026-01-31T17:00:00Z" }, { "preStart": "2026-04-12T08:00:00Z", "start": "2026-04-13T08:00:00Z", "end": "2026-06-30T16:00:00Z" }], "FLU_FOR_ADULTS": [{ "preStart": "2026-03-01T08:00:00Z", "start": "2026-03-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }], "FLU_FOR_CHILDREN_AGED_2_TO_3": [{ "preStart": "2025-10-01T08:00:00Z", "start": "2025-10-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }], "FLU_IN_PREGNANCY": [{ "preStart": "2025-10-01T08:00:00Z", "start": "2025-10-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }]}';
      const validateOutcome = validateCampaignConfig(validCampaignConfigString, mockEnvName);
      expect(validateOutcome.success).toEqual(true);
      expect(validateOutcome.environment).toEqual(mockEnvName);
      expect(validateOutcome.errors.length).toEqual(0);
    });

    it("should fail if campaign config PreOpen dates are invalid for flu", () => {
      const invalidFluCampaignConfigString =
        '{"COVID_19": [{ "preStart": "2025-11-09T09:00:00Z", "start": "2025-11-12T09:00:00Z", "end": "2026-01-31T17:00:00Z" }, { "preStart": "2026-04-12T08:00:00Z", "start": "2026-04-13T08:00:00Z", "end": "2026-06-30T16:00:00Z" }], "FLU_FOR_ADULTS": [{ "preStart": "2026-02-21T08:00:00Z", "start": "2026-03-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }], "FLU_FOR_CHILDREN_AGED_2_TO_3": [{ "preStart": "2025-10-01T08:00:00Z", "start": "2025-10-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }], "FLU_IN_PREGNANCY": [{ "preStart": "2025-10-01T08:00:00Z", "start": "2025-10-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }]}';

      const validateOutcome = validateCampaignConfig(invalidFluCampaignConfigString, mockEnvName);
      expect(validateOutcome.success).toEqual(false);
      expect(validateOutcome.environment).toEqual(mockEnvName);
      expect(validateOutcome.errors.length).toEqual(1);
      expect(validateOutcome.errors[0]).toEqual("FLU_FOR_ADULTS: Invalid preopen date");
    });

    it("should fail if campaign dates overlap", () => {
      const overlappingDatesCampaignConfigString =
        '{"COVID_19": [{ "preStart": "2025-11-09T09:00:00Z", "start": "2025-11-12T09:00:00Z", "end": "2026-01-31T17:00:00Z" }, { "preStart": "2026-01-12T08:00:00Z", "start": "2026-04-13T08:00:00Z", "end": "2026-06-30T16:00:00Z" }], "FLU_FOR_ADULTS": [{ "preStart": "2026-03-01T08:00:00Z", "start": "2026-03-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }], "FLU_FOR_CHILDREN_AGED_2_TO_3": [{ "preStart": "2025-10-01T08:00:00Z", "start": "2025-10-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }], "FLU_IN_PREGNANCY": [{ "preStart": "2025-10-01T08:00:00Z", "start": "2025-10-01T08:00:00Z", "end": "2026-03-31T16:00:00Z" }]}';

      // TODO VIA-851 Improve logging of validation failures from zod (reason is currently hidden)
      const validateOutcome = validateCampaignConfig(overlappingDatesCampaignConfigString, mockEnvName);

      expect(validateOutcome.success).toEqual(false);
      expect(validateOutcome.environment).toEqual(mockEnvName);
      expect(validateOutcome.errors.length).toEqual(1);
      expect(validateOutcome.errors[0]).toEqual(
        "Unable to parse campaign file - config either contains invalid JSON or does not meet Zod runtime schema rules",
      );
    });

    it("should fail if unable to parse campaign config", () => {
      const invalidCampaignConfigString = '{"Invalid-Config": ""}';

      const validateOutcome = validateCampaignConfig(invalidCampaignConfigString, mockEnvName);

      expect(validateOutcome.success).toEqual(false);
      expect(validateOutcome.environment).toEqual(mockEnvName);
      expect(validateOutcome.errors.length).toEqual(1);
      expect(validateOutcome.errors[0]).toEqual(
        "Unable to parse campaign file - config either contains invalid JSON or does not meet Zod runtime schema rules",
      );
    });
  });
});
