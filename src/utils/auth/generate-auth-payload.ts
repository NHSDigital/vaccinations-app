import { AppConfig } from "@src/utils/config";
import { generateSignedJwt } from "@src/utils/auth/generate-signed-jwt";
import {
  AssertedLoginIdentityPayload,
  RefreshClientAssertionPayload,
} from "@src/utils/auth/types";
import { auth } from "@project/auth";
import { Logger } from "pino";
import { logger } from "@src/utils/logger";

const log: Logger = logger.child({ module: "generate-auth-payload" });

const REFRESH_CLIENT_ASSERTION_EXPIRY_SECONDS = 300;
const ASSERTED_LOGIN_IDENTITY_EXPIRY_SECONDS = 60;

const generateRefreshClientAssertionJwt = async (
  config: AppConfig,
): Promise<string> => {
  const refreshClientPayload = {
    sub: config.NHS_LOGIN_CLIENT_ID,
    aud: `${config.NHS_LOGIN_URL}/token`,
  };

  return generateSignedJwtWith(
    config,
    refreshClientPayload,
    REFRESH_CLIENT_ASSERTION_EXPIRY_SECONDS,
  );
};

const generateAssertedLoginIdentityJwt = async (
  config: AppConfig,
): Promise<string> => {
  const session = await auth();
  const jtiFromIdToken = session?.user.id_token.jti;

  if (!jtiFromIdToken) {
    log.error(
      "Error creating SSO assertedLoginIdentity: id_token.jti attribute missing from session",
    );
    throw new Error(
      "Error creating SSO assertedLoginIdentity: id_token.jti attribute missing from session",
    );
  }

  const assertedLoginIdentityPayload = {
    code: jtiFromIdToken,
  };

  return generateSignedJwtWith(
    config,
    assertedLoginIdentityPayload,
    ASSERTED_LOGIN_IDENTITY_EXPIRY_SECONDS,
  );
};

const generateSignedJwtWith = async (
  config: AppConfig,
  extraPayloadFields:
    | RefreshClientAssertionPayload
    | AssertedLoginIdentityPayload,
  expiryTimeSeconds: number,
) => {
  const now = Math.floor(Date.now() / 1000);

  const commonAuthPayload = {
    iss: config.NHS_LOGIN_CLIENT_ID,
    jti: crypto.randomUUID(),
    exp: now + expiryTimeSeconds,
    iat: now,
  };

  const payload = {
    ...commonAuthPayload,
    ...extraPayloadFields,
  };

  return await generateSignedJwt(config, payload);
};

export { generateRefreshClientAssertionJwt, generateAssertedLoginIdentityJwt };
