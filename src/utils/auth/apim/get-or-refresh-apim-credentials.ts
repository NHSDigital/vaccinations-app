import { retrieveApimCredentials } from "@src/utils/auth/apim/get-apim-access-token";
import { ApimAccessCredentials } from "@src/utils/auth/apim/types";
import { ExpiresSoonAt } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { JWT } from "next-auth/jwt";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "get-or-refresh-apim-credentials" });

const getOrRefreshApimCredentials = async (config: AppConfig, token: JWT, nowInSeconds: number) => {
  // Return the APIM creds from the token if still valid, or fetch new creds from APIM if expiring soon or empty
  let apimCredentials: ApimAccessCredentials | undefined;

  const isNodeJsRuntime = process.env.NEXT_RUNTIME === "nodejs";

  if (!isNodeJsRuntime) {
    // edge runtime
    if (token?.apim?.access_token && token?.apim?.expires_at) {
      return {
        accessToken: token?.apim?.access_token,
        expiresAt: token?.apim?.expires_at,
      };
    } else return undefined;
  }

  if (config.IS_APIM_AUTH_ENABLED && isNodeJsRuntime) {
    if (!token.nhs_login?.id_token) {
      log.debug("getOrRefreshApimCredentials: No NHS login ID token available. Not getting APIM creds.");
    } else if (!token.apim?.access_token) {
      log.debug(
        { context: { existingApimCredentals: token.apim } },
        "getOrRefreshApimCredentials: Getting new APIM creds.",
      );
      apimCredentials = await retrieveApimCredentials(token.nhs_login.id_token);
      log.info(`First APIM token fetched. expiry time: ${apimCredentials.expiresAt}`);
      log.debug(
        { context: { updatedApimCredentals: apimCredentials } },
        "getOrRefreshApimCredentials: New APIM creds retrieved.",
      );
    } else {
      const expiryWriggleRoom = 30;
      const expiresSoonAt: ExpiresSoonAt = (token.apim?.expires_at - expiryWriggleRoom) as ExpiresSoonAt;

      if (expiresSoonAt < nowInSeconds) {
        log.debug(
          { context: { existingApimCredentals: token.apim } },
          "getOrRefreshApimCredentials: Refreshing APIM creds.",
        );

        log.info(`APIM token expires soon ${token.apim.expires_at} ; fetching new token`);
        apimCredentials = await retrieveApimCredentials(token.nhs_login.id_token);
        log.debug(
          { context: { updatedApimCredentals: apimCredentials } },
          "getOrRefreshApimCredentials: Refreshed APIM creds retrieved.",
        );

        log.info(`New APIM token fetched. expiry time: ${apimCredentials.expiresAt}`);
      } else {
        log.debug(
          { context: { existingApimCredentals: token.apim, timeRemaining: expiresSoonAt - nowInSeconds } },
          "getOrRefreshApimCredentials: APIM creds still fresh.",
        );
        apimCredentials = {
          accessToken: token.apim.access_token,
          expiresAt: token.apim.expires_at,
        };
      }
    }
  }
  return apimCredentials;
};

export { getOrRefreshApimCredentials };
