import getSSMParam from "@src/utils/get-ssm-param";

const configProvider = async () => ({
  CONTENT_API_ENDPOINT: await getFromEnvironmentOrSSM("CONTENT_API_ENDPOINT"),
  CONTENT_API_KEY: await getFromEnvironmentOrSSM("CONTENT_API_KEY"),
});

const getFromEnvironmentOrSSM = async (param: string): Promise<string> => {
  const value = process.env[param] || (await getSSMParam(param));

  if (value === undefined || value === null) {
    throw new Error(`Unable to get param: ${param}`);
  }

  return value;
};

export default configProvider;
