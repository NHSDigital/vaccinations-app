import { getFromEnvironmentOrSSM, getUrlFromEnvironmentOrSSM } from "@src/utils/config";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";

export type ApimConfig = {
  CONTENT_API_KEY: string;
  APIM_PRIVATE_KEY: string;
  APIM_AUTH_URL: URL;
  APIM_KEY_ID: string;
};

let globalApimConfig: ApimConfig | undefined;
const ApimConfigPerformanceMarker = "apim-config";

const apimConfigProvider = async (): Promise<ApimConfig> => {
  if (globalApimConfig) return globalApimConfig;

  profilePerformanceStart(ApimConfigPerformanceMarker);
  const SSM_PREFIX = await getFromEnvironmentOrSSM("", "SSM_PREFIX");

  globalApimConfig = {
    CONTENT_API_KEY: await getFromEnvironmentOrSSM(SSM_PREFIX, "CONTENT_API_KEY"),
    APIM_PRIVATE_KEY: await getFromEnvironmentOrSSM(SSM_PREFIX, "APIM_PRIVATE_KEY"),
    APIM_AUTH_URL: await getUrlFromEnvironmentOrSSM(SSM_PREFIX, "APIM_AUTH_URL"),
    APIM_KEY_ID: await getFromEnvironmentOrSSM(SSM_PREFIX, "APIM_KEY_ID"),
  };
  profilePerformanceEnd(ApimConfigPerformanceMarker);

  return globalApimConfig;
};

export const _resetApimConfig = () => {
  globalApimConfig = undefined;
};

export { apimConfigProvider };
