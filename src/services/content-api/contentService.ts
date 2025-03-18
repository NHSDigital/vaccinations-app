import configProvider from "@src/utils/config";
import {
  CONTENT_API_VACCINATIONS_PATH,
  vaccineTypeToPath,
} from "@src/services/content-api/constants";
import { VaccineTypes } from "@src/models/vaccine";
import { ContentApiVaccinationsResponse } from "@src/services/content-api/types";

const config = configProvider();

const contentApiVaccinationsUrl = `${config.CONTENT_API_ENDPOINT}${CONTENT_API_VACCINATIONS_PATH}`;

const getContent = async (): Promise<ContentApiVaccinationsResponse> => {
  const response: Response = await fetch(contentApiVaccinationsUrl);
  return response.json();
};

const getContentForVaccine = async (vaccineType: VaccineTypes) => {
  const vaccineContentPath = vaccineTypeToPath[vaccineType];
  const vaccineContentUrl = `${contentApiVaccinationsUrl}${vaccineContentPath}`;

  const response: Response = await fetch(vaccineContentUrl);
  return response.json();
};

export { getContent, getContentForVaccine };
