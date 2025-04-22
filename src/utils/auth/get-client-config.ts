import * as client from "openid-client";
import { pemToPrivateKey } from "@src/utils/auth/pem-to-private-key";
import { getAuthConfig } from "@src/utils/auth/get-auth-config";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "get-client-config" });

const getClientConfig = async () => {
  const key = await pemToPrivateKey();
  const authConfig = await getAuthConfig();
  try {
    return await client.discovery(
      new URL(authConfig.url!),
      authConfig.client_id!,
      "",
      client.PrivateKeyJwt(key),
    );
  } catch (e) {
    log.error(
      { error: e },
      "Error thrown while calling client.discovery for OIDC client",
    );
    throw e;
  }
};

export { getClientConfig };
