import { VaccineTypes } from "@src/models/vaccine";
import { GetEligibilityForPersonResponse } from "@src/services/eligibility-api/types";
import { AppConfig, configProvider } from "@src/utils/config";
import axios, { AxiosResponse } from "axios";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "content-fetcher" });
const ELIGIBILITY_API_PATH_PREFIX = "/patient-check/";

const getEligibilityContentForPerson = async (
  nhsNumber: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  vaccineType: VaccineTypes, // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<GetEligibilityForPersonResponse> => {
  const config: AppConfig = await configProvider();

  const apiEndpoint: string = config.ELIGIBILITY_API_ENDPOINT;
  const apiKey: string = config.ELIGIBILITY_API_KEY;

  const uri: string = `${apiEndpoint}${ELIGIBILITY_API_PATH_PREFIX}/${nhsNumber}`;
  let response: AxiosResponse;
  try {
    log.info("Fetching content from %s", uri);
    response = await axios.get(uri, {
      headers: {
        accept: "application/json",
        apikey: apiKey,
      },
    });
    log.info("Successfully fetched content from %s", uri);
    return response.data;
  } catch (error) {
    log.error(`Error in fetching ${uri}: ${error}`);
    throw error;
  }
  // const styledEligibilityContent = {
  //   heading: "dummy heading",
  //   content: "dummy content",
  // };
  //
  // return {
  //   eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
  //   styledEligibilityContent,
  //   eligibilityError: undefined,
  // };
};

export { getEligibilityContentForPerson };
