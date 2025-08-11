import { getJwtToken } from "@src/utils/auth/get-jwt-token";
import { DecodedIdToken } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

const ASSERTED_LOGIN_IDENTITY_EXPIRY_SECONDS = 60;

const generateAssertedLoginIdentityJwt = async (config: AppConfig): Promise<string> => {
  const token = await getJwtToken();

  if (!token?.nhs_login?.id_token) {
    throw new Error(
      `Missing information. hasJwtToken=${!!token}, hasNHSLogin=${!!token?.nhs_login}, hasIDToken=${!!token?.nhs_login?.id_token}`,
    );
  }

  const jtiFromIdToken = jwtDecode<DecodedIdToken>(token.nhs_login.id_token).jti;

  const nowInSeconds: number = Math.floor(Date.now() / 1000);
  const payload = {
    iss: config.NHS_LOGIN_CLIENT_ID,
    jti: crypto.randomUUID(),
    code: jtiFromIdToken,
    exp: nowInSeconds + ASSERTED_LOGIN_IDENTITY_EXPIRY_SECONDS,
    iat: nowInSeconds,
  };

  return jwt.sign(payload, config.NHS_LOGIN_PRIVATE_KEY, { algorithm: "RS512" });
};

export { generateAssertedLoginIdentityJwt };
