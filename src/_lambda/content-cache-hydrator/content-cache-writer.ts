import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { isS3Path, S3_PREFIX } from "@src/utils/path";
import { writeFile } from "node:fs/promises";

const writeFileS3 = async (
  bucket: string,
  key: string,
  data: string,
): Promise<void> => {
  try {
    const s3Client = new S3Client({
      region: AWS_PRIMARY_REGION,
    });

    const putObjectCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
    });
    await s3Client.send(putObjectCommand);
  } catch (error) {
    console.error("Error writing file to S3:", error);
    throw error;
  }
};

const writeContentToCache = async (
  cacheLocation: string,
  cachePath: string,
  cacheContent: string,
): Promise<void> => {
  return isS3Path(cacheLocation)
    ? await writeFileS3(
        cacheLocation.slice(S3_PREFIX.length),
        cachePath,
        cacheContent,
      )
    : await writeFile(`${cacheLocation}${cachePath}`, cacheContent);
};

export default writeContentToCache;
