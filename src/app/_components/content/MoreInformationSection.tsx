import { FindOutMoreLink } from "@src/app/_components/content/FindOutMore";
import { MoreInformationExpanders } from "@src/app/_components/content/MoreInformationExpanders";
import { VaccineDetails, VaccineInfo, VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";
import React, { JSX } from "react";

const MoreInformationSection = (props: {
  styledVaccineContent: StyledVaccineContent | undefined;
  vaccineType: VaccineType;
  showHowToGetSection: boolean;
}): JSX.Element => {
  const vaccineInfo: VaccineDetails = VaccineInfo[props.vaccineType];

  return (
    <>
      <h2 className="nhsuk-heading-s">{`More information about the ${vaccineInfo.displayName.midSentenceCase} ${vaccineInfo.displayName.suffix}`}</h2>

      {props.styledVaccineContent != undefined ? (
        <MoreInformationExpanders
          styledVaccineContent={props.styledVaccineContent}
          vaccineType={props.vaccineType}
          showHowToGetSection={props.showHowToGetSection}
        />
      ) : (
        <FindOutMoreLink findOutMoreUrl={vaccineInfo.nhsWebpageLink} vaccineType={props.vaccineType} />
      )}
    </>
  );
};

export { MoreInformationSection };
