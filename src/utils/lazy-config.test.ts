import getSSMParam from "@src/utils/get-ssm-param";
import lazyConfig from "@src/utils/lazy-config";

jest.mock("@src/utils/get-ssm-param");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("lazyConfig", () => {
  const nowInSeconds = 0;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(nowInSeconds * 1000);
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

  it("should return values from env if present, else from getSSMParam", async () => {
    const prefix: string = "test/";
    setupTestEnvVars(prefix);
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockResolvedValue("api-key");

    expect(await lazyConfig.CONTENT_API_ENDPOINT).toEqual("https://api-endpoint");
    expect(await lazyConfig.CONTENT_API_KEY).toEqual("api-key");

    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}CONTENT_API_KEY`);
    expect(mockGetSSMParam).not.toHaveBeenCalledWith(`${prefix}CONTENT_API_ENDPOINT`);
  });
});
