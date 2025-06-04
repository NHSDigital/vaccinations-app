import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

const getUpdatedSession = (session: Session, token: JWT) => {
  console.log(token);
  console.log(session);
  if (token?.user && session.user) {
    session.user.nhs_number = token.user.nhs_number;
    session.user.birthdate = token.user.birthdate;
    session.user.access_token = token.access_token;
    session.user.id_token = {
      jti: token.id_token.jti,
    };
  }

  return session;
};

export { getUpdatedSession };
