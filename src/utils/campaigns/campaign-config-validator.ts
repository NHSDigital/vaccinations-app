import { VaccineType } from "@src/models/vaccine";
import { Campaigns } from "@src/utils/campaigns/types";
import fs from "node:fs";

const ENVIRONMENTS = ["dev", "test", "preprod", "prod"];
const ENVIRONMENT_CONFIG_BASE_PATH = "./infrastructure/environments";
const CAMPAIGN_FILENAME = "campaigns.json";

// unit test seems to run from the root folder (verified using process.cwd() )
const validateCampaignConfigForEnvironment = (environment: string) => {
  const filePath = `${ENVIRONMENT_CONFIG_BASE_PATH}/${environment}/${CAMPAIGN_FILENAME}`;

  const campaignString: string = fs.readFileSync(filePath, "utf8");
  validateCampaignConfig(campaignString, environment);
};

const validateCampaignConfig = (campaignString: string, environment: string) => {
  const campaigns = Campaigns.fromJson(campaignString);

  if (campaigns) {
    const vaccinesWithCampaigns = campaigns.listVaccines();
    vaccinesWithCampaigns.forEach((vaccine: VaccineType) => {
      const isVaccinePreopenDateValid = campaigns.validatePreopenConfig(vaccine);

      if (!isVaccinePreopenDateValid)
        throw new Error(`Error in campaign config for '${environment}' env: Invalid preopen date for ${vaccine}`);
    });
  }
};

export { validateCampaignConfigForEnvironment, validateCampaignConfig };
