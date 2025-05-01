import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { configProvider } from "@src/utils/config";

jest.mock("@src/utils/config");
jest.mock("@src/utils/auth/pem-to-crypto-key");

describe("provider", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    NHS_LOGIN_URL: "",
    NHS_LOGIN_CLIENT_ID: "",
    NHS_LOGIN_SCOPE: "",
    NHS_LOGIN_PRIVATE_KEY: ""
  }));

  it("should be configured correctly", async () => {
    const provider = await NHSLoginAuthProvider();
    expect(provider.type).toEqual("oidc");
    expect(provider.authorization.params.prompt).toBe("none");
    expect(provider.client?.token_endpoint_auth_method).toEqual("private_key_jwt");
    expect(provider.checks).toEqual(["state"]);
  });
})
