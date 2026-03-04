import { Overview } from "@src/app/_components/content/Overview";
import Recommendation from "@src/app/_components/content/Recommendation";
import { EligibilityActions } from "@src/app/_components/eligibility/EligibilityActions";
import WarningCallout from "@src/app/_components/nhs-frontend/WarningCallout";
import { VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";

const NonPersonalisedVaccinePageContent = (props: {
  styledVaccineContent: StyledVaccineContent;
  vaccineType: VaccineType;
  isCampaignOpen: boolean;
  isCampaignPreOpen: boolean;
}) => {
  return (
    <>
      <Overview overview={props.styledVaccineContent.overview} vaccineType={props.vaccineType} />
      <Recommendation recommendation={props.styledVaccineContent.recommendation} />
      {!props.isCampaignOpen && !props.isCampaignPreOpen && (
        <WarningCallout styledVaccineContent={props.styledVaccineContent} vaccineType={props.vaccineType} />
      )}
      {props.styledVaccineContent.additionalInformation?.component && (
        <div>{props.styledVaccineContent.additionalInformation.component}</div>
      )}
      {!props.isCampaignOpen && props.isCampaignPreOpen && (
        <EligibilityActions
          actions={props.styledVaccineContent.preOpenActions ? props.styledVaccineContent.preOpenActions : []}
          vaccineType={props.vaccineType}
        />
      )}
      {props.isCampaignOpen && (
        <EligibilityActions actions={props.styledVaccineContent.actions} vaccineType={props.vaccineType} />
      )}
      <Overview overview={props.styledVaccineContent.overviewConclusion} vaccineType={props.vaccineType} />
    </>
  );
};

export { NonPersonalisedVaccinePageContent };
