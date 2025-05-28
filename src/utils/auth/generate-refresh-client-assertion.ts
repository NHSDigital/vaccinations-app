import { AppConfig, configProvider } from "@src/utils/config";

const generateClientAssertion = async (
  privateKey: CryptoKey,
): Promise<string> => {
  const config: AppConfig = await configProvider();
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: config.NHS_LOGIN_CLIENT_ID,
    sub: config.NHS_LOGIN_CLIENT_ID,
    aud: `${config.NHS_LOGIN_URL}/token`,
    jti: crypto.randomUUID(),
    exp: now + 300,
    iat: now,
  };

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

export { generateClientAssertion };
