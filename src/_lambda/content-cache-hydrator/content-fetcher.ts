import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import axios, { AxiosError, AxiosResponse } from "axios";

const log = logger.child({ module: "content-fetcher" });
const CONTENT_API_PATH_PREFIX = "nhs-website-content/";

const fetchContentForVaccine = async (vaccineType: VaccineTypes): Promise<string> => {
  const config: AppConfig = await configProvider();

  const apiEndpoint: URL = config.CONTENT_API_ENDPOINT;
  const vaccinePath = VaccineInfo[vaccineType].contentPath;
  const apiKey: string = config.CONTENT_API_KEY;

  const uri: string = `${apiEndpoint}${CONTENT_API_PATH_PREFIX}${vaccinePath}`;
  let response: AxiosResponse;

  try {
    response = await axios.get(uri, {
      headers: {
        accept: "application/json",
        apikey: apiKey,
      },
      timeout: 30000,
    });
    log.info({ context: { uri, vaccineType } }, "Successfully fetched content from API");
    return JSON.stringify(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      log.error({
        error: {
          code: error.code,
          status: error.status,
          message: error.message,
          response_data: error.response?.data,
        },
        context: { uri, vaccineType },
      });
    } else {
      log.error({ context: { uri, vaccineType } }, "Error in getting vaccine content from nhs.uk API");
    }
    throw error;
  }
};

export { CONTENT_API_PATH_PREFIX, fetchContentForVaccine };
