import CookiesTable from "@src/app/our-policies/cookies-policy/CookiesTable";
import { IdAndHeading } from "@src/app/our-policies/cookies-policy/page";
import { Details } from "nhsuk-react-components";
import React, { JSX } from "react";

const NecessaryCookiesPage = (props: IdAndHeading): JSX.Element => {
  return (
    <>
      <h2 id={props.id}>{props.heading}</h2>
      <Details>
        <Details.Summary>List of necessary cookies that make this service work</Details.Summary>
        <Details.Text>{<CookiesTable />}</Details.Text>
      </Details>
    </>
  );
};

export { NecessaryCookiesPage };
