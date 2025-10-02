import getSSMParam from "@src/utils/get-ssm-param";
import lazyConfig from "@src/utils/lazy-config";
import { randomString } from "@test-data/meta-builder";

jest.mock("@src/utils/get-ssm-param");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("lazyConfig", () => {
  const nowInSeconds = 0;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(nowInSeconds * 1000);
    lazyConfig.resetCache();
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

    expect(await lazyConfig.CONTENT_API_ENDPOINT).toEqual(new URL("https://api-endpoint"));
    expect(await lazyConfig.CONTENT_API_KEY).toEqual("api-key");

    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}CONTENT_API_KEY`);
    expect(mockGetSSMParam).not.toHaveBeenCalledWith(`${prefix}CONTENT_API_ENDPOINT`);
  });

  it("should throw error if values aren't in env or SSM", async () => {
    const prefix: string = "test/";
    process.env.SSM_PREFIX = prefix;
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockResolvedValue(undefined);

    await expect(async () => {
      await lazyConfig.CONTENT_API_ENDPOINT;
      await lazyConfig.CONTENT_API_KEY;
    }).rejects.toThrow("Unable to get config item CONTENT_API_ENDPOINT");
    expect(mockGetSSMParam).not.toHaveBeenCalledWith(`${prefix}CONTENT_API_KEY`);
    expect(mockGetSSMParam).toHaveBeenCalledWith(`${prefix}CONTENT_API_ENDPOINT`);
    expect(mockGetSSMParam).toHaveBeenCalledTimes(1);
  });

  it("should convert IS_APIM_AUTH_ENABLED to a false boolean value", async () => {
    setupTestEnvVars("test/");
    process.env.IS_APIM_AUTH_ENABLED = "false";
    (getSSMParam as jest.Mock).mockResolvedValue("api-key");

    const actual = await lazyConfig.IS_APIM_AUTH_ENABLED;

    expect(actual).toBe(false);
  });

  it("should convert IS_APIM_AUTH_ENABLED to a true boolean value", async () => {
    setupTestEnvVars("test/");
    process.env.IS_APIM_AUTH_ENABLED = "true";
    (getSSMParam as jest.Mock).mockResolvedValue("api-key");

    const actual = await lazyConfig.IS_APIM_AUTH_ENABLED;

    expect(actual).toBe(true);
  });

  it("should reuse config values between subsequent calls", async () => {
    setupTestEnvVars("test/");
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockImplementation(() => randomString(5));

    await lazyConfig.IS_APIM_AUTH_ENABLED;

    expect(mockGetSSMParam).toHaveBeenCalled();
    mockGetSSMParam.mockClear();

    await lazyConfig.IS_APIM_AUTH_ENABLED;

    expect(mockGetSSMParam).not.toHaveBeenCalled();
  });

  it("should expire config after ttl", async () => {
    setupTestEnvVars("test/");
    const mockGetSSMParam = (getSSMParam as jest.Mock).mockImplementation(() => "test-value");

    await lazyConfig.CONTENT_API_KEY;

    expect(mockGetSSMParam).toHaveBeenCalled();
    mockGetSSMParam.mockClear();
    jest.setSystemTime(nowInSeconds * 1000 + 300 * 1000);

    await lazyConfig.CONTENT_API_KEY;

    expect(mockGetSSMParam).toHaveBeenCalled();
  });
});
