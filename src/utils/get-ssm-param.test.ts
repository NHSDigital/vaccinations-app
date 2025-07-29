import { SSMClient } from "@aws-sdk/client-ssm";
import getSSMParam from "@src/utils/get-ssm-param";

jest.mock("@aws-sdk/client-ssm");

describe("getSSMParam", () => {
  const mockSend = jest.fn();

  const ENV_VARS_BEFORE_TEST = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ENV_VARS_BEFORE_TEST };
    process.env.AWS_ACCESS_KEY_ID = "test-key-id";
    process.env.AWS_SECRET_ACCESS_KEY = "test-key";
    process.env.AWS_SESSION_TOKEN = "test-tok";
    (SSMClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
  });

  afterAll(() => {
    process.env = ENV_VARS_BEFORE_TEST;
  });

  it("On success, returns correct parameter value", async () => {
    const expectedValue = "http://test.com";

    mockSend.mockResolvedValue({
      $metadata: { httpStatusCode: 200 },
      Parameter: { Value: expectedValue },
    });

    const actualValue: string | undefined = await getSSMParam("anything");

    expect(actualValue).toBe(expectedValue);
  });

  it("should return undefined if AWS call succeeds but parameter field is undefined in response body", async () => {
    mockSend.mockResolvedValue({
      $metadata: { httpStatusCode: 200 },
      Parameter: undefined,
    });

    const actualValue: string | undefined = await getSSMParam("anything");

    expect(actualValue).toBe(undefined);
  });

  it("should throw if HTTP status is not a 200 success", async () => {
    mockSend.mockResolvedValue({
      $metadata: { httpStatusCode: 400 },
    });

    await expect(getSSMParam("anything")).rejects.toThrow(
      "Unable to fetch param: anything from SSM. Error GetParameterCommand response code: 400",
    );
  });

  it("should throw if AWS configuration environment values not set", async () => {
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.AWS_SESSION_TOKEN;

    await expect(getSSMParam("anything")).rejects.toThrow(
      "Unable to fetch param: anything from SSM. SSM configuration not set",
    );
  });
});
