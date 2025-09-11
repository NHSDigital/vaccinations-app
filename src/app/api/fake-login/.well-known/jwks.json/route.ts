import { logger } from "@src/utils/logger";

const log = logger.child({ name: "fake-login" });

const jwks = {
  keys: [
    {
      kty: "RSA",
      kid: "bc34c75e-d150-4f0a-8be0-8397b3ad7937",
      n: "mUsRQFhw8HNjRiaCkzmUZzZDqobQD5Eg_-vDM5qtPUohz5y-KO3ppXyJv6JAIpU_pbcPv60u0AkimA74l4CiObruTUvspjpMSo5AG5Cd0I0vQm67DwJLJdhC9M0MDEpZ2ce93XU8eAuWXYCVO0hwi-SchQ8xC0eR4hrhxq1hKNGe1-jU8hvvuc-thRkIHlOoZUVLL2DQCJssUHemBWOcdsrIqqnFQgkGg2p4bvvBaX8zBCSgHJAlHCUECaLo-HM2Joq_rzeRJmcYFcoet-_cLvNZoIap4H_UUQQ6uHktc3rwlGBXth7Iaiw-F0BB-PEML_dzQvqiQrStQZNV5tsu3w",
      e: "AQAB",
      alg: "RS512",
    },
  ],
};

export const GET = async () => {
  log.info("jwks endpoint called");
  return Response.json(jwks);
};
