"use server";

import { GetObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { VaccineTypes } from "@src/models/vaccine";
import { INVALIDATED_CONTENT_OVERWRITE_VALUE } from "@src/services/content-api/constants";
import {
  InvalidatedCacheError,
  S3HttpStatusError,
  S3NoSuchKeyError,
} from "@src/services/content-api/gateway/exceptions";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { S3_PREFIX, isS3Path } from "@src/utils/path";
import { HttpStatusCode } from "axios";
import { readFile } from "node:fs/promises";
import { Logger } from "pino";
import { Readable } from "stream";

const log: Logger = logger.child({ module: "content-reader-service" });

const _readFileS3 = async (bucket: string, key: string): Promise<string> => {
  try {
    const s3Client: S3Client = new S3Client({
      region: AWS_PRIMARY_REGION,
    });

    const getObjectCommand: GetObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const { Body } = await s3Client.send(getObjectCommand);

    if (Body instanceof Readable) {
      return new Promise((resolve, reject) => {
        let data = "";
        Body.on("data", (chunk) => (data += chunk));
        Body.on("end", () => resolve(data));
        Body.on("error", reject);
      });
    }
  } catch (error: unknown) {
    if (error instanceof S3ServiceException) {
      if (error.name === "NoSuchKey") {
        log.error({ error, context: { bucket, key } }, "Error in reading Content API from S3: File not found");
        throw new S3NoSuchKeyError(`Error in reading Content API from S3`);
      }

      const statusCode = error.$metadata?.httpStatusCode;
      if (statusCode && statusCode >= HttpStatusCode.BadRequest) {
        log.error({ error, context: { bucket, key } }, "Error in reading Content API from S3");
        throw new S3HttpStatusError(`Error in reading Content API from S3`);
      }

      log.error({ error, context: { bucket, key } }, "Unhandled error in reading Content API from S3:");
      throw error;
    }
  }
  log.error("Error fetching content: unexpected response type");
  throw new Error("Error fetching content: unexpected response type");
};

const readContentFromCache = async (
  cacheLocation: string,
  cachePath: string,
  vaccineType: VaccineTypes,
): Promise<string> => {
  let contentFromCache;
  isS3Path(cacheLocation)
    ? (contentFromCache = await _readFileS3(cacheLocation.slice(S3_PREFIX.length), cachePath))
    : (contentFromCache = await readFile(`${cacheLocation}${cachePath}`, { encoding: "utf8" }));

  if (contentFromCache.includes(INVALIDATED_CONTENT_OVERWRITE_VALUE)) {
    log.info(
      { context: { cacheLocation, cachePath, vaccineType } },
      `Unable to load content from cache: ${INVALIDATED_CONTENT_OVERWRITE_VALUE}`,
    );
    throw new InvalidatedCacheError(`Unable to load content from cache: ${INVALIDATED_CONTENT_OVERWRITE_VALUE}`);
  }
  log.info({ context: { cacheLocation, cachePath, vaccineType } }, "Content loaded from cache");

  return contentFromCache;
};

export { _readFileS3, readContentFromCache };
