import { VaccineType } from "@src/models/vaccine";
import { getCampaignState } from "@src/utils/campaigns/campaign-state-evaluator";
import { CampaignState } from "@src/utils/campaigns/campaignState";
import { Campaigns } from "@src/utils/campaigns/types";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/config");

describe("Campaign helper", () => {
  const mockedConfig = config as ConfigMock;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-30T09:00:00Z"));
    const defaultConfig = configBuilder()
      .withCampaigns(
        Campaigns.fromJson(
          JSON.stringify({
            COVID_19: [
              // preopen
              { preStart: "2026-01-15T09:00:00Z", start: "2026-02-01T09:00:00Z", end: "2026-03-31T09:00:00Z" },
            ],
            FLU_FOR_ADULTS: [
              // open
              { preStart: "2026-01-15T09:00:00Z", start: "2026-01-15T09:00:00Z", end: "2026-03-31T09:00:00Z" },
            ],
            FLU_IN_PREGNANCY: [
              // closed
              { preStart: "2025-11-30T09:00:00Z", start: "2025-11-30T09:00:00Z", end: "2025-12-31T09:00:00Z" },
            ],
          }),
        )!,
      )
      .build();
    Object.assign(mockedConfig, defaultConfig);
  });

  describe("getCampaignState for current date", () => {
    it("should return preopen if campaign preopen in config", async () => {
      const campaignState = await getCampaignState(VaccineType.COVID_19);
      expect(campaignState).toBe(CampaignState.PRE_OPEN);
    });

    it("should return open if campaign open in config", async () => {
      const campaignState = await getCampaignState(VaccineType.FLU_FOR_ADULTS);
      expect(campaignState).toBe(CampaignState.OPEN);
    });

    it("should return closed if campaign closed in config", async () => {
      const campaignState = await getCampaignState(VaccineType.FLU_IN_PREGNANCY);
      expect(campaignState).toBe(CampaignState.CLOSED);
    });

    it("should return unsupported if vaccine is not in the campaign config", async () => {
      const campaignState = await getCampaignState(VaccineType.ROTAVIRUS);
      expect(campaignState).toBe(CampaignState.UNSUPPORTED);
    });
  });
});
