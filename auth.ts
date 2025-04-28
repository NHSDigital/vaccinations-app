import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import NextAuth from "next-auth";

const SSO_FAILURE_ROUTE = "/sso-failure";

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  return {
    providers: [await NHSLoginAuthProvider()],
    pages: {
      signIn: SSO_FAILURE_ROUTE,
      signOut: SSO_FAILURE_ROUTE,
      error: SSO_FAILURE_ROUTE,
      verifyRequest: SSO_FAILURE_ROUTE,
      newUser: SSO_FAILURE_ROUTE
    },
    trustHost: true,
    debug: process.env.PINO_LOG_LEVEL === "info"
  };
});
