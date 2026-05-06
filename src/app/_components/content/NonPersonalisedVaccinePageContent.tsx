import { Overview } from "@src/app/_components/content/Overview";
import Recommendation from "@src/app/_components/content/Recommendation";
import { EligibilityActions } from "@src/app/_components/eligibility/EligibilityActions";
import WarningCallout from "@src/app/_components/nhs-frontend/WarningCallout";
import { VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";
import { CampaignState } from "@src/utils/campaigns/campaignState";

const NonPersonalisedVaccinePageContent = (props: {
  styledVaccineContent: StyledVaccineContent;
  vaccineType: VaccineType;
  campaignState: CampaignState;
  showStaticEligibilityContent: boolean;
}) => {
  return (
    <>
      <Overview overview={props.styledVaccineContent.overview} vaccineType={props.vaccineType} />
      <Recommendation
        recommendation={props.showStaticEligibilityContent ? props.styledVaccineContent.recommendation : undefined}
      />
      {props.campaignState === CampaignState.CLOSED && (
        <WarningCallout styledVaccineContent={props.styledVaccineContent} vaccineType={props.vaccineType} />
      )}
      {props.styledVaccineContent.additionalInformation?.component && props.showStaticEligibilityContent && (
        <div>{props.styledVaccineContent.additionalInformation.component}</div>
      )}
      {props.campaignState === CampaignState.PRE_OPEN && props.showStaticEligibilityContent && (
        <EligibilityActions
          actions={props.styledVaccineContent.preOpenActions ? props.styledVaccineContent.preOpenActions : []}
          vaccineType={props.vaccineType}
        />
      )}
      {props.campaignState === CampaignState.OPEN && props.showStaticEligibilityContent && (
        <EligibilityActions actions={props.styledVaccineContent.actions} vaccineType={props.vaccineType} />
      )}
      <Overview overview={props.styledVaccineContent.overviewConclusion} vaccineType={props.vaccineType} />
    </>
  );
};

export { NonPersonalisedVaccinePageContent };
