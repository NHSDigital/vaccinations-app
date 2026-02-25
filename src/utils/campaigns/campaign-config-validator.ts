import { VaccineType } from "@src/models/vaccine";
import { Campaigns } from "@src/utils/campaigns/types";
import fs from "node:fs";

const ENVIRONMENT_CONFIG_BASE_PATH = "./infrastructure/environments";
const CAMPAIGN_FILENAME = "campaigns.json";

type ValidationResult = {
  environment: string;
  success: boolean;
  errors: string[];
};

const validateCampaignConfigForEnvironment = (environment: string): ValidationResult => {
  const filePath = `${ENVIRONMENT_CONFIG_BASE_PATH}/${environment}/${CAMPAIGN_FILENAME}`;

  const campaignString: string = fs.readFileSync(filePath, "utf8");
  const validationResult = validateCampaignConfig(campaignString, environment);
  if (!validationResult.success) {
    throw new Error(`${environment}: Campaign config validation failed: ${validationResult.errors}`);
  }
  return validationResult;
};

const validateCampaignConfig = (campaignString: string, environment: string): ValidationResult => {
  const validationErrors: string[] = [];

  const campaigns = Campaigns.fromJson(campaignString);

  if (campaigns === undefined) {
    validationErrors.push(
      "Unable to parse campaign file - config either contains invalid JSON or does not meet Zod runtime schema rules",
    );
  }

  if (campaigns) {
    const vaccinesWithCampaigns = campaigns.listVaccines();
    vaccinesWithCampaigns.forEach((vaccine: VaccineType) => {
      const isVaccinePreOpenDateValid = campaigns.validatePreOpenConfig(vaccine);

      if (!isVaccinePreOpenDateValid) {
        validationErrors.push(`${vaccine}: Invalid preopen date`);
      }
    });
  }

  const validationResult: ValidationResult = {
    environment,
    success: validationErrors.length == 0,
    errors: validationErrors,
  };

  return validationResult;
};

export { validateCampaignConfigForEnvironment, validateCampaignConfig };
