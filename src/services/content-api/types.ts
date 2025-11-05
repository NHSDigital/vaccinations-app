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
  subjectOf: string;
  identifier: string;
  mainEntity: string;
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

type ExpanderSubsection = {
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

export type VaccinePageContent = {
  overview: string;
  whatVaccineIsFor?: VaccinePageSection;
  whoVaccineIsFor: VaccinePageSection;
  howToGetVaccine: VaccinePageSection;
  vaccineSideEffects: VaccinePageSection;
  webpageLink: URL;
};

export type StyledPageSection = {
  heading: string;
  component: JSX.Element;
};

export type HeadingWithContent = {
  heading: string;
  content: string;
};

export type StyledVaccineContent = {
  overview: string;
  whatVaccineIsFor?: StyledPageSection;
  whoVaccineIsFor: StyledPageSection;
  howToGetVaccine: StyledPageSection;
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
