export type BreadcrumbListItem = {
  "@type": "ListItem";
  "position": number;
  "item": {
    "@id": string;
    "name": string;
    "genre": string[];
  }
}

export type Breadcrumb = {
  "@context": "http://schema.org";
  "@type": "BreadcrumbList";
  "itemListElement": BreadcrumbListItem[];
}

export const matchBreadcrumbListItem = (actual: BreadcrumbListItem, position: number) => {
  expect(actual["position"]).toBe(position);
}

export const matchBreadcrumb = (actual: Breadcrumb) => {
  expect(actual["itemListElement"].length).not.toBe(0);
  let cur;
  for (let i = 0; i < actual["itemListElement"].length; i++) {
    cur = actual["itemListElement"][i];
    matchBreadcrumbListItem(cur, i);
  }
}
