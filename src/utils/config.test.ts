import { AppConfig, configProvider } from "./config";
import getSSMParam from "@src/utils/get-ssm-param";

jest.mock("@src/utils/get-ssm-param");

describe("configProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      NODE_ENV: "test",
    };
  });

  it("should return config object with values from env if present, else from getSSMParam", async () => {
    const prefix: string = "test/";
    process.env.SSM_PREFIX = prefix;
    process.env.CONTENT_API_ENDPOINT = "api-endpoint";
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockResolvedValue("api-key");

    const config: AppConfig = await configProvider();

    expect(config).toMatchObject({
      CONTENT_API_ENDPOINT: "api-endpoint",
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
});
