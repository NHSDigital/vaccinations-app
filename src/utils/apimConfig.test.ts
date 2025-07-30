import { ApimConfig, _resetApimConfig, apimConfigProvider } from "@src/utils/apimConfig";
import getSSMParam from "@src/utils/get-ssm-param";
import { randomString } from "@test-data/meta-builder";

jest.mock("@src/utils/get-ssm-param");

describe("apimConfigProvider", () => {
  beforeEach(() => {
    _resetApimConfig();
    jest.clearAllMocks();
    process.env = {
      NODE_ENV: "test",
    };
  });

  it("should return APIM config object with values from env if present, else from getSSMParam", async () => {
    const prefix: string = "test/";
    process.env.SSM_PREFIX = prefix;
    process.env.APIM_AUTH_URL = "https://apim-endpoint.com";
    process.env.APIM_KEY_ID = "apim-key-id";
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockResolvedValue("mock-ssm-value");

    const config: ApimConfig = await apimConfigProvider();

    expect(config).toMatchObject({
      CONTENT_API_KEY: "mock-ssm-value",
      APIM_PRIVATE_KEY: "mock-ssm-value",
      APIM_AUTH_URL: new URL("https://apim-endpoint.com"),
      APIM_KEY_ID: "apim-key-id",
    });
    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}CONTENT_API_KEY`);
    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}APIM_PRIVATE_KEY`);
  });

  it("should reuse config values between subsequent calls", async () => {
    process.env.APIM_AUTH_URL = "https://apim-endpoint.com";
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockImplementation(() => randomString(5));

    const config: ApimConfig = await apimConfigProvider();

    expect(mockGetSSMParam).toHaveBeenCalled();
    mockGetSSMParam.mockClear();

    const anotherConfig: ApimConfig = await apimConfigProvider();

    expect(mockGetSSMParam).not.toHaveBeenCalled();
    expect(config).toBe(anotherConfig);
  });
});
