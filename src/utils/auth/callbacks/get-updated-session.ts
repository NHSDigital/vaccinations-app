import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

const getUpdatedSession = (session: Session, token: JWT) => {
  if (token?.user && session.user) {
    session.user.nhs_number = token.user.nhs_number;
    session.user.birthdate = token.user.birthdate;
  }

  return session;
};

export { getUpdatedSession };
