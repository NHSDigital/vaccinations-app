import configProvider from "@src/utils/config";
import {
  VaccineTypes,
  CONTENT_API_VACCINATIONS_PATH,
} from "@src/utils/Constants";

const config = configProvider();

const contentApiVaccinationsUrl = `${config.CONTENT_API_ENDPOINT}${CONTENT_API_VACCINATIONS_PATH}`;

const getContent = async () => {
  const response: Response = await fetch(contentApiVaccinationsUrl);
  return response.json();
};

const getContentForVaccine = async (vaccine: VaccineTypes) => {
  const vaccineContentUrl = `${contentApiVaccinationsUrl}${vaccine}`;

  const response: Response = await fetch(vaccineContentUrl);
  return response.json();
};

export { getContent, getContentForVaccine };
