export class ReadingS3Error extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "ReadingS3Error";
  }
}

export class S3HttpStatusError extends ReadingS3Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "S3HttpStatusError";
  }
}

export class S3NoSuchKeyError extends ReadingS3Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "S3NoSuchKeyError";
  }
}

export class InvalidatedCacheError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "InvalidatedCacheError";
  }
}
