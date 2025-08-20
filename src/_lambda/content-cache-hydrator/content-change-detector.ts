import { VaccineTypes } from "@src/models/vaccine";
import { VaccineContentPaths, vaccineTypeToPath } from "@src/services/content-api/constants";
import { _readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { VaccinePageContent } from "@src/services/content-api/types";
import { AppConfig, configProvider } from "@src/utils/config";

const vitaContentChangedSinceLastApproved = async (
  filteredContent: VaccinePageContent,
  vaccine: VaccineTypes,
): Promise<boolean> => {
  const previousApprovedFilteredContent = await loadPreviousApprovedFilteredContentForVaccine(vaccine);
  // TODO: VIA-387 stringify only works because we're using the same filter method to generate each so fields are always in same order
  return JSON.stringify(filteredContent) !== JSON.stringify(previousApprovedFilteredContent);
};

const loadPreviousApprovedFilteredContentForVaccine = async (
  vaccineType: VaccineTypes,
): Promise<VaccinePageContent> => {
  // TODO: VIA-387 temporarily compare to previously cached content; path needs updating to approved content location?
  const config: AppConfig = await configProvider();
  const vaccineContentPath: VaccineContentPaths = vaccineTypeToPath[vaccineType];
  const previousApprovedVaccineContent = await _readContentFromCache(
    config.CONTENT_CACHE_PATH,
    `${vaccineContentPath}.json`,
  );
  return getFilteredContentForVaccine(previousApprovedVaccineContent);
};

export { vitaContentChangedSinceLastApproved };
