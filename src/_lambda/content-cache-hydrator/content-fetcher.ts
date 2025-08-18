import { VaccineTypes } from "@src/models/vaccine";
import { VaccineContentPaths, vaccineTypeToPath } from "@src/services/content-api/constants";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import axios, { AxiosResponse } from "axios";

const log = logger.child({ module: "content-fetcher" });
const CONTENT_API_PATH_PREFIX = "nhs-website-content/vaccinations/";

const fetchContentForVaccine = async (vaccine: VaccineTypes): Promise<string> => {
  const config: AppConfig = await configProvider();

  const apiEndpoint: URL = config.CONTENT_API_ENDPOINT;
  const vaccinePath: VaccineContentPaths = vaccineTypeToPath[vaccine];
  const apiKey: string = config.CONTENT_API_KEY;

  const uri: string = `${apiEndpoint}${CONTENT_API_PATH_PREFIX}${vaccinePath}`;
  let response: AxiosResponse;

  try {
    response = await axios.get(uri, {
      headers: {
        accept: "application/json",
        apikey: apiKey,
      },
      timeout: 5000,
    });
    log.info("Successfully fetched content from %s", uri);
    return JSON.stringify(response.data);
  } catch (error) {
    log.error({ context: { uri: uri, error: error } }, "Error in getting vaccine content from nhs.uk API");
    throw error;
  }
};

export { CONTENT_API_PATH_PREFIX, fetchContentForVaccine };
