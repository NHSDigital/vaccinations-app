import { logger } from "@src/utils/logger";

const log = logger.child({ name: "fake-login" });

export const FAKE_LOGIN_ENDPOINT = "https://localhost:3000/api/fake-login";
const config = {
  issuer: `${FAKE_LOGIN_ENDPOINT}`,
  authorization_endpoint: `${FAKE_LOGIN_ENDPOINT}/authorize`,
  token_endpoint: `${FAKE_LOGIN_ENDPOINT}/token`,
  jwks_uri: `${FAKE_LOGIN_ENDPOINT}/.well-known/jwks.json`,
  scopes_supported: [
    "basic_demographics",
    "client_metadata",
    "email",
    "gp_integration_credentials",
    "gp_registration_details",
    "landline",
    "nhs_app_credentials",
    "openid",
    "phone",
    "profile",
    "profile_extended",
  ],
  response_types_supported: ["code"],
  subject_types_supported: ["public"],
  id_token_signing_alg_values_supported: ["RS512"],
  claims_supported: [
    "iss",
    "aud",
    "sub",
    "family_name",
    "given_name",
    "email",
    "email_verified",
    "phone_number",
    "phone_number_verified",
    "landline_number",
    "landline_number_verified",
    "birthdate",
    "nhs_number",
    "gp_integration_credentials",
    "delegations",
    "gp_registration_details",
    "im1_token",
    "auth_time",
    "jti",
    "nonce",
    "vot",
    "vtm",
    "exp",
    "ods_code",
    "user_id",
    "linkage_key",
    "surname",
    "iat",
    "gp_ods_code",
    "gp_user_id",
    "gp_linkage_key",
    "client_user_metadata",
    "identity_proofing_level",
  ],
  userinfo_endpoint: `${FAKE_LOGIN_ENDPOINT}/userinfo`,
  token_endpoint_auth_signing_alg_values_supported: ["RS512"],
  token_endpoint_auth_methods_supported: ["private_key_jwt"],
  fido_uaf_authentication_request_endpoint: `${FAKE_LOGIN_ENDPOINT}/authRequest`,
  fido_uaf_registration_request_endpoint: `${FAKE_LOGIN_ENDPOINT}/regRequest`,
  fido_uaf_registration_response_endpoint: `${FAKE_LOGIN_ENDPOINT}/regResponse`,
  fido_uaf_deregistration_endpoint: `${FAKE_LOGIN_ENDPOINT}/dereg`,
};

export const GET = async () => {
  log.info("well-known endpoint called");
  return Response.json(config);
};
