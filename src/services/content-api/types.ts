import { Action } from "@src/services/eligibility-api/types";
import { JSX } from "react";

export type GetContentForVaccineResponse = ContentForVaccine | ContentForVaccineError;

type ContentForVaccine = {
  styledVaccineContent: StyledVaccineContent;
  contentError: undefined;
};

type ContentForVaccineError = {
  styledVaccineContent: undefined;
  contentError: ContentErrorTypes;
};

export enum ContentErrorTypes {
  CONTENT_LOADING_ERROR,
}

export type MainEntity = {
  "@type": string;
  text?: string;
  position: number;
  name: string;
  subjectOf?: string;
  identifier: string;
  mainEntity?: string;
};

export type HasPartSubsection = {
  "@type": string;
  text?: string;
  name: string;
  headline?: string;
  position: number;
  identifier?: string;
  mainEntity?: string | MainEntity[];
  subjectOf?: string;
};

export type MainEntityOfPage = {
  "@type": string;
  hasHealthAspect?: string;
  position: number;
  identifier: number | string;
  headline?: string;
  text?: string;
  name: string;
  hasPart?: HasPartSubsection[];
  mainEntityOfPage?: MainEntityOfPage[];
  description?: string;
  mainEntity?: string | MainEntity[];
};

export type ContentApiVaccineResponse = {
  "@context": string;
  "@type": string;
  name: string;
  mainEntityOfPage: MainEntityOfPage[];
  webpage: URL;
  copyrightHolder: object;
  license: string;
  author: object;
  about: object;
  description: string;
  url: string;
  genre: object;
  keywords: string;
  dateModified: string;
  lastReviewed: string[];
  breadcrumb: object;
  hasPart: object[];
  relatedLink: object;
  contentSubTypes: object;
};

type SimpleSubsection = {
  type: "simpleElement";
  headline: string;
  text: string;
  name: string;
};

type TableSubsection = {
  type: "tableElement";
  name: string;
  mainEntity: string;
};

export type ExpanderSubsection = {
  type: "expanderElement";
  name: string;
  mainEntity: string;
  headline: string;
};

type ComplexSubsection = ExpanderSubsection | TableSubsection;
export type VaccinePageSubsection = SimpleSubsection | ComplexSubsection;

export type VaccinePageSection = {
  headline: string;
  subsections: VaccinePageSubsection[];
};

export type Overview = { content: string; containsHtml: boolean };

export type VaccinePageContent = {
  overview?: Overview;
  callout?: HeadingWithTypedContent;
  additionalInformation?: VaccinePageSection;
  recommendation?: HeadingWithContent;
  overviewConclusion?: Overview;
  preOpenActions?: Action[];
  actions: Action[];

  whatVaccineIsFor?: VaccinePageSection;
  whoVaccineIsFor: VaccinePageSection;
  howToGetVaccine: VaccinePageSection;
  vaccineSideEffects: VaccinePageSection;

  webpageLink: URL;
};

// TODO Refactor VaccinePageContent to something like this:
// export type OverviewSection = SimpleOverviewSection | CalloutSubsection | RecommendationSubsection | Actions[];
// export type VaccinePageContent = {
//   overviewSections: OverviewSection[];
//   moreInformationSections: VaccinePageSection[];
//   webpageLink: URL;
// }
// This would allow us to have a variable number of overview sections, of various types, in any order, and the same thing with more info expanders.

export type StyledPageSection = {
  heading: string;
  component: JSX.Element;
};

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | undefined;

export type HeadingWithContent = {
  heading: string;
  headingLevel?: HeadingLevel;
  content: string;
};

export type HeadingWithTypedContent = {
  heading: string;
  content: string;
  contentType: "markdown" | "html" | "string";
};

export type StyledVaccineContent = {
  overview?: Overview;
  callout?: StyledPageSection;
  additionalInformation?: StyledPageSection;
  recommendation?: StyledPageSection;
  overviewConclusion?: Overview;
  actions: Action[];

  whatVaccineIsFor?: StyledPageSection;
  whoVaccineIsFor: StyledPageSection;
  howToGetVaccine: StyledPageSection;
  vaccineSideEffects: StyledPageSection;

  webpageLink: URL;
};

export type ContentApiVaccinationsResponse = {
  "@context": string;
  "@type": string;
  name: string;
  copyrightHolder: {
    name: string;
    "@type": string;
  };
  license: string;
  author: {
    url: string;
    logo: string;
    email: string;
    "@type": string;
    name: string;
  };
  about: {
    "@type": string;
    name: string;
    alternateName: string;
  };
  description: string;
  url: string;
  genre: [];
  keywords: string;
  dateModified: string;
  hasPart: [];
  breadcrumb: {
    "@context": string;
    "@type": string;
    itemListElement: [
      {
        "@type": string;
        position: number;
        item: {
          "@id": string;
          name: string;
          genre: [];
        };
      },
    ];
  };
  headline: string;
  contentSubTypes: [];
  mainEntityOfPage: [
    {
      identifier: number;
      "@type": string;
      name: string;
      headline: string;
      text: string;
      mainEntityOfPage: [
        {
          "@type": string;
          headline: string;
          url: string;
          identifier: number;
          text: string;
          name: string;
        },
      ];
    },
  ];
  webpage: string;
};
