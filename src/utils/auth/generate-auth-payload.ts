import { AppConfig } from "@src/utils/config";
import { generateSignedJwt } from "@src/utils/auth/generate-signed-jwt";
import { CommonAuthPayload } from "@src/utils/auth/types";

const REFRESH_CLIENT_ASSERTION_EXPIRY_SECONDS = 300;

const generateRefreshClientAssertionJwt = async (
  config: AppConfig,
): Promise<string> => {
  const refreshClientPayload = {
    sub: config.NHS_LOGIN_CLIENT_ID,
    aud: `${config.NHS_LOGIN_URL}/token`,
  };

  const commonAuthPayload = generateCommonAuthPayload(
    config,
    REFRESH_CLIENT_ASSERTION_EXPIRY_SECONDS,
  );

  const payload = {
    ...commonAuthPayload,
    ...refreshClientPayload,
  };

  return await generateSignedJwt(config, payload);
};

const generateAssertedLoginIdentityJwt = async (): Promise<string> => {
  throw Error("not-yet-implemented");
};

const generateCommonAuthPayload = (
  config: AppConfig,
  expiryTimeSeconds: number,
): CommonAuthPayload => {
  const now = Math.floor(Date.now() / 1000);

  return {
    iss: config.NHS_LOGIN_CLIENT_ID,
    jti: crypto.randomUUID(),
    exp: now + expiryTimeSeconds,
    iat: now,
  };
};

export { generateRefreshClientAssertionJwt, generateAssertedLoginIdentityJwt };
