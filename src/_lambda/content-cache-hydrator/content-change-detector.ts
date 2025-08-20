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
  return JSON.stringify(filteredContent) !== JSON.stringify(previousApprovedFilteredContent);
};

const loadPreviousApprovedFilteredContentForVaccine = async (
  vaccineType: VaccineTypes,
): Promise<VaccinePageContent> => {
  // TODO: VIA-387 temporarily compares to current cache; consider updating path to approved reference location
  const config: AppConfig = await configProvider();
  const vaccineContentPath: VaccineContentPaths = vaccineTypeToPath[vaccineType];
  const previousApprovedVaccineContent = await _readContentFromCache(
    config.CONTENT_CACHE_PATH,
    `${vaccineContentPath}.json`,
  );
  return getFilteredContentForVaccine(previousApprovedVaccineContent);
};

export { vitaContentChangedSinceLastApproved };
