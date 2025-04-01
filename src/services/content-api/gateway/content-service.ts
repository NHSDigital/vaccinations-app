"use server";

import configProvider from "@src/utils/config";
import { VaccineTypes } from "@src/models/vaccine";
import { ContentApiVaccinationsResponse } from "@src/services/content-api/types";
import {
  CONTENT_API_VACCINATIONS_PATH,
  vaccineTypeToPath,
} from "@src/services/content-api/constants";

const config = configProvider();

const contentApiVaccinationsUrl = `${config.CONTENT_API_ENDPOINT}${CONTENT_API_VACCINATIONS_PATH}`;

async function callContentApi(url: string) {
  console.log(`Calling Content API ${url}`);
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

const getContent = async (): Promise<ContentApiVaccinationsResponse> => {
  return await callContentApi(contentApiVaccinationsUrl);
};

const getContentForVaccine = async (vaccineType: VaccineTypes) => {
  const vaccineContentPath = vaccineTypeToPath[vaccineType];
  const vaccineContentUrl = `${contentApiVaccinationsUrl}${vaccineContentPath}`;

  return await callContentApi(vaccineContentUrl);
};

export { getContent, getContentForVaccine };
