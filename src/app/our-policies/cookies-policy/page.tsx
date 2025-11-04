import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import { ChangesPage } from "@src/app/our-policies/cookies-policy/ChangesPage";
import { NecessaryCookiesPage } from "@src/app/our-policies/cookies-policy/NecessaryCookiesPage";
import { SummaryPage } from "@src/app/our-policies/cookies-policy/SummaryPage";
import { ContentsList } from "nhsuk-react-components";
import React, { JSX } from "react";

export type IdAndHeading = {
  id: string;
  heading: string;
};

const CookiesPolicy = () => {
  const summary: IdAndHeading = { id: "summary", heading: "Summary" };
  const necessaryCookies: IdAndHeading = { id: "necessary-cookies", heading: "Strictly necessary cookies" };
  const changes: IdAndHeading = { id: "changes", heading: "Changes to our cookies policy" };

  return (
    <>
      <title>{`Cookies policy - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <BackLink />
      <MainContent>
        <h1>Cookies</h1>

        <ContentsList>
          {[summary, necessaryCookies, changes].map((value: IdAndHeading, index: number): JSX.Element => {
            return (
              <ContentsList.Item href={`#${value.id}`} key={index}>
                {value.heading}
              </ContentsList.Item>
            );
          })}
        </ContentsList>

        <SummaryPage id={summary.id} heading={summary.heading} />
        <NecessaryCookiesPage id={necessaryCookies.id} heading={necessaryCookies.heading} />
        <ChangesPage id={changes.id} heading={changes.heading} />
      </MainContent>
    </>
  );
};

export default CookiesPolicy;
