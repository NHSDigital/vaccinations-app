import { vitaContentChangedSinceLastApproved } from "@src/_lambda/content-cache-hydrator/content-change-detector";
import { VaccinePageContent } from "@src/services/content-api/types";

const mockPreviousApprovedVaccineContent: VaccinePageContent = {
  overview: "This is an overview",
  whatVaccineIsFor: {
    headline: "What Vaccine Is For",
    subsections: [
      {
        type: "simpleElement",
        text: "<h2>This is a styled paragraph markdown subsection</h2>",
        name: "markdown",
        headline: "Headline",
      },
    ],
  },
  whoVaccineIsFor: {
    headline: "Who is this Vaccine For",
    subsections: [
      {
        type: "simpleElement",
        text: "<h2>This is a styled paragraph markdown subsection</h2>",
        name: "markdown",
        headline: "Headline",
      },
    ],
  },
  howToGetVaccine: {
    headline: "How to get this Vaccine",
    subsections: [
      {
        type: "simpleElement",
        text: "<p>para</p><h3>If you're aged 75 to 79</h3><p>para1</p><p>para2</p><h3>If you're pregnant</h3><p>para3</p><p>para4</p>",
        name: "markdown",
        headline: "Headline",
      },
    ],
  },
  webpageLink: new URL("https://test.example.com/"),
};

describe("vitaContentChangedSinceLastApproved", () => {
  it("should return false if content has not changed since last approved", async () => {
    const mockSameContent = { ...mockPreviousApprovedVaccineContent };

    expect(vitaContentChangedSinceLastApproved(mockSameContent, mockPreviousApprovedVaccineContent)).toBeFalsy();
  });

  it("should return true if content changed since last approved", async () => {
    const mockChangedContent = { ...mockPreviousApprovedVaccineContent, overview: "changed-overview" };

    expect(vitaContentChangedSinceLastApproved(mockChangedContent, mockPreviousApprovedVaccineContent)).toBeTruthy();
  });
});
