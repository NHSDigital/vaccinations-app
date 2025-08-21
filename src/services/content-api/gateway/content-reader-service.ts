"use server";

import { GetObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { VaccineTypes } from "@src/models/vaccine";
import { VaccineContentPaths, vaccineTypeToPath } from "@src/services/content-api/constants";
import { ReadingS3Error, S3HttpStatusError, S3NoSuchKeyError } from "@src/services/content-api/gateway/exceptions";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import {
  ContentErrorTypes,
  GetContentForVaccineResponse,
  StyledVaccineContent,
  VaccinePageContent,
} from "@src/services/content-api/types";
import { AppConfig, configProvider } from "@src/utils/config";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { S3_PREFIX, isS3Path } from "@src/utils/path";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
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

const _readContentFromCache = async (cacheLocation: string, cachePath: string): Promise<string> => {
  log.info({ context: { cacheLocation, cachePath } }, "Reading file from cache");

  return isS3Path(cacheLocation)
    ? await _readFileS3(cacheLocation.slice(S3_PREFIX.length), cachePath)
    : await readFile(`${cacheLocation}${cachePath}`, { encoding: "utf8" });
};

const GetVaccineContentPerformanceMarker = "get-vaccine-content";

const getContentForVaccine = async (vaccineType: VaccineTypes): Promise<GetContentForVaccineResponse> => {
  try {
    profilePerformanceStart(GetVaccineContentPerformanceMarker);

    const config: AppConfig = await configProvider();
    const vaccineContentPath: VaccineContentPaths = vaccineTypeToPath[vaccineType];

    // fetch content from api
    log.info({ context: { vaccineType } }, "Fetching content from cache for vaccine");
    const vaccineContent = await _readContentFromCache(config.CONTENT_CACHE_PATH, `${vaccineContentPath}.json`);
    log.info({ context: { vaccineType } }, "Finished fetching content from cache for vaccine");

    // filter and style content
    const filteredContent: VaccinePageContent = getFilteredContentForVaccine(vaccineContent);
    const styledVaccineContent: StyledVaccineContent = await getStyledContentForVaccine(vaccineType, filteredContent);

    profilePerformanceEnd(GetVaccineContentPerformanceMarker);

    return { styledVaccineContent, contentError: undefined };
  } catch (error) {
    if (error instanceof ReadingS3Error) {
      return {
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      };
    } else {
      const errorMessage = error instanceof Error && error?.message != undefined ? error.message : "unknown error";
      const errorStackTrace = error instanceof Error ? error.stack : "";
      const errorCause = error instanceof Error ? error.cause : "";
      log.error(
        { error: { message: errorMessage, stack: errorStackTrace, cause: errorCause }, context: { vaccineType } },
        "Error getting content for vaccine",
      );
      return {
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      };
    }
  }
};

export { _readFileS3, _readContentFromCache, getContentForVaccine };
