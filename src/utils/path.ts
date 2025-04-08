const S3_PREFIX = "s3://";

const isS3Path = (path: string): boolean => {
  return path.startsWith(S3_PREFIX);
};

export { S3_PREFIX, isS3Path };
