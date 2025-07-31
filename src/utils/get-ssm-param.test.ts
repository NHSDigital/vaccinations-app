import getSSMParam from "@src/utils/get-ssm-param";
import axios from "axios";

jest.mock("axios");

describe("getSSMParam", () => {
  beforeEach(() => {
    process.env.AWS_SESSION_TOKEN = "test-tok";
  });

  it("On success, returns correct parameter value", async () => {
    const expectedValue = "test-value";
    (axios.get as jest.Mock).mockResolvedValue({
      data: { Parameter: { Value: expectedValue } },
    });

    const actualValue: string = await getSSMParam("anything");

    expect(actualValue).toBe(expectedValue);
  });

  it("should throw error when api call fails", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("error"));

    expect(getSSMParam("anything")).rejects.toThrow("error");
  });
});
