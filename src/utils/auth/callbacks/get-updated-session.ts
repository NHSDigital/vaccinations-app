import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

const getUpdatedSession = (session: Session, token: JWT) => {
  if (token?.user && session.user) {
    session.user.nhs_number = token.user.nhs_number;
    session.user.birthdate = token.user.birthdate;
  }

  if (token?.nhs_login) {
    session.nhs_login = {
      id_token: token.nhs_login.id_token,
    };
  }

  return session;
};

export { getUpdatedSession };
