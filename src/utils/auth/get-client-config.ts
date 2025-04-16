import * as client from "openid-client";
import { pemToPrivateKey } from "@src/utils/auth/pem-to-private-key";
import { getAuthConfig } from "@src/utils/auth/get-auth-config";

const getClientConfig = async () => {
  const key = await pemToPrivateKey();
  const authConfig = await getAuthConfig();
  return await client.discovery(
    new URL(authConfig.url!),
    authConfig.client_id!,
    "",
    client.PrivateKeyJwt(key),
  );
};

export { getClientConfig };
