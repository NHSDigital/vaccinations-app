import configProvider from "./config";
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
    process.env.CONTENT_API_ENDPOINT = "api-endpoint";
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockResolvedValue(
      "api-key",
    );

    const config = await configProvider();

    expect(config).toEqual({
      CONTENT_API_ENDPOINT: "api-endpoint",
      CONTENT_API_KEY: "api-key",
    });
    expect(mockGetSSMParam).toHaveBeenCalledWith("CONTENT_API_KEY");
    expect(mockGetSSMParam).not.toHaveBeenCalledWith("CONTENT_API_ENDPOINT");
    expect(mockGetSSMParam).toHaveBeenCalledTimes(1);
  });

  it("should throw error if values aren't in env or SSM", async () => {
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockResolvedValue(
      undefined,
    );

    await expect(configProvider()).rejects.toThrow(
      "Unable to get param: CONTENT_API_ENDPOINT",
    );
    expect(mockGetSSMParam).not.toHaveBeenCalledWith("CONTENT_API_KEY");
    expect(mockGetSSMParam).toHaveBeenCalledWith("CONTENT_API_ENDPOINT");
    expect(mockGetSSMParam).toHaveBeenCalledTimes(1);
  });
});
