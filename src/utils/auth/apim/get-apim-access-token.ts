import { APIMClientAssertionPayload, APIMTokenPayload } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import axios from "axios";
import jwt from "jsonwebtoken";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "get-apim-access-token" });

const generateClientAssertion = async (config: AppConfig): Promise<string> => {
  const privateKey: string = config.APIM_PRIVATE_KEY;
  const payload: APIMClientAssertionPayload = {
    iss: config.CONTENT_API_KEY,
    sub: config.CONTENT_API_KEY,
    aud: config.APIM_AUTH_URL.toString(),
    jti: crypto.randomUUID(),
    exp: Math.floor(Date.now() / 1000) + 300,
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS512", keyid: config.APIM_KEY_ID });
};

const generateAPIMTokenPayload = async (config: AppConfig, idToken: string): Promise<APIMTokenPayload> => {
  const clientAssertion: string = await generateClientAssertion(config);

  const tokenPayload: APIMTokenPayload = {
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    subject_token: idToken,
    client_assertion: clientAssertion,
  };
  return tokenPayload;
};

const getAPIMAccessTokenForIDToken = async (config: AppConfig, idToken: string): Promise<string | undefined> => {
  try {
    const tokenPayload = generateAPIMTokenPayload(config, idToken);

    const response = await axios.post(config.APIM_AUTH_URL.toString(), tokenPayload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 5000,
    });

    log.info("APIM access token fetched");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log.error(
        {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        },
        `Error calling APIM token endpoint ${config.APIM_AUTH_URL.toString()}`,
      );
    } else {
      log.error(error, `Error generating APIM token request`);
    }
    throw new Error(`Error getting APIM token`);
  }
};

export { getAPIMAccessTokenForIDToken, generateAPIMTokenPayload };
