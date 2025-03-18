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
