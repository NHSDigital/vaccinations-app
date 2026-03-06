import { FindOutMoreLink } from "@src/app/_components/content/FindOutMore";
import { MoreInformationExpanders } from "@src/app/_components/content/MoreInformationExpanders";
import { VaccineDetails, VaccineInfo, VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";
import { CampaignState } from "@src/utils/campaigns/campaignState";
import React, { JSX } from "react";

const shouldShowHowToGetExpander = (vaccineType: VaccineType, campaignState: CampaignState) => {
  const vaccineConfiguredToHideHowToGetExpander: boolean | undefined =
    VaccineInfo[vaccineType].removeHowToGetExpanderFromMoreInformationSection;
  const isCampaignClosedOrNotSupported =
    campaignState === CampaignState.UNSUPPORTED || campaignState === CampaignState.CLOSED;

  return vaccineConfiguredToHideHowToGetExpander ? false : isCampaignClosedOrNotSupported;
};

const MoreInformationSection = (props: {
  styledVaccineContent: StyledVaccineContent | undefined;
  vaccineType: VaccineType;
  campaignState: CampaignState;
}): JSX.Element => {
  const vaccineInfo: VaccineDetails = VaccineInfo[props.vaccineType];
  const showHowToGetSection: boolean = shouldShowHowToGetExpander(props.vaccineType, props.campaignState);
  const findOutMoreUrl = props.styledVaccineContent
    ? props.styledVaccineContent.webpageLink
    : vaccineInfo.nhsWebpageLink;

  return (
    <>
      <h2 className="nhsuk-heading-s">{`More information about the ${vaccineInfo.displayName.midSentenceCase} ${vaccineInfo.displayName.suffix}`}</h2>

      {props.styledVaccineContent != undefined && (
        <MoreInformationExpanders
          styledVaccineContent={props.styledVaccineContent}
          vaccineType={props.vaccineType}
          showHowToGetSection={showHowToGetSection}
        />
      )}
      <FindOutMoreLink findOutMoreUrl={findOutMoreUrl} vaccineType={props.vaccineType} />
    </>
  );
};

export { MoreInformationSection, shouldShowHowToGetExpander };
