import { VaccineDetails, VaccineTypes } from "@src/models/vaccine";
import Details from "@src/app/_components/nhs-frontend/Details";
import React, { JSX } from "react";
import { StyledVaccineContent } from "@src/services/content-api/types";
import { HEADINGS } from "@src/app/constants";
import { FindOutMoreLink } from "@src/app/_components/content/FindOutMore";

const MoreInformation = (props: {
  styledVaccineContent: StyledVaccineContent;
  vaccineType: VaccineTypes;
  vaccineInfo: VaccineDetails;
}): JSX.Element => {
  return (
    <>
      <div className="nhsuk-expander-group" data-testid="more-information-expander-group">
        {/* What-vaccine-is-for expandable section */}
        {props.styledVaccineContent.whatVaccineIsFor && (
          <Details
            title={HEADINGS.WHAT_VACCINE_IS_FOR}
            component={props.styledVaccineContent.whatVaccineIsFor.component}
          />
        )}

        {/* Who-vaccine-is-for expandable section */}
        <Details
          title={HEADINGS.WHO_SHOULD_HAVE_VACCINE}
          component={props.styledVaccineContent.whoVaccineIsFor.component}
        />

        {/* How-to-get-vaccine expandable section for all vaccines except RSV in pregnancy */}
        {props.vaccineType !== VaccineTypes.RSV_PREGNANCY && (
          <Details
            title={HEADINGS.HOW_TO_GET_VACCINE}
            component={props.styledVaccineContent.howToGetVaccine.component}
          />
        )}
      </div>
      <FindOutMoreLink findOutMoreUrl={props.styledVaccineContent.webpageLink} vaccineInfo={props.vaccineInfo} />
    </>
  );
};

export { MoreInformation };
