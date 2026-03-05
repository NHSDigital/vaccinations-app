import { VaccineType } from "@src/models/vaccine";
import { CampaignState } from "@src/utils/campaigns/campaignState";
import config from "@src/utils/config";
import { getNow } from "@src/utils/date";

const getCampaignState = async (vaccineType: VaccineType) => {
  const campaigns = await config.CAMPAIGNS;
  let campaignState: CampaignState;

  if (!campaigns.isSupported(vaccineType)) {
    campaignState = CampaignState.UNSUPPORTED;
  } else {
    const currentDatetime = await getNow(await config.DEPLOY_ENVIRONMENT);

    if (campaigns.isOpen(vaccineType, currentDatetime)) {
      campaignState = CampaignState.OPEN;
    } else if (campaigns.isPreOpen(vaccineType, currentDatetime)) {
      campaignState = CampaignState.PRE_OPEN;
    } else {
      campaignState = CampaignState.CLOSED;
    }
  }
  return campaignState;
};

export { getCampaignState };
