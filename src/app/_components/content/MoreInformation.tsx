import { FindOutMoreLink } from "@src/app/_components/content/FindOutMore";
import { HEADINGS } from "@src/app/constants";
import { VaccineInfo, VaccineType } from "@src/models/vaccine";
import { StyledVaccineContent } from "@src/services/content-api/types";
import { Details } from "nhsuk-react-components";
import React, { JSX } from "react";

// Ref: https://main--65aa76b29d00a047fe683b95.chromatic.com/?path=/docs/content-presentation-details--docs#expander-group-2
const MoreInformation = (props: {
  styledVaccineContent: StyledVaccineContent;
  vaccineType: VaccineType;
}): JSX.Element => {
  const vaccineInfo = VaccineInfo[props.vaccineType];
  const showHowToGetExpander =
    vaccineInfo.removeHowToGetExpanderFromMoreInformationSection === undefined ||
    !vaccineInfo.removeHowToGetExpanderFromMoreInformationSection;

  return (
    <>
      <Details.ExpanderGroup data-testid="more-information-expander-group">
        {/* What-vaccine-is-for expandable section */}
        {props.styledVaccineContent.whatVaccineIsFor && (
          <Details expander>
            <Details.Summary>{HEADINGS.WHAT_VACCINE_IS_FOR}</Details.Summary>
            <Details.Text>{props.styledVaccineContent.whatVaccineIsFor.component}</Details.Text>
          </Details>
        )}

        {/* Who-vaccine-is-for expandable section */}
        <Details expander>
          <Details.Summary>{HEADINGS.WHO_SHOULD_HAVE_VACCINE}</Details.Summary>
          <Details.Text>{props.styledVaccineContent.whoVaccineIsFor.component}</Details.Text>
        </Details>

        {/* How-to-get-the-vaccine expandable section */}
        {showHowToGetExpander && (
          <Details expander>
            <Details.Summary>{HEADINGS.HOW_TO_GET_VACCINE}</Details.Summary>
            <Details.Text>{props.styledVaccineContent.howToGetVaccine.component}</Details.Text>
          </Details>
        )}

        {/* Side-effects-of-the-vaccine expandable section */}
        <Details expander>
          <Details.Summary>{HEADINGS.VACCINE_SIDE_EFFECTS}</Details.Summary>
          <Details.Text>{props.styledVaccineContent.vaccineSideEffects.component}</Details.Text>
        </Details>
      </Details.ExpanderGroup>

      <FindOutMoreLink findOutMoreUrl={props.styledVaccineContent.webpageLink} vaccineType={props.vaccineType} />
    </>
  );
};

export { MoreInformation };
