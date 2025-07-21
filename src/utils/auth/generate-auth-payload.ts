import { auth } from "@project/auth";
import { AssertedLoginIdentityPayload, CommonAuthPayload, RefreshClientAssertionPayload } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import jwt from "jsonwebtoken";

const ASSERTED_LOGIN_IDENTITY_EXPIRY_SECONDS = 60;

const generateAssertedLoginIdentityJwt = async (config: AppConfig): Promise<string> => {
  const session = await auth();
  const jtiFromIdToken = session?.user.id_token.jti;

  if (!jtiFromIdToken) {
    throw new Error("Error creating SSO assertedLoginIdentity: id_token.jti attribute missing from session");
  }

  const assertedLoginIdentityPayload = {
    code: jtiFromIdToken,
  };

  return generateSignedJwtWith(config, assertedLoginIdentityPayload, ASSERTED_LOGIN_IDENTITY_EXPIRY_SECONDS);
};

const generateSignedJwtWith = async (
  config: AppConfig,
  extraPayloadFields: RefreshClientAssertionPayload | AssertedLoginIdentityPayload,
  expiryTimeSeconds: number,
) => {
  const now = Math.floor(Date.now() / 1000);

  const commonAuthPayload: CommonAuthPayload = {
    iss: config.NHS_LOGIN_CLIENT_ID,
    jti: crypto.randomUUID(),
    exp: now + expiryTimeSeconds,
    iat: now,
  };

  const payload = {
    ...commonAuthPayload,
    ...extraPayloadFields,
  };

  return jwt.sign(payload, config.NHS_LOGIN_PRIVATE_KEY, { algorithm: "RS512" });
};

export { generateAssertedLoginIdentityJwt };
