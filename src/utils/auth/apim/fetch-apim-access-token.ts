import { ApimConfig, apimConfigProvider } from "@src/utils/apimConfig";
import { ApimTokenResponse } from "@src/utils/auth/apim/types";
import { APIMClientAssertionPayload, APIMTokenPayload, IdToken } from "@src/utils/auth/types";
import { logger } from "@src/utils/logger";
import axios, { AxiosResponse } from "axios";
import jwt from "jsonwebtoken";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "get-apim-access-token" });

const generateClientAssertion = async (apimConfig: ApimConfig): Promise<string> => {
  const privateKey: string = apimConfig.APIM_PRIVATE_KEY;
  const payload: APIMClientAssertionPayload = {
    iss: apimConfig.CONTENT_API_KEY,
    sub: apimConfig.CONTENT_API_KEY,
    aud: apimConfig.APIM_AUTH_URL.href,
    jti: crypto.randomUUID(),
    exp: Math.floor(Date.now() / 1000) + 300,
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS512", keyid: apimConfig.APIM_KEY_ID });
};

const generateAPIMTokenPayload = async (apimConfig: ApimConfig, idToken: IdToken): Promise<APIMTokenPayload> => {
  const clientAssertion: string = await generateClientAssertion(apimConfig);

  const tokenPayload: APIMTokenPayload = {
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    subject_token: idToken,
    client_assertion: clientAssertion,
  };
  return tokenPayload;
};

const fetchAPIMAccessTokenForIDToken = async (idToken: IdToken): Promise<ApimTokenResponse> => {
  const apimConfig: ApimConfig = await apimConfigProvider();

  try {
    const tokenPayload = generateAPIMTokenPayload(apimConfig, idToken);

    const response: AxiosResponse<ApimTokenResponse> = await axios.post(apimConfig.APIM_AUTH_URL.href, tokenPayload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 5000,
    });

    log.info("APIM access token fetched");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log.error({ error, APIM_AUTH_URL: apimConfig.APIM_AUTH_URL.href }, `Error calling APIM token endpoint`);
    } else {
      log.error(error, `Error generating APIM token request`);
    }
    throw new Error(`Error getting APIM token`);
  }
};

export { fetchAPIMAccessTokenForIDToken, generateAPIMTokenPayload };
