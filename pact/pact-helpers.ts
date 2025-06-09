type ListItem = {
  "@type": string;
  "position": number;
  "item": {
    "@id": string;
    "name": string;
    "genre": string[];
  }
}

type WebPageElement = {
  "@type": string;
  "text": string;
  "headline"?: string;
}

type HealthTopicContent = {
  "@type": string;
  "hasHealthAspect": string;
  "url": string;
  "description": string;
  "hasPart": WebPageElement[];
  "headline": string;
}

type RSVResponse = {
  "@context": string;
  "@type": string;
  "name": string;
  copyrightHolder: {
    "name": string;
    "@type": string;
  }
  "license": string;
  "author": {
    "url": string;
    "logo": string;
    "email": string;
    "@type": string;
    "name": string;
  }
  "about": {
    "@type": string,
    "name": string,
    "alternateName": string[]
  }
  "description": string;
  "url": string
  "genre": string[];
  "keywords": string;
  "dateModified": string;
  "lastReviewed": string[];
  "breadcrumb": {
    "@context": string;
    "@type": string;
    "itemListElement": ListItem[]
  }
  "hasPart": HealthTopicContent[]
}

const dateMatcher = (actual: string) => {
  expect(Date.parse(actual)).not.toBeNaN();
}

const stringMatcher = (actual: string, regExp=new RegExp("^.+$")) => {
  expect(actual).toMatch(regExp);
}

export const matchRSVResponse = (actual: RSVResponse) => {
  expect(actual["@context"]).toBe("http://schema.org");
  expect(actual["@type"]).toBe("MedicalWebPage");
  expect(actual["name"]).toBe("RSV vaccine");
  expect(actual["copyrightHolder"]["name"]).toBe("Crown Copyright");
  expect(actual["copyrightHolder"]["@type"]).toBe("Organization");
  expect(actual["license"]).toBe("https://developer.api.nhs.uk/terms");
  expect(actual["author"]["url"]).toBe("https://www.nhs.uk");
  expect(actual["author"]["logo"]).toBe("https://assets.nhs.uk/nhsuk-cms/images/nhs-attribution.width-510.png");
  expect(actual["author"]["email"]).toBe("nhswebsite.servicedesk@nhs.net");
  expect(actual["author"]["@type"]).toBe("Organization");
  expect(actual["author"]["name"]).toBe("NHS website");
  expect(actual["about"]["name"]).toBe("RSV vaccine");
  expect(actual["about"]["@type"]).toBe("WebPage");
  expect(actual["about"]["alternateName"].length).toBe(1);
  expect(actual["about"]["alternateName"][0]).toBe("Respiratory syncytial virus (RSV) vaccine");
  expect(actual["description"]).toBe("Find out about the RSV vaccine, including who it's for, how to get it and common side effects.");
  expect(actual["url"]).toBe("https://int.api.service.nhs.uk/nhs-website-content/vaccinations/rsv-vaccine/")
  expect(actual["genre"].length).toBe(1);
  expect(actual["genre"][0]).toBe("Vaccine");
  expect(actual["keywords"]).toBe("");
  dateMatcher(actual["dateModified"]);
  expect(actual["lastReviewed"].length).not.toBe(0);
  dateMatcher(actual["lastReviewed"][0]);
  expect(actual["breadcrumb"]["@context"]).toBe("http://schema.org");
  expect(actual["breadcrumb"]["@type"]).toBe("BreadcrumbList");
  expect(actual["breadcrumb"]["itemListElement"].length).not.toBe(0);
  let cur;
  for (let i = 0; i < actual["breadcrumb"]["itemListElement"].length; i++) {
    cur = actual["breadcrumb"]["itemListElement"][i];
    expect(cur["@type"]).toBe("ListItem");
    expect(cur["position"]).toBe(i);
    stringMatcher(cur["item"]["@id"]);
    stringMatcher(cur["item"]["name"]);
    expect(cur["item"]["genre"].length).toBeGreaterThanOrEqual(0);
    for (const genre in cur["item"]["genre"]) {
      stringMatcher(genre);
    }
  }
  expect(actual["hasPart"].length).not.toBe(0);
  let inner;
  for (let i = 0; i < actual["hasPart"].length; i++) {
    cur = actual["hasPart"][i];
    expect(cur["@type"]).toBe("HealthTopicContent");
    stringMatcher(cur["hasHealthAspect"]);
    stringMatcher(cur["url"]);
    stringMatcher(cur["description"]);
    for (let j = 0; j < cur["hasPart"].length; j++) {
      inner = cur["hasPart"][j];
      expect(inner["@type"]).toBe("WebPageElement");
      stringMatcher(inner["text"]);
      if (inner["headline"]) {
        stringMatcher(inner["headline"]);
      }
    }
    if (cur["headline"]) {
      stringMatcher(cur["headline"]);
    }
  }
}
