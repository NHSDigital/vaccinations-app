"use server";

import readContentFromCache from "@src/services/content-api/cache/reader/content-cache-reader";
import configProvider from "@src/utils/config";
import { VaccineTypes } from "@src/models/vaccine";
import { vaccineTypeToPath } from "@src/services/content-api/constants";

const getContentForVaccine = async (vaccineType: VaccineTypes) => {
  const config = await configProvider();
  const vaccineContentPath = vaccineTypeToPath[vaccineType];
  const vaccineContent = await readContentFromCache(
    config.CONTENT_CACHE_PATH,
    `${vaccineContentPath}.json`,
  );

  return JSON.parse(vaccineContent);
};

export { getContentForVaccine };
