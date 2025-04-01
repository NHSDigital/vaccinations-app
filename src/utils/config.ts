import getSSMParam from "@src/utils/get-ssm-param";

const configProvider = () => ({
  CONTENT_API_ENDPOINT: getFromEnvironmentOrSSM("CONTENT_API_ENDPOINT"),
  CONTENT_API_KEY: getFromEnvironmentOrSSM("CONTENT_API_KEY"),
});

const getFromEnvironmentOrSSM = (param: string): string => {
  return process.env[param] || getSSMParam(param);
};

export default configProvider;
