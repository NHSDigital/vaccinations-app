import { AppConfig } from "@src/utils/config";
import { generateSignedJwt } from "@src/utils/auth/generate-signed-jwt";

const generateClientAssertion = async (config: AppConfig): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: config.NHS_LOGIN_CLIENT_ID,
    sub: config.NHS_LOGIN_CLIENT_ID,
    aud: `${config.NHS_LOGIN_URL}/token`,
    jti: crypto.randomUUID(),
    exp: now + 300,
    iat: now,
  };

  return await generateSignedJwt(config, payload);
};

export { generateClientAssertion };
