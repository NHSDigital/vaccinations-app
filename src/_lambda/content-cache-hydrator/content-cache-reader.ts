import { VaccinePageContent } from "@project/src/services/content-api/types";
import { VaccineTypes } from "@src/models/vaccine";
import { VaccineContentPaths, vaccineTypeToPath } from "@src/services/content-api/constants";
import { readContentFromCache } from "@src/services/content-api/gateway/content-reader-service";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { AppConfig, configProvider } from "@src/utils/config";

const loadCachedFilteredContentForVaccine = async (vaccineType: VaccineTypes): Promise<VaccinePageContent> => {
  // TODO: VIA-387 temporarily compares to current cache; consider updating path to approved reference location
  const config: AppConfig = await configProvider();
  const vaccineContentPath: VaccineContentPaths = vaccineTypeToPath[vaccineType];
  const cachedVaccineContent = await readContentFromCache(config.CONTENT_CACHE_PATH, `${vaccineContentPath}.json`);
  return getFilteredContentForVaccine(cachedVaccineContent);
};

export { loadCachedFilteredContentForVaccine };
