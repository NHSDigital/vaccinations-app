export class ApimAuthError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "ApimAuthError";
  }
}

export class ApimMissingTokenError extends ApimAuthError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "ApimMissingTokenError";
  }
}

export class ApimHttpError extends ApimAuthError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "ApimHttpError";
  }
}
