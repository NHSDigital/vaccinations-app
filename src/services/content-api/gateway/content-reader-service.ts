"use server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import { AppConfig, configProvider } from "@src/utils/config";
import { VaccineTypes } from "@src/models/vaccine";
import { VaccineContentPaths, vaccineTypeToPath } from "@src/services/content-api/constants";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { isS3Path, S3_PREFIX } from "@src/utils/path";
import { readFile } from "node:fs/promises";
import { Readable } from "stream";
import { Logger } from "pino";
import {
  ContentErrorTypes,
  GetContentForVaccineResponse,
  StyledVaccineContent,
  VaccinePageContent,
} from "@src/services/content-api/types";
import {
  InternalServerHttpStatusError,
  NoSuchKeyHttpStatusError,
  ReadingS3Error,
  S3BadRequestHttpStatusError,
  S3ForbiddenHttpStatusError,
  S3NotFoundHttpStatusError,
  S3UnauthorizedHttpStatusError,
} from "@src/services/content-api/gateway/exceptions";

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
    if (error instanceof Error) {
      const code = (error as any).name || (error as any).Code;
      const status = (error as any).$metadata?.httpStatusCode;
      if (error.name === "NoSuchKey") {
        log.error(`File not found in S3: ${bucket}/${key}`);
        throw new NoSuchKeyHttpStatusError(`Error ${error} in reading Content API from S3`);
      }
      switch (status) {
        case "400":
          log.error("Bad Request: Check S3 bucket and key format.");
          throw new S3BadRequestHttpStatusError(`Error ${error} in reading Content API from S3`);
        case "401":
          log.error("Unauthorized: Check AWS credentials.");
          throw new S3UnauthorizedHttpStatusError(`Error ${error} in reading Content API from S3`);
        case "403":
          log.error("Forbidden: Check AWS IAM policy.");
          throw new S3ForbiddenHttpStatusError(`Error ${error} in reading Content API from S3`);
        case "404":
          log.error(`File not found in S3: ${bucket}/${key}`);
          throw new S3NotFoundHttpStatusError(`Error ${error} in reading Content API from S3`);
        case "500":
          log.error("Internal Server Error from AWS.");
          throw new InternalServerHttpStatusError(`Error ${error} in reading Content API from S3`);
        default:
          log.error(`Unhandled S3 error: ${code ?? "unknown"}`, error);
          throw error;
      }
    }
  }
  log.error("Unhandled S3 error");
  throw new Error("Unexpected response type");
};

const _readContentFromCache = async (cacheLocation: string, cachePath: string): Promise<string> => {
  log.info(`Reading file from cache: loc=${cacheLocation}, path=${cachePath}`);
  try {
    return isS3Path(cacheLocation)
      ? await _readFileS3(cacheLocation.slice(S3_PREFIX.length), cachePath)
      : await readFile(`${cacheLocation}${cachePath}`, { encoding: "utf8" });
  } catch (error) {
    if (error instanceof ReadingS3Error) {
      log.error(`Error reading file from cache: loc=${cacheLocation}: ${error}`);
      throw new ReadingS3Error(`Error ${error} in reading Content API from S3`);
    } else {
      log.error(error, "Some random error while reading from S3");
      throw error;
    }
  }
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

    return { styledVaccineContent };
  } catch (error) {
    if (error instanceof ReadingS3Error) {
      log.error(`Error getting content for vaccine: ${error}`);
      return {
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      };
    } else {
      log.error(error, `Some random error, while getting content for vaccine: ${error}`);
      return {
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      };
    }
  }
};

export { _readFileS3, _readContentFromCache, getContentForVaccine };
