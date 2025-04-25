import { AppConfig, configProvider } from "@src/utils/config";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "pem-to-private-key" });

const pemToCryptoKey = async (): Promise<CryptoKey> => {
  const configs: AppConfig = await configProvider();
  const pem: string = configs.VACCINATION_APP_PRIVATE_KEY;

  // Remove headers and convert to binary
  const pemContents: string = pem.replace(/\s|-{5}[A-Z\s]+-{5}/g, "").trim();

  // Convert base64 to buffer
  const keyBuffer = Buffer.from(pemContents, "base64");

  let importedKey: CryptoKey | undefined;
  try {
    // Import as CryptoKey
    importedKey = await crypto.subtle.importKey(
      "pkcs8",
      keyBuffer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-512",
      },
      true,
      ["sign"],
    );
  } catch (error) {
    log.error(`Import key error: ${error}`);
  }

  if (!importedKey) {
    throw new Error("Import key error");
  } else {
    return importedKey;
  }
};

export default pemToCryptoKey;
