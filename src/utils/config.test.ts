import getSSMParam from "@src/utils/get-ssm-param";
import { randomString } from "@test-data/meta-builder";

import { AppConfig, _resetConfig, configProvider } from "./config";

jest.mock("@src/utils/get-ssm-param");

describe("configProvider", () => {
  beforeEach(() => {
    _resetConfig();
    jest.clearAllMocks();
    process.env = {
      NODE_ENV: "test",
    };
  });

  const setupTestEnvVars = (prefix: string) => {
    process.env.SSM_PREFIX = prefix;
    process.env.CONTENT_API_ENDPOINT = "https://api-endpoint";
    process.env.ELIGIBILITY_API_ENDPOINT = "https://elid-endpoint";
    process.env.APIM_AUTH_URL = "https://apim-endpoint";
  };

  it("should return config object with values from env if present, else from getSSMParam", async () => {
    const prefix: string = "test/";
    setupTestEnvVars(prefix);
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockResolvedValue("api-key");

    const config: AppConfig = await configProvider();

    expect(config).toMatchObject({
      CONTENT_API_ENDPOINT: new URL("https://api-endpoint"),
      CONTENT_API_KEY: "api-key",
    });
    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}CONTENT_API_KEY`);
    expect(mockGetSSMParam).not.toHaveBeenCalledWith(`${prefix}CONTENT_API_ENDPOINT`);
  });

  it("should throw error if values aren't in env or SSM", async () => {
    const prefix: string = "test/";
    process.env.SSM_PREFIX = prefix;
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockResolvedValue(undefined);

    await expect(configProvider()).rejects.toThrow("Unable to get param: CONTENT_API_ENDPOINT");
    expect(mockGetSSMParam).not.toHaveBeenCalledWith(`${prefix}CONTENT_API_KEY`);
    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}CONTENT_API_ENDPOINT`);
    expect(mockGetSSMParam).toHaveBeenCalledTimes(1);
  });

  it("should convert IS_APIM_AVAILABLE to a false boolean value", async () => {
    setupTestEnvVars("test/");
    process.env.IS_APIM_AVAILABLE = "false";
    (getSSMParam as jest.Mock).mockResolvedValue("api-key");

    const config: AppConfig = await configProvider();

    expect(config).toMatchObject({
      IS_APIM_AVAILABLE: false,
    });
  });

  it("should convert IS_APIM_AVAILABLE to a true boolean value", async () => {
    setupTestEnvVars("test/");
    process.env.IS_APIM_AVAILABLE = "true";
    (getSSMParam as jest.Mock).mockResolvedValue("api-key");

    const config: AppConfig = await configProvider();

    expect(config).toMatchObject({
      IS_APIM_AVAILABLE: true,
    });
  });

  it("should reuse config values between subsequent calls", async () => {
    setupTestEnvVars("test/");
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockImplementation(() => randomString(5));

    const config: AppConfig = await configProvider();

    expect(mockGetSSMParam).toHaveBeenCalled();
    mockGetSSMParam.mockClear();

    const anotherConfig: AppConfig = await configProvider();

    expect(mockGetSSMParam).not.toHaveBeenCalled();
    expect(config).toBe(anotherConfig);
  });
});
