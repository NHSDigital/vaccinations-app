import { Account } from "next-auth";
import { AppConfig } from "@src/utils/config";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@src/utils/auth/types";
import { Logger } from "pino";

const isValidSignIn = (
  config: AppConfig,
  log: Logger,
  account: Account | null | undefined,
) => {
  if (!account || typeof account.id_token !== "string") {
    log.info(
      "Access denied from signIn callback. Account or id_token missing.",
    );
    return false;
  }

  const decodedToken = jwtDecode<DecodedToken>(account.id_token);
  const { iss, aud, identity_proofing_level } = decodedToken;

  const isValidToken =
    iss === config.NHS_LOGIN_URL &&
    aud === config.NHS_LOGIN_CLIENT_ID &&
    identity_proofing_level === "P9";

  if (!isValidToken) {
    log.info(
      `Access denied from signIn callback. iss: ${iss}, aud: ${aud}, identity_proofing_level: ${identity_proofing_level}`,
    );
  }
  return isValidToken;
};

export { isValidSignIn };
