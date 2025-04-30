import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";
import NextAuth from "next-auth";
import { jwtDecode } from "jwt-decode";
import { Logger } from "pino";

export interface DecodedToken {
  iss: string;
  aud: string;
  identity_proofing_level: string;
}

const SSO_FAILURE_ROUTE = "/sso-failure";
const log: Logger = logger.child({ module: "auth" });

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
    callbacks: {
      async signIn({ account }) {
        if (!account || typeof account.id_token !== "string") {
          log.info("Access denied from signIn callback. Account or id_token missing.");
          return false;
        }

        const decodedToken = jwtDecode<DecodedToken>(account.id_token);
        const { iss, aud, identity_proofing_level } = decodedToken;
        const configs: AppConfig = await configProvider();

        const isValidToken =
          iss === configs.NHS_LOGIN_URL &&
          aud === configs.NHS_LOGIN_CLIENT_ID &&
          identity_proofing_level === "P9";

        if (!isValidToken) {
          log.info(`Access denied from signIn callback. iss: ${iss}, aud: ${aud}, identity_proofing_level: ${identity_proofing_level}`);
        }
        return isValidToken;
      },
      async jwt({ token, account, profile}) {
        if(account && profile && token) {
          token.userinfo = {
            nhs_number: profile.nhs_number,
            birthdate: profile.birthdate,
          };
        }

        return token;
      },
      async session({ session, token }) {
        if(token?.userinfo && session.user) {
          Object.assign(session.user, {
            ...session.user,
            ...token.userinfo
          })
        }
        return session;
      }
    },
    debug: process.env.PINO_LOG_LEVEL === "info"
  };
});
