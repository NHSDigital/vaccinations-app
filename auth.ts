import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import NextAuth from "next-auth";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  iss: string;
  aud: string;
  identity_proofing_level: string;
}

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
    callbacks: {
      async signIn({ account }) {
        if (!account || typeof account.id_token !== "string") {
          return false;
        }

        const decodedToken = jwtDecode<DecodedToken>(account.id_token);
        const AUTH_ISSUER_URL = process.env.NHS_LOGIN_URL;
        const AUTH_CLIENT_ID = process.env.NHS_LOGIN_CLIENT_ID;

        const { iss, aud, identity_proofing_level } = decodedToken;

        const isValidToken =
          iss === AUTH_ISSUER_URL &&
          aud === AUTH_CLIENT_ID &&
          identity_proofing_level === "P9";

        return isValidToken;
      },
      async jwt({ token, account, profile}) {
        if(account && profile) {
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
    debug: process.env.NODE_ENV === "development"
  };
});
