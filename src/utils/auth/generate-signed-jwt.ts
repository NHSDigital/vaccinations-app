import { AppConfig } from "@src/utils/config";
import pemToCryptoKey from "@src/utils/auth/pem-to-crypto-key";

const generateSignedJwt = async (
  config: AppConfig,
  payload: object,
): Promise<string> => {
  const privateKey = await pemToCryptoKey(config.NHS_LOGIN_PRIVATE_KEY);

  const header = { alg: "RS512", typ: "JWT" };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url",
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" },
    privateKey,
    new TextEncoder().encode(signatureInput),
  );

  const encodedSignature = Buffer.from(signature).toString("base64url");
  return `${signatureInput}.${encodedSignature}`;
};

export { generateSignedJwt };
