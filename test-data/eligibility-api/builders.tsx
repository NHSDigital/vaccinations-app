import {
  Condition,
  EligibilityApiResponse,
  EligibilityCohort,
  ProcessedSuggestion,
  Status
} from "@src/services/eligibility-api/api-types";

interface Builder<T> {
  build(): T;
}

export function eligibilityApiResponseBuilder(): EligibilityApiResponseBuilder {
  return new EligibilityApiResponseBuilder();
}

export function processedSuggestionBuilder(): ProcessedSuggestionBuilder {
  return new ProcessedSuggestionBuilder();
}

export function eligibilityCohortBuilder(): EligibilityCohortBuilder {
  return new EligibilityCohortBuilder();
}

class EligibilityApiResponseBuilder implements Builder<EligibilityApiResponse> {
  private processedSuggestions!: ProcessedSuggestion[];

  constructor() {
    this.processedSuggestions = [new ProcessedSuggestionBuilder().build(), new ProcessedSuggestionBuilder().build()];
  }

  withProcessedSuggestions = (processedSuggestions: ProcessedSuggestion[]) => {
    this.processedSuggestions = processedSuggestions;
    return this;
  };

  andProcessedSuggestions = (eligibilityCohorts: ProcessedSuggestion[]) => {
    return this.withProcessedSuggestions(eligibilityCohorts);
  };

    build(): EligibilityApiResponse {
      return {processedSuggestions: this.processedSuggestions};
    }
}

class ProcessedSuggestionBuilder implements Builder<ProcessedSuggestion> {
  private condition!: Condition;
  private status!: Status;
  private statusText!: string;
  private eligibilityCohorts!: EligibilityCohort[];

  constructor() {
    this.condition = randomValue(["COVID", "FLU", "MMR", "RSV"]);
    this.status = randomValue(["NotEligible", "NotActionable", "Actionable"]);
    this.statusText = randomString(10);
    this.eligibilityCohorts = [new EligibilityCohortBuilder().build(), new EligibilityCohortBuilder().build()];
  }

  withCondition = (condition: Condition) => {
    this.condition = condition;
    return this;
  };

  andCondition = (condition: Condition) => {
    return this.withCondition(condition);
  };

  withStatus = (status: Status) => {
    this.status = status;
    return this;
  };

  andStatus = (status: Status) => {
    return this.withStatus(status);
  };

  withStatusText = (statusText: string) => {
    this.statusText = statusText;
    return this;
  };

  andStatusText = (statusText: string) => {
    return this.withStatusText(statusText);
  };

  withEligibilityCohorts = (eligibilityCohorts: EligibilityCohort[]) => {
    this.eligibilityCohorts = eligibilityCohorts;
    return this;
  };

  andEligibilityCohorts = (eligibilityCohorts: EligibilityCohort[]) => {
    return this.withEligibilityCohorts(eligibilityCohorts);
  };

  build(): ProcessedSuggestion {
    return {
      condition: this.condition,
      status: this.status,
      statusText: this.statusText,
      eligibilityCohorts: this.eligibilityCohorts
    };
  }
}

class EligibilityCohortBuilder implements Builder<EligibilityCohort> {
  private code!: string;
  private text!: string;
  private status!: Status;

  constructor() {
    this.code = randomString(10);
    this.text = randomString(10);
    this.status = randomValue(["NotEligible", "NotActionable", "Actionable"]);
  }

  withCode = (code: string) => {
    this.code = code;
    return this;
  };

  andCode = (code: string) => {
    return this.withCode(code);
  };

  withText = (text: string) => {
    this.text = text;
    return this;
  };

  andText = (text: string) => {
    return this.withText(text);
  };

  withStatus = (status: Status) => {
    this.status = status;
    return this;
  };

  andStatus = (status: Status) => {
    return this.withStatus(status);
  };

  build(): EligibilityCohort {
    return {
      cohortCode: this.code,
      cohortText: this.text,
      cohortStatus: this.status
    };
  }
}


function randomString(length: number) {
  let result: string = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i: number = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randomValue<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}
