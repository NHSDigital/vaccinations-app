import getSSMParam from "@src/utils/get-ssm-param";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";

type AppConfig = {
  CONTENT_API_ENDPOINT: URL;
  ELIGIBILITY_API_ENDPOINT: URL;
  CONTENT_API_KEY: string;
  ELIGIBILITY_API_KEY: string;
  CONTENT_CACHE_PATH: string;
  NHS_LOGIN_URL: string;
  NHS_LOGIN_CLIENT_ID: string;
  NHS_LOGIN_SCOPE: string;
  NHS_LOGIN_PRIVATE_KEY: string;
  NBS_URL: string;
  NBS_BOOKING_PATH: string;
  MAX_SESSION_AGE_MINUTES: number;
  NHS_APP_REDIRECT_LOGIN_URL: string;
  IS_APIM_AVAILABLE: boolean;
};

type AppConfigCache = {
  config: AppConfig;
  ttl: number;
};
const CACHE_TTL_MILLIS: number = 300 * 1000;

const ConfigPerformanceMarker = "app-config";
let appConfigCache: AppConfigCache | undefined;

const configProvider = async (): Promise<AppConfig> => {
  if (appConfigCache && appConfigCache.ttl > Date.now()) return appConfigCache.config;

  profilePerformanceStart(ConfigPerformanceMarker);

  const SSM_PREFIX = await getFromEnvironmentOrSSM("", "SSM_PREFIX");
  appConfigCache = {
    config: {
      CONTENT_API_ENDPOINT: await getUrlFromEnvironmentOrSSM(SSM_PREFIX, "CONTENT_API_ENDPOINT"),
      ELIGIBILITY_API_ENDPOINT: await getUrlFromEnvironmentOrSSM(SSM_PREFIX, "ELIGIBILITY_API_ENDPOINT"),
      CONTENT_API_KEY: await getFromEnvironmentOrSSM(SSM_PREFIX, "CONTENT_API_KEY"),
      ELIGIBILITY_API_KEY: await getFromEnvironmentOrSSM(SSM_PREFIX, "ELIGIBILITY_API_KEY"),
      CONTENT_CACHE_PATH: await getFromEnvironmentOrSSM(SSM_PREFIX, "CONTENT_CACHE_PATH"),
      NHS_LOGIN_URL: await getFromEnvironmentOrSSM(SSM_PREFIX, "NHS_LOGIN_URL"),
      NHS_APP_REDIRECT_LOGIN_URL: await getFromEnvironmentOrSSM(SSM_PREFIX, "NHS_APP_REDIRECT_LOGIN_URL"),
      NHS_LOGIN_CLIENT_ID: await getFromEnvironmentOrSSM(SSM_PREFIX, "NHS_LOGIN_CLIENT_ID"),
      NHS_LOGIN_SCOPE: await getFromEnvironmentOrSSM(SSM_PREFIX, "NHS_LOGIN_SCOPE"),
      NHS_LOGIN_PRIVATE_KEY: await getFromEnvironmentOrSSM(SSM_PREFIX, "NHS_LOGIN_PRIVATE_KEY"),
      NBS_URL: await getFromEnvironmentOrSSM(SSM_PREFIX, "NBS_URL"),
      NBS_BOOKING_PATH: await getFromEnvironmentOrSSM(SSM_PREFIX, "NBS_BOOKING_PATH"),
      MAX_SESSION_AGE_MINUTES: Number(await getFromEnvironmentOrSSM(SSM_PREFIX, "MAX_SESSION_AGE_MINUTES")),
      IS_APIM_AVAILABLE: (await getFromEnvironmentOrSSM(SSM_PREFIX, "IS_APIM_AVAILABLE")) === "true",
    },
    ttl: Date.now() + CACHE_TTL_MILLIS,
  };

  profilePerformanceEnd(ConfigPerformanceMarker);
  return appConfigCache.config;
};

export const getFromEnvironmentOrSSM = async (ssmPrefix: string, param: string): Promise<string> => {
  const value = process.env[param] ?? (await getSSMParam(`${ssmPrefix}${param}`));

  if (value === undefined || value === null) {
    throw new Error(`Unable to get param: ${param}`);
  }

  return value;
};

export const getUrlFromEnvironmentOrSSM = async (ssmPrefix: string, param: string): Promise<URL> => {
  return new URL(await getFromEnvironmentOrSSM(ssmPrefix, param));
};

export const _resetAppConfig = () => {
  appConfigCache = undefined;
};

export { configProvider };
export type { AppConfig };
