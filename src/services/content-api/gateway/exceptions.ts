export class ReadingS3Error extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "ReadingS3Error";
  }
}

export class S3BadRequestHttpStatusError extends ReadingS3Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "S3BadRequestHttpStatusError";
  }
}

export class S3UnauthorizedHttpStatusError extends ReadingS3Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "S3UnauthorizedHttpStatusError";
  }
}

export class S3ForbiddenHttpStatusError extends ReadingS3Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "S3ForbiddenHttpStatusError";
  }
}

export class S3NotFoundHttpStatusError extends ReadingS3Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "S3NotFoundHttpStatusError";
  }
}

export class NoSuchKeyHttpStatusError extends ReadingS3Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "NoSuchKeyHttpStatusError";
  }
}

export class InternalServerHttpStatusError extends ReadingS3Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "InternalServerHttpStatusError";
  }
}
