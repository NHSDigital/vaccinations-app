export type WebPageElement = {
  "@type": string;
  "text": string;
  "headline"?: string;
  "position"?: number;
  "identifier"?: number;
  "name"?: "lead paragraph" | "section heading" | "markdown";
  "mainEntityOfPage"?: WebPageElement[];
}

export const matchWebPageElement = (actual: WebPageElement, position: number) => {
  if (actual.position) expect(actual.position).toBe(position);
  if (actual.position) expect(actual.identifier).toBeDefined();
  if (actual.identifier) expect(actual.position).toBeDefined();
  if (actual.mainEntityOfPage) {
    for (let i = 0; i < actual.mainEntityOfPage.length; i++) {
      matchWebPageElement(actual.mainEntityOfPage[i], i);
    }
  }
}
