import fs from "node:fs";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "pem-to-private-key" });

const pemToPrivateKey = async (): Promise<CryptoKey> => {
  const nhsLoginPrivateKeyFilePath =
    process.env.NHS_LOGIN_PRIVATE_KEY_FILE_PATH;

  if (!nhsLoginPrivateKeyFilePath) {
    const envVarNotSetMessage =
      "Unable to load key from file: NHS_LOGIN_PRIVATE_KEY_FILE_PATH env variable not set";
    log.error(envVarNotSetMessage);
    throw new Error(envVarNotSetMessage);
  }

  const pem = fs.readFileSync(nhsLoginPrivateKeyFilePath).toString("utf-8");

  // Remove headers and convert to binary
  const pemContents = pem.replace(/\s|-{5}[A-Z\s]+-{5}/g, "").trim();

  // Convert base64 to buffer
  const keyBuffer = Buffer.from(pemContents, "base64");

  // Import as CryptoKey
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBuffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-512",
    },
    true,
    ["sign"],
  );

  if (!privateKey) {
    const unableToLoadKeyMessage = "Unable to load key";
    log.error(unableToLoadKeyMessage);
    throw new Error(unableToLoadKeyMessage);
  }
  return privateKey;
};

export { pemToPrivateKey };
