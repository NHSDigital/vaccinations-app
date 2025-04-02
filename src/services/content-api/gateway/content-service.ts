"use server";

import configProvider from "@src/utils/config";
import { VaccineTypes } from "@src/models/vaccine";
import {
  CONTENT_API_VACCINATIONS_PATH,
  vaccineTypeToPath,
} from "@src/services/content-api/constants";

async function callContentApi(url: string) {
  console.log(`Calling Content API ${url}`);
  const config = await configProvider();
  const apiKey = config.CONTENT_API_KEY;
  const response: Response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      apikey: apiKey,
    },
  });
  console.log(`Content API response ${response.status} ${url} `);
  return response.json();
}

const getContentForVaccine = async (vaccineType: VaccineTypes) => {
  const config = await configProvider();
  const contentApiVaccinationsUrl = `${config.CONTENT_API_ENDPOINT}${CONTENT_API_VACCINATIONS_PATH}`;
  const vaccineContentPath = vaccineTypeToPath[vaccineType];
  const vaccineContentUrl = `${contentApiVaccinationsUrl}${vaccineContentPath}`;

  return await callContentApi(vaccineContentUrl);
};

export { getContentForVaccine };
