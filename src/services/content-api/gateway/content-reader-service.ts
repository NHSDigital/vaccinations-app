"use server";

import { GetObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { VaccineTypes } from "@src/models/vaccine";
import { VaccineContentPaths, vaccineTypeToPath } from "@src/services/content-api/constants";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import {
  ContentErrorTypes,
  GetContentForVaccineResponse,
  StyledVaccineContent,
  VaccinePageContent
} from "@src/services/content-api/types";
import { AppConfig, configProvider } from "@src/utils/config";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { S3_PREFIX, isS3Path } from "@src/utils/path";
import { readFile } from "node:fs/promises";
import { Logger } from "pino";
import { Readable } from "stream";
import {
  ReadingS3Error,
  S3NoSuchKeyError,
  S3HttpStatusError,
} from "@src/services/content-api/gateway/exceptions";
import { HttpStatusCode } from "axios";

const log: Logger = logger.child({ module: "content-reader-service" });

const _readFileS3 = async (bucket: string, key: string): Promise<string> => {
  try {
    const s3Client: S3Client = new S3Client({
      region: AWS_PRIMARY_REGION
    });

    const getObjectCommand: GetObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key
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
        log.error(error, `Error in reading Content API from S3: File not found ${bucket}/${key}`);
        throw new S3NoSuchKeyError(`Error in reading Content API from S3`);
      }

      const statusCode = error.$metadata?.httpStatusCode;
      if (statusCode && statusCode >= HttpStatusCode.BadRequest) {
        log.error(error, `Error in reading Content API from S3 ${bucket}/${key}`);
        throw new S3HttpStatusError(`Error in reading Content API from S3`);
      }

      log.error(error, `Unhandled error in reading Content API from S3: ${bucket}/${key}`);
      throw error;
    }
  }
  log.error("Error fetching content: unexpected response type");
  throw new Error("Error fetching content: unexpected response type");
};

const _readContentFromCache = async (cacheLocation: string, cachePath: string): Promise<string> => {
  log.info(`Reading file from cache: loc=${cacheLocation}, path=${cachePath}`);

  return isS3Path(cacheLocation)
    ? await _readFileS3(cacheLocation.slice(S3_PREFIX.length), cachePath)
    : await readFile(`${cacheLocation}${cachePath}`, { encoding: "utf8" });
};

const getContentForVaccine = async (vaccineType: VaccineTypes): Promise<GetContentForVaccineResponse> => {
  try {
    const config: AppConfig = await configProvider();
    const vaccineContentPath: VaccineContentPaths = vaccineTypeToPath[vaccineType];

    // fetch content from api
    log.info(`Fetching content from cache for vaccine: ${vaccineType}`);
    const vaccineContent = await _readContentFromCache(config.CONTENT_CACHE_PATH, `${vaccineContentPath}.json`);
    log.info(`Finished fetching content from cache for vaccine: ${vaccineType}`);

    // filter and style content
    const filteredContent: VaccinePageContent = getFilteredContentForVaccine(vaccineContent);
    const styledVaccineContent: StyledVaccineContent = await getStyledContentForVaccine(vaccineType, filteredContent);

    return { styledVaccineContent, contentError: undefined };
  } catch (error) {
    if (error instanceof ReadingS3Error) {
      return {
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR
      };
    } else {
      log.error(error, `Error getting content for vaccine: ${vaccineType}`);
      return {
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR
      };
    }
  }
};

export { _readFileS3, _readContentFromCache, getContentForVaccine };
