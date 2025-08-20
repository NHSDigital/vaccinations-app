import { vitaContentChangedSinceLastApproved } from "@src/_lambda/content-cache-hydrator/content-change-detector";
import { VaccineTypes } from "@src/models/vaccine";
import { _readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { VaccinePageContent } from "@src/services/content-api/types";
import { AppConfig, configProvider } from "@src/utils/config";

jest.mock("@src/utils/config");
jest.mock("@src/services/content-api/parsers/content-filter-service");
jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

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
  beforeEach(() => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        CONTENT_CACHE_PATH: "wiremock/__files/",
      }),
    );
    (_readContentFromCache as jest.Mock).mockImplementation((): string => "mock-cache-file-contents");
    (getFilteredContentForVaccine as jest.Mock).mockImplementation(
      (): VaccinePageContent => mockPreviousApprovedVaccineContent,
    );
  });

  it("should return false if content has not changed since last approved", async () => {
    const mockSameContent = { ...mockPreviousApprovedVaccineContent };

    expect(await vitaContentChangedSinceLastApproved(mockSameContent, VaccineTypes.RSV)).toBeFalsy();
  });

  it("should return true if content changed since last approved", async () => {
    const mockChangedContent = { ...mockPreviousApprovedVaccineContent, overview: "changed-overview" };

    expect(await vitaContentChangedSinceLastApproved(mockChangedContent, VaccineTypes.RSV)).toBeTruthy();
  });
});
