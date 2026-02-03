import { logger } from "@src/utils/logger";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Logger } from "pino";

const log: Logger = logger.child({
  module: "utils-auth-callbacks-get-session",
});

const getUpdatedSession = (session: Session, token: JWT) => {
  if (token?.user && session.user) {
    session.user.nhs_number = token.user.nhs_number;
    session.user.session_id = token.sessionId;
  } else {
    log.info(
      {
        context: {
          hasUserInToken: !!token?.user,
          hasUserInSession: !!session.user,
        },
      },
      "Missing user info, returning empty session",
    );
  }

  return session;
};

export { getUpdatedSession };
