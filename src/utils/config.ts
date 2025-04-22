import getSSMParam from "@src/utils/get-ssm-param";

type AppConfig = {
  CONTENT_CACHE_PATH: string;
  CONTENT_API_KEY: string;
  CONTENT_API_ENDPOINT: string;
  NHS_LOGIN_URL: string;
  NHS_LOGIN_CLIENT_ID: string;
  NHS_LOGIN_SCOPE: string;
};

const configProvider = async (): Promise<AppConfig> => {
  const SSM_PREFIX = await getFromEnvironmentOrSSM("", "SSM_PREFIX");
  return {
    CONTENT_API_ENDPOINT: await getFromEnvironmentOrSSM(
      SSM_PREFIX,
      "CONTENT_API_ENDPOINT",
    ),
    CONTENT_API_KEY: await getFromEnvironmentOrSSM(
      SSM_PREFIX,
      "CONTENT_API_KEY",
    ),
    CONTENT_CACHE_PATH: await getFromEnvironmentOrSSM(
      SSM_PREFIX,
      "CONTENT_CACHE_PATH",
    ),
    NHS_LOGIN_URL: await getFromEnvironmentOrSSM(SSM_PREFIX, "NHS_LOGIN_URL"),
    NHS_LOGIN_CLIENT_ID: await getFromEnvironmentOrSSM(
      SSM_PREFIX,
      "NHS_LOGIN_CLIENT_ID",
    ),
    NHS_LOGIN_SCOPE: await getFromEnvironmentOrSSM(
      SSM_PREFIX,
      "NHS_LOGIN_SCOPE",
    ),
  };
};

const getFromEnvironmentOrSSM = async (
  ssmPrefix: string,
  param: string,
): Promise<string> => {
  const value =
    process.env[param] ?? (await getSSMParam(`${ssmPrefix}${param}`));

  if (value === undefined || value === null) {
    throw new Error(`Unable to get param: ${param}`);
  }

  return value;
};

export { configProvider };
export type { AppConfig };
