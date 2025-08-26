import { loadCachedFilteredContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-cache-reader";
import { VaccineTypes } from "@src/models/vaccine";
import { vaccineTypeToPath } from "@src/services/content-api/constants";
import { readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { VaccinePageContent } from "@src/services/content-api/types";
import { AppConfig, configProvider } from "@src/utils/config";

jest.mock("@src/utils/config");
jest.mock("@src/services/content-api/parsers/content-filter-service");
jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const mockContentCachePath = "wiremock/__files/";

const mockCachedVaccineContent: VaccinePageContent = {
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

describe("loadCachedFilteredContentForVaccine", () => {
  const mockCacheFileContents = "mock-cache-file-contents";
  const vaccineType = VaccineTypes.RSV;

  beforeEach(() => {
    (configProvider as jest.Mock).mockImplementation(
      (): Partial<AppConfig> => ({
        CONTENT_CACHE_PATH: mockContentCachePath,
      }),
    );
    (readContentFromCache as jest.Mock).mockImplementation((): string => mockCacheFileContents);
    (getFilteredContentForVaccine as jest.Mock).mockImplementation((): VaccinePageContent => mockCachedVaccineContent);
  });

  it("should read content for named vaccine from cache", async () => {
    const cachedContent = await loadCachedFilteredContentForVaccine(vaccineType);

    expect(readContentFromCache).toHaveBeenCalledWith(mockContentCachePath, `${vaccineTypeToPath[vaccineType]}.json`);
    expect(getFilteredContentForVaccine).toHaveBeenCalledWith(mockCacheFileContents);
    expect(cachedContent).toBe(mockCachedVaccineContent);
  });

  it("should throw if readContentFromCache throws", async () => {
    const readContentFromCacheError = new Error("test");
    (readContentFromCache as jest.Mock).mockRejectedValue(readContentFromCacheError);
    await expect(loadCachedFilteredContentForVaccine(vaccineType)).rejects.toThrow(readContentFromCacheError);
  });

  it("should throw if getFilteredContentForVaccine throws", async () => {
    const getFilteredContentError = new Error("test");
    (getFilteredContentForVaccine as jest.Mock).mockRejectedValue(getFilteredContentError);
    await expect(loadCachedFilteredContentForVaccine(vaccineType)).rejects.toThrow(getFilteredContentError);
  });
});
