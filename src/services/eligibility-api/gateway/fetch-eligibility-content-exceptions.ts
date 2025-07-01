export class EligibilityApiError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "EligibilityApiError";
  }
}
export class EligibilityApiHttpStatusError extends EligibilityApiError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "EligibilityApiHttpStatusError";
  }
}
export class EligibilityApiSchemaError extends EligibilityApiError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "EligibilityApiSchemaError";
  }
}
