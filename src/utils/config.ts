import getSSMParam from "@src/utils/get-ssm-param";

const configProvider = () => ({
  CONTENT_API_ENDPOINT: getFromEnvironmentOrSSM("CONTENT_API_ENDPOINT"),
  CONTENT_API_KEY: getFromEnvironmentOrSSM("CONTENT_API_KEY"),
});

const getFromEnvironmentOrSSM = (param: string): string => {
  const value: string | undefined = process.env[param] || getSSMParam(param);
  if (value === undefined || value === null) {
    throw new Error(`Unable to get param: ${param}`);
  }
  return value;
};

export default configProvider;
