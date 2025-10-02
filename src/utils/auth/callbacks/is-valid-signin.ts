import type { DecodedIdToken } from "@src/utils/auth/types";
import lazyConfig from "@src/utils/lazy-config";
import { logger } from "@src/utils/logger";
import { jwtDecode } from "jwt-decode";
import { Account } from "next-auth";
import { Logger } from "pino";

const log: Logger = logger.child({
  module: "utils-auth-callbacks-is-valid-signin",
});

const ACCEPTED_VOTS = ["P9.Cp.Cd", "P9.Cp.Ck", "P9.Cm"];

const isValidSignIn = async (account: Account | null | undefined) => {
  if (!account || typeof account.id_token !== "string") {
    log.info("Access denied from signIn callback. Account or id_token missing.");
    return false;
  }

  const decodedToken = jwtDecode<DecodedIdToken>(account.id_token);
  const { iss, aud, identity_proofing_level, vot } = decodedToken;

  const isValidToken =
    new URL(iss).href === ((await lazyConfig.NHS_LOGIN_URL) as URL).href &&
    aud === (await lazyConfig.NHS_LOGIN_CLIENT_ID) &&
    identity_proofing_level === "P9" &&
    ACCEPTED_VOTS.includes(vot);

  if (!isValidToken) {
    log.info({ context: decodedToken }, "Access denied from signIn callback.");
  }
  return isValidToken;
};

export { isValidSignIn };
