import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { readFile } from "node:fs/promises";
import { Readable } from "stream";

const S3_PREFIX = "s3://";

const isS3Path = (path: string): boolean => {
  return path.startsWith(S3_PREFIX);
};

const readFileS3 = async (bucket: string, key: string): Promise<string> => {
  try {
    const s3Client = new S3Client({
      region: AWS_PRIMARY_REGION,
    });

    const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const { Body } = await s3Client.send(getObjectCommand);

    if (Body instanceof Readable) {
      return new Promise((resolve, reject) => {
        let data = "";
        Body.on("data", (chunk) => (data += chunk));
        Body.on("end", () => resolve(data));
        Body.on("error", reject);
      });
    }

    throw new Error("Unexpected response type");
  } catch (error) {
    console.error("Error reading file from S3:", error);
    throw error;
  }
};

const readContentFromCache = async (
  cacheLocation: string,
  cachePath: string,
): Promise<string> => {
  return isS3Path(cacheLocation)
    ? await readFileS3(cacheLocation.slice(S3_PREFIX.length), cachePath)
    : await readFile(`${cacheLocation}${cachePath}`, { encoding: "utf8" });
};

export { isS3Path, readContentFromCache };
