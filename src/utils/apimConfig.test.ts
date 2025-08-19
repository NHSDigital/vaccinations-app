import { ApimConfig, _resetApimConfig, apimConfigProvider } from "@src/utils/apimConfig";
import getSSMParam from "@src/utils/get-ssm-param";
import { randomString } from "@test-data/meta-builder";

jest.mock("@src/utils/get-ssm-param");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("apimConfigProvider", () => {
  const nowInSeconds = 0;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(nowInSeconds * 1000);
    _resetApimConfig();
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
    process.env.APIM_AUTH_URL = "https://apim-endpoint.com";
    process.env.APIM_KEY_ID = "apim-key-id";
  };

  it("should return APIM config object with values from env if present, else from getSSMParam", async () => {
    const prefix: string = "test/";
    setupTestEnvVars(prefix);
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockResolvedValue("mock-ssm-value");

    const config: ApimConfig = await apimConfigProvider();

    expect(config).toMatchObject({
      ELIGIBILITY_API_KEY: "mock-ssm-value",
      APIM_PRIVATE_KEY: "mock-ssm-value",
      APIM_AUTH_URL: new URL("https://apim-endpoint.com"),
      APIM_KEY_ID: "apim-key-id",
    });
    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}ELIGIBILITY_API_KEY`);
    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}APIM_PRIVATE_KEY`);
  });

  it("should reuse apim config values between subsequent calls", async () => {
    setupTestEnvVars("test/");
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockImplementation(() => randomString(5));

    const config: ApimConfig = await apimConfigProvider();

    expect(mockGetSSMParam).toHaveBeenCalled();
    mockGetSSMParam.mockClear();

    const anotherConfig: ApimConfig = await apimConfigProvider();

    expect(mockGetSSMParam).not.toHaveBeenCalled();
    expect(config).toBe(anotherConfig);
  });

  it("should expire apim config after ttl", async () => {
    setupTestEnvVars("test/");
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockImplementation(() => "test-value");

    const config: ApimConfig = await apimConfigProvider();

    expect(mockGetSSMParam).toHaveBeenCalled();
    mockGetSSMParam.mockClear();
    jest.setSystemTime(nowInSeconds * 1000 + 300 * 1000);

    const anotherConfig: ApimConfig = await apimConfigProvider();

    expect(mockGetSSMParam).toHaveBeenCalled();
    expect(config).toEqual(anotherConfig);
  });
});
