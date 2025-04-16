/**
 * @jest-environment node
 */

import { getAuthConfig } from "@src/utils/auth/get-auth-config";
import { pemToPrivateKey } from "@src/utils/auth/pem-to-private-key";
import { getClientConfig } from "@src/utils/auth/get-client-config";
import * as client from "openid-client";

const mockPrivateKeyJWT = {};
const mockDiscoveryClientConfig = {};

jest.mock("@src/utils/auth/pem-to-private-key");
jest.mock("@src/utils/auth/get-auth-config");
jest.mock("openid-client", () => {
  return {
    discovery: jest.fn(() => mockDiscoveryClientConfig),
    PrivateKeyJwt: jest.fn(() => mockPrivateKeyJWT),
  };
});

const mockAuthConfig = {
  url: "https://url-value",
  client_id: "client-id-value",
};
const mockCryptoKey = {};
const mockAuthConfigUrl = new URL(mockAuthConfig.url);

(getAuthConfig as jest.Mock).mockImplementation(() => mockAuthConfig);
(pemToPrivateKey as jest.Mock).mockImplementation(() => mockCryptoKey);

describe("getClientConfig", () => {
  it("calls client discovery with expected args and returns result", async () => {
    const clientConfig = await getClientConfig();

    expect(client.PrivateKeyJwt).toHaveBeenCalledWith(mockCryptoKey);
    expect(client.discovery).toHaveBeenCalledWith(
      mockAuthConfigUrl,
      mockAuthConfig.client_id,
      "",
      mockPrivateKeyJWT,
    );
    expect(clientConfig).toBe(mockDiscoveryClientConfig);
  });

  // it("throws if error thrown by discovery method", () => {
  // TODO: VIA 87 2025-04-16 how to get the mock of client.discovery to throw an error when we cannot reference the module by name? (starred import)
  //
  // const errorThrownByDiscovery = new Error("error-thrown-by-discovery");
  // set discovery mock to throw that
  // expect(await getClientConfig()).rejects.toThrow(errorThrownByDiscovery);
  // });
});
