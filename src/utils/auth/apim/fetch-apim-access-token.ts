import { ApimAuthError, ApimHttpError } from "@src/utils/auth/apim/exceptions";
import { ApimTokenResponse } from "@src/utils/auth/apim/types";
import { APIMClientAssertionPayload, APIMTokenPayload, IdToken } from "@src/utils/auth/types";
import config from "@src/utils/config";
import { logger } from "@src/utils/logger";
import axios, { AxiosResponse, HttpStatusCode } from "axios";
import jwt from "jsonwebtoken";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "utils-auth-apim-fetch-apim-access-token" });

const fetchAPIMAccessToken = async (idToken: IdToken): Promise<ApimTokenResponse> => {
  log.debug({ context: { idToken } }, "Fetching APIM Access Token");

  try {
    const tokenPayload: APIMTokenPayload = await generateAPIMTokenPayload(idToken);
    log.debug({ context: { tokenPayload } }, "APIM token payload");

    const response: AxiosResponse<ApimTokenResponse> = await axios.post(
      ((await config.APIM_AUTH_URL) as URL).href,
      tokenPayload,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000,
        validateStatus: (status) => status < HttpStatusCode.BadRequest,
      },
    );

    log.info({ context: { apimToken: response.data } }, "APIM access token fetched");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log.error(
        {
          error,
          context: {
            APIM_AUTH_URL: ((await config.APIM_AUTH_URL) as URL).href,
            response_data: error.response?.data,
          },
        },
        "Error calling APIM token endpoint: HTTP request failed",
      );
      throw new ApimHttpError("Error getting APIM token");
    } else {
      log.error(
        { error: error, context: { error_message: (error as Error).message } },
        "Error generating APIM token request",
      );
      throw new ApimAuthError("Error getting APIM token");
    }
  }
};

const generateAPIMTokenPayload = async (idToken: IdToken): Promise<APIMTokenPayload> => {
  const clientAssertion: string = await _generateClientAssertion();

  return {
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    subject_token: idToken,
    client_assertion: clientAssertion,
  };
};

const _generateClientAssertion = async (): Promise<string> => {
  const privateKey: string = (await config.APIM_PRIVATE_KEY) as string;
  const payload: APIMClientAssertionPayload = {
    iss: (await config.ELIGIBILITY_API_KEY) as string,
    sub: (await config.ELIGIBILITY_API_KEY) as string,
    aud: ((await config.APIM_AUTH_URL) as URL).href,
    jti: crypto.randomUUID(),
    exp: Math.floor(Date.now() / 1000) + 300,
  };
  log.debug({ context: { payload } }, "raw APIMClientAssertionPayload");

  return jwt.sign(payload, privateKey, { algorithm: "RS512", keyid: (await config.APIM_KEY_ID) as string });
};

export { fetchAPIMAccessToken, generateAPIMTokenPayload };
