import getSSMParam from "@src/utils/get-ssm-param";
import { randomString } from "@test-data/meta-builder";

import { AppConfig, _resetAppConfig, configProvider } from "./config";

jest.mock("@src/utils/get-ssm-param");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("configProvider", () => {
  const nowInSeconds = 0;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(nowInSeconds * 1000);
    _resetAppConfig();
    process.env = {
      NODE_ENV: "test",
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
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

  it("should convert IS_APIM_AUTH_ENABLED to a false boolean value", async () => {
    setupTestEnvVars("test/");
    process.env.IS_APIM_AUTH_ENABLED = "false";
    (getSSMParam as jest.Mock).mockResolvedValue("api-key");

    const config: AppConfig = await configProvider();

    expect(config).toMatchObject({
      IS_APIM_AUTH_ENABLED: false,
    });
  });

  it("should convert IS_APIM_AUTH_ENABLED to a true boolean value", async () => {
    setupTestEnvVars("test/");
    process.env.IS_APIM_AUTH_ENABLED = "true";
    (getSSMParam as jest.Mock).mockResolvedValue("api-key");

    const config: AppConfig = await configProvider();

    expect(config).toMatchObject({
      IS_APIM_AUTH_ENABLED: true,
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

  it("should expire config after ttl", async () => {
    setupTestEnvVars("test/");
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockImplementation(() => "test-value");

    const config: AppConfig = await configProvider();

    expect(mockGetSSMParam).toHaveBeenCalled();
    mockGetSSMParam.mockClear();
    jest.setSystemTime(nowInSeconds * 1000 + 300 * 1000);

    const anotherConfig: AppConfig = await configProvider();

    expect(mockGetSSMParam).toHaveBeenCalled();
    expect(config).toEqual(anotherConfig);
  });
});
