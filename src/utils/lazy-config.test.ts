import config, { ConfigError } from "@src/utils/config";
import getSSMParam from "@src/utils/get-ssm-param";
import { randomString } from "@test-data/meta-builder";

jest.mock("@src/utils/get-ssm-param");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("lazyConfig", () => {
  const nowInSeconds = 0;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(nowInSeconds * 1000);
    config.resetCache();
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

    expect(await config.CONTENT_API_ENDPOINT).toEqual(new URL("https://api-endpoint"));
    expect(await config.CONTENT_API_KEY).toEqual("api-key");

    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}CONTENT_API_KEY`);
    expect(mockGetSSMParam).not.toHaveBeenCalledWith(`${prefix}CONTENT_API_ENDPOINT`);
  });

  it("should throw error if values aren't in env or SSM", async () => {
    const prefix: string = "test/";
    process.env.SSM_PREFIX = prefix;
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockResolvedValue(undefined);

    await expect(async () => {
      await config.CONTENT_API_ENDPOINT;
      await config.CONTENT_API_KEY;
    }).rejects.toThrow("Unable to get config item CONTENT_API_ENDPOINT");
    expect(mockGetSSMParam).not.toHaveBeenCalledWith(`${prefix}CONTENT_API_KEY`);
    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}CONTENT_API_ENDPOINT`);
    expect(mockGetSSMParam).toHaveBeenCalledTimes(1);
  });

  it("should convert IS_APIM_AUTH_ENABLED to a false boolean value", async () => {
    setupTestEnvVars("test/");
    process.env.IS_APIM_AUTH_ENABLED = "false";

    const actual = await config.IS_APIM_AUTH_ENABLED;

    expect(actual).toBe(false);
  });

  it("should convert IS_APIM_AUTH_ENABLED to a true boolean value", async () => {
    setupTestEnvVars("test/");
    process.env.IS_APIM_AUTH_ENABLED = "true";

    const actual = await config.IS_APIM_AUTH_ENABLED;

    expect(actual).toBe(true);
  });

  it("should convert MAX_SESSION_AGE_MINUTES to a number", async () => {
    setupTestEnvVars("test/");
    process.env.MAX_SESSION_AGE_MINUTES = "99";

    const actual = await config.MAX_SESSION_AGE_MINUTES;

    expect(actual).toBe(99);
  });

  it("should throw for invalid URL", async () => {
    setupTestEnvVars("test/");
    process.env.APIM_AUTH_URL = "not-a-url";

    await expect(async () => {
      await config.APIM_AUTH_URL;
    }).rejects.toThrow(ConfigError);
  });

  it("should throw for invalid number", async () => {
    setupTestEnvVars("test/");
    process.env.MAX_SESSION_AGE_MINUTES = "not-a-number";

    await expect(async () => {
      await config.MAX_SESSION_AGE_MINUTES;
    }).rejects.toThrow(ConfigError);
  });

  it("should reuse config values between subsequent calls", async () => {
    setupTestEnvVars("test/");
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockImplementation(() => randomString(5));

    await config.NHS_LOGIN_CLIENT_ID;

    expect(mockGetSSMParam).toHaveBeenCalled();
    mockGetSSMParam.mockClear();

    await config.NHS_LOGIN_CLIENT_ID;

    expect(mockGetSSMParam).not.toHaveBeenCalled();
  });

  it("should expire config after ttl", async () => {
    setupTestEnvVars("test/");
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockImplementation(() => "test-value");

    await config.CONTENT_API_KEY;

    expect(mockGetSSMParam).toHaveBeenCalled();
    mockGetSSMParam.mockClear();
    jest.setSystemTime(nowInSeconds * 1000 + 300 * 1000 + 1);

    await config.CONTENT_API_KEY;

    expect(mockGetSSMParam).toHaveBeenCalled();
  });

  it("should retry fetching from SSM if the first attempt fails", async () => {
    const key = "API_SECRET";
    const expectedValue = "value-from-ssm-on-second-try";
    const expectedSsmPath = `/test/ci/${key}`;

    process.env.SSM_PREFIX = "/test/ci/";

    const mockGetSSMParam = (getSSMParam as jest.Mock)
      .mockRejectedValueOnce(new Error("SSM is temporarily unavailable"))
      .mockResolvedValue(expectedValue);

    const resultPromise = config.API_SECRET;
    await jest.runOnlyPendingTimersAsync();
    const result = await resultPromise;

    expect(result).toBe(expectedValue);
    expect(mockGetSSMParam).toHaveBeenCalledTimes(2);
    expect(mockGetSSMParam).toHaveBeenCalledWith(expectedSsmPath);
  });
});
