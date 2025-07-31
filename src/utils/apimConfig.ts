import { getFromEnvironmentOrSSM, getUrlFromEnvironmentOrSSM } from "@src/utils/config";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";

export type ApimConfig = {
  CONTENT_API_KEY: string;
  APIM_PRIVATE_KEY: string;
  APIM_AUTH_URL: URL;
  APIM_KEY_ID: string;
};

const ApimConfigPerformanceMarker = "apim-config";

const apimConfigProvider = async (): Promise<ApimConfig> => {
  profilePerformanceStart(ApimConfigPerformanceMarker);
  const SSM_PREFIX = await getFromEnvironmentOrSSM("", "SSM_PREFIX");

  const apimConfig: ApimConfig = {
    CONTENT_API_KEY: await getFromEnvironmentOrSSM(SSM_PREFIX, "CONTENT_API_KEY"),
    APIM_PRIVATE_KEY: await getFromEnvironmentOrSSM(SSM_PREFIX, "APIM_PRIVATE_KEY"),
    APIM_AUTH_URL: await getUrlFromEnvironmentOrSSM(SSM_PREFIX, "APIM_AUTH_URL"),
    APIM_KEY_ID: await getFromEnvironmentOrSSM(SSM_PREFIX, "APIM_KEY_ID"),
  };
  profilePerformanceEnd(ApimConfigPerformanceMarker);

  return apimConfig;
};

export { apimConfigProvider };
