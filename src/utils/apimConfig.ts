import { getFromEnvironmentOrSSM, getUrlFromEnvironmentOrSSM } from "@src/utils/config";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";

export type ApimConfig = {
  CONTENT_API_KEY: string;
  APIM_PRIVATE_KEY: string;
  APIM_AUTH_URL: URL;
  APIM_KEY_ID: string;
};

type ApimConfigCache = {
  config: ApimConfig;
  ttl: number;
};
const CACHE_TTL_MILLIS: number = 300 * 1000;

const ApimConfigPerformanceMarker = "apim-config";
let apimConfigCache: ApimConfigCache | undefined;

const apimConfigProvider = async (): Promise<ApimConfig> => {
  if (apimConfigCache && apimConfigCache.ttl > Date.now()) return apimConfigCache.config;

  profilePerformanceStart(ApimConfigPerformanceMarker);
  const SSM_PREFIX = await getFromEnvironmentOrSSM("", "SSM_PREFIX");

  apimConfigCache = {
    config: {
      CONTENT_API_KEY: await getFromEnvironmentOrSSM(SSM_PREFIX, "CONTENT_API_KEY"),
      APIM_PRIVATE_KEY: await getFromEnvironmentOrSSM(SSM_PREFIX, "APIM_PRIVATE_KEY"),
      APIM_AUTH_URL: await getUrlFromEnvironmentOrSSM(SSM_PREFIX, "APIM_AUTH_URL"),
      APIM_KEY_ID: await getFromEnvironmentOrSSM(SSM_PREFIX, "APIM_KEY_ID"),
    },
    ttl: Date.now() + CACHE_TTL_MILLIS,
  };
  profilePerformanceEnd(ApimConfigPerformanceMarker);

  return apimConfigCache.config;
};

export const _resetApimConfig = () => {
  apimConfigCache = undefined;
};

export { apimConfigProvider };
