import { validateCampaignConfigForEnvironment } from "@src/utils/campaigns/campaign-config-validator";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("validateCampaignConfigForAllEnvironments", () => {
  const ENVIRONMENTS = ["dev", "test", "preprod", "prod"];

  it.each(ENVIRONMENTS)("%s: validate campaign config Preopen dates", (environment: string) => {
    validateCampaignConfigForEnvironment(environment);
  });
});
