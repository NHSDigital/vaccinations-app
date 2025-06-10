import { WebPageElement } from "@project/pact/helpers/model/WebPageElement";

export type HealthTopicContent = {
  "@type": string;
  "hasHealthAspect": string;
  "url": string;
  "description": string;
  "hasPart": WebPageElement[];
  "headline": string;
}
