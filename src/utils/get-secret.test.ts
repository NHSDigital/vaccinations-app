import getSecret from "@src/utils/get-secret";
import axios from "axios";

jest.mock("axios");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("getSSMParam", () => {
  beforeEach(() => {
    process.env.AWS_SESSION_TOKEN = "test-tok";
  });

  it("should call axios with the correct url", async () => {
    const secretName = "anything";
    const expectedValue = "test-value";
    (axios.get as jest.Mock).mockResolvedValue({
      data: { SecretString: expectedValue },
    });

    await getSecret(secretName);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("localhost:2773/secretsmanager/get"),
      expect.objectContaining({
        params: {
          secretId: secretName,
        },
        headers: expect.objectContaining({
          "X-Aws-Parameters-Secrets-Token": expect.any(String),
        }),
      }),
    );
  });

  it("On success, returns correct parameter value", async () => {
    const expectedValue = "test-value";
    (axios.get as jest.Mock).mockResolvedValue({
      data: { SecretString: expectedValue },
    });

    const actualValue: string = await getSecret("anything");

    expect(actualValue).toBe(expectedValue);
  });

  it("should throw error when api call fails", () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("error"));

    expect(getSecret("anything")).rejects.toThrow("error");
  });
});
