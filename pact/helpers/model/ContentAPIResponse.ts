import { Breadcrumb, matchBreadcrumb } from "./Breadcrumb";
import { HealthTopicContent } from "./HealthTopicContent";
import { LinkRole, matchRelatedLink } from "./LinkRole";
import { matchWebPageElement, WebPageElement } from "./WebPageElement";
import { dateMatcher } from "../Matchers";

export type ContentAPIResponse = {
  "@context": "http://schema.org";
  "@type": "MedicalWebPage";
  "name": "RSV vaccine";
  "copyrightHolder": {
    "@type": "Organization";
    "name": "Crown Copyright";
  }
  "license": "https://developer.api.nhs.uk/terms";
  "author": {
    "url": "https://www.nhs.uk";
    "logo": "https://assets.nhs.uk/nhsuk-cms/images/nhs-attribution.width-510.png";
    "email": "nhswebsite.servicedesk@nhs.net";
    "@type": "Organization";
    "name": "NHS website";
  }
  "about": {
    "name": "RSV vaccine";
    "@type": "WebPage";
    "alternatename": ["Respiratory syncytial virus (RSV) vaccine"];
  }
  "description": string;
  "url": string
  "genre": ["Vaccine"];
  "keywords": "";
  "dateModified": string;
  "lastReviewed": string[];
  "breadcrumb": Breadcrumb;
  "hasPart": HealthTopicContent[];
  "relatedLink": LinkRole[];
  "contentSubTypes": [];
  "mainEntityOfPage": WebPageElement[]
}

export const matchMainEntityOfPage = (actual: WebPageElement[]) => {
  let outer;
  expect(actual.length).toBeGreaterThanOrEqual(1);
  for (let i = 0; i < actual.length; i++) {
    outer = actual[i];
    matchWebPageElement(outer, i);
  }
}

export const matchParts = (actual: HealthTopicContent[]) => {
  expect(actual.length).not.toBe(0);
  let outer, inner;
  for (let i = 0; i < actual.length; i++) {
    outer = actual[i];
    expect(outer["@type"]).toBe("HealthTopicContent");
    expect(actual[i].hasPart.length).not.toBe(0);
    for (let j = 0; j < outer["hasPart"].length; j++) {
      inner = outer["hasPart"][j];
      expect(inner["@type"]).toBe("WebPageElement");
    }
  }
}

export const matchLastReviewed = (actual: string[]) => {
  expect(actual.length).not.toBe(0);
  for (const dateString in actual) dateMatcher(dateString);
}

export const matchContentAPIResponse = (actual: ContentAPIResponse) => {
  dateMatcher(actual["dateModified"]);
  matchBreadcrumb(actual["breadcrumb"]);
  matchLastReviewed(actual["lastReviewed"]);
  matchParts(actual["hasPart"]);
  matchRelatedLink(actual.relatedLink)
  matchMainEntityOfPage(actual["mainEntityOfPage"]);
}
