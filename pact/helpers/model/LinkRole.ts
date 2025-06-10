export type LinkRole = {
  "@type": string;
  "url": string;
  "name": string;
  "linkRelationship": string;
  "position": number;
}

export const matchRelatedLink = (actual: LinkRole[]) => {
  let outer;
  expect(actual.length).not.toBe(0);
  for (let i = 0; i < actual.length; i++) {
    outer = actual[i];
    expect(outer["@type"]).toBe("LinkRole");
    expect(outer["position"]).toBe(i);
  }
}
