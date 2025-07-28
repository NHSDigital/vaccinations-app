import { auth } from "@project/auth";
import { DecodedIdToken } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

const ASSERTED_LOGIN_IDENTITY_EXPIRY_SECONDS = 60;

const generateAssertedLoginIdentityJwt = async (config: AppConfig): Promise<string> => {
  const session = await auth();

  if (!session?.nhs_login?.id_token) {
    throw new Error(
      `Missing information. hasSession=${!!session}, hasNHSLogin=${!!session?.nhs_login}, hasIDToken=${!!session?.nhs_login?.id_token}`,
    );
  }

  const jtiFromIdToken = jwtDecode<DecodedIdToken>(session.nhs_login.id_token).jti;

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
