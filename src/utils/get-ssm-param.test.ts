import { SSMClient } from "@aws-sdk/client-ssm";
import getSSMParam from "@src/utils/get-ssm-param";

jest.mock("@aws-sdk/client-ssm");

describe("getSSMParam", () => {
  const mockSend = jest.fn();
  beforeEach(() => {
    (SSMClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
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

  it("On failure, returns undefined", async () => {
    mockSend.mockResolvedValue({
      $metadata: { httpStatusCode: 400 },
    });

    const actualValue: string | undefined = await getSSMParam("anything");

    expect(actualValue).toBeUndefined();
  });
});
