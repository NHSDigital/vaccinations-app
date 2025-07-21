import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { VaccineTypes } from "@src/models/vaccine";
import { vaccineTypeToPath } from "@src/services/content-api/constants";
import { AppConfig, configProvider } from "@src/utils/config";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { S3_PREFIX, isS3Path } from "@src/utils/path";
import { writeFile } from "node:fs/promises";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "content-writer-service" });

const _writeFileS3 = async (bucket: string, key: string, data: string): Promise<void> => {
  try {
    const s3Client: S3Client = new S3Client({
      region: AWS_PRIMARY_REGION,
    });

    const putObjectCommand: PutObjectCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
    });
    await s3Client.send(putObjectCommand);
  } catch (error) {
    log.error("Error writing file to S3: %s", error);
    throw error;
  }
};

const _writeContentToCache = async (cacheLocation: string, cachePath: string, cacheContent: string): Promise<void> => {
  return isS3Path(cacheLocation)
    ? await _writeFileS3(cacheLocation.slice(S3_PREFIX.length), cachePath, cacheContent)
    : await writeFile(`${cacheLocation}${cachePath}`, cacheContent);
};

const writeContentForVaccine = async (vaccineType: VaccineTypes, vaccineContent: string) => {
  const config: AppConfig = await configProvider();
  const vaccineContentPath = vaccineTypeToPath[vaccineType];
  await _writeContentToCache(config.CONTENT_CACHE_PATH, `${vaccineContentPath}.json`, vaccineContent);
  log.info(`Finished writing content to cache for vaccine: ${vaccineType}`);
};

export { _writeFileS3, _writeContentToCache, writeContentForVaccine };
