import { FAKE_LOGIN_ENDPOINT } from "@src/app/api/fake-login/.well-known/openid-configuration/route";
import { logger } from "@src/utils/logger";
import jwt from "jsonwebtoken";

const log = logger.child({ name: "fake-login" });

const NHS_NUMBERS = [
  "9686368973",
  "9686368906",
  "9658218873",
  "9658218881",
  "9658218903",
  "9658218989",
  "9658218997",
  "9658219004",
  "9658219012",
  "9658220142",
  "9658220150",
];
const getRandomNHSNumber = (): string => {
  return NHS_NUMBERS.at(Math.floor(Math.random() * NHS_NUMBERS.length))!;
};

const getIDTokenForNHSNumber = (nhsNumber: string): string => {
  const FAKE_LOGIN_PRIVATE_KEY: string = process.env.NHS_LOGIN_PRIVATE_KEY ?? "private-key-not-found";
  const payload = {
    iss: FAKE_LOGIN_ENDPOINT,
    sub: "fake-login-sub",
    aud: "vita-app-sandpit",
    iat: 1757518101,
    vtm: `${FAKE_LOGIN_ENDPOINT}/trustmark/localhost:3000`,
    auth_time: 1757518097,
    vot: "P9.Cp.Cd",
    exp: 4913196422,
    jti: "fake-login-jti",
    nhs_number: nhsNumber,
    identity_proofing_level: "P9",
    id_status: "verified",
    token_use: "id",
    surname: "MILLAR",
    family_name: "MILLAR",
    birthdate: "1968-12-02",
  };
  return jwt.sign(payload, FAKE_LOGIN_PRIVATE_KEY, { algorithm: "RS512" });
};

export const POST = async () => {
  log.info("token endpoint called");

  const idToken: string = getIDTokenForNHSNumber(getRandomNHSNumber());
  return Response.json({
    access_token: "fake-login-access-token",
    refresh_token: "fake-login-refresh-token",
    token_type: "Bearer",
    expires_in: 3600,
    id_token: idToken,
  });
};
