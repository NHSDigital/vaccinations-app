// import { JWT } from "next-auth/jwt";
// import { AppConfig } from "@src/utils/config";
// import { generateRefreshClientAssertionJwt } from "@src/utils/auth/generate-auth-payload";
// import { Logger } from "pino";
// import { logger } from "@src/utils/logger";
//
// const log: Logger = logger.child({ module: "refresh-token" });
// const DEFAULT_ACCESS_TOKEN_EXPIRY: number = 5 * 60;
//
// const accessTokenHasExpired = (updatedToken: JWT, nowInSeconds: number) => {
//   return !updatedToken.expires_at || nowInSeconds >= updatedToken.expires_at;
// };
//
// const callRefreshTokenEndpointAndUpdateToken = async (config: AppConfig, updatedToken: JWT, nowInSeconds: number) => {
//   const clientAssertion = await generateRefreshClientAssertionJwt(config);
//
//   const requestBody = {
//     grant_type: "refresh_token",
//     refresh_token: updatedToken.refresh_token,
//     client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
//     client_assertion: clientAssertion,
//   };
//
//   const encodedBody = new URLSearchParams(requestBody);
//
//   log.info(`callRefreshTokenEndpointAndUpdateToken: calling ${config.NHS_LOGIN_URL}/token`);
//   const response = await fetch(`${config.NHS_LOGIN_URL}/token`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: encodedBody,
//   });
//
//   const tokensOrErrorResponseBody = await response.json();
//   if (!response.ok) {
//     log.error(
//       tokensOrErrorResponseBody,
//       `callRefreshTokenEndpointAndUpdateToken: Error response status ${response.status}`,
//     );
//     throw tokensOrErrorResponseBody;
//   }
//
//   const newTokens = tokensOrErrorResponseBody as {
//     access_token: string;
//     expires_in?: number;
//     refresh_token?: string;
//   };
//
//   log.info(`callRefreshTokenEndpointAndUpdateToken: Token refreshed successfully. Updating token.`);
//
//   const updatedTokenDebug = {
//     ...updatedToken,
//     access_token: newTokens.access_token,
//     expires_at: nowInSeconds + (newTokens.expires_in ?? DEFAULT_ACCESS_TOKEN_EXPIRY),
//     refresh_token: newTokens.refresh_token ?? updatedToken.refresh_token,
//   };
//
//   return updatedTokenDebug;
// };
