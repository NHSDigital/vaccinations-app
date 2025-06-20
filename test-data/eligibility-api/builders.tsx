import {
  EligibilityApiResponse,
  EligibilityCohort,
  ProcessedSuggestion
} from "@src/services/eligibility-api/api-types";

export function eligibilityApiResponseBuilder() {
  return createBuilder<EligibilityApiResponse>({
    processedSuggestions: [processedSuggestionBuilder().build(), processedSuggestionBuilder().build()],
  });
}

export function processedSuggestionBuilder() {
  return createBuilder<ProcessedSuggestion>({
    condition: randomValue(["COVID", "FLU", "MMR", "RSV"]),
    status: randomValue(["NotEligible", "NotActionable", "Actionable"]),
    statusText: randomString(10),
    eligibilityCohorts: [eligibilityCohortBuilder().build(), eligibilityCohortBuilder().build()],
  });
}

export function eligibilityCohortBuilder() {
  return createBuilder<EligibilityCohort>({
    cohortCode: randomString(10),
    cohortText: randomString(10),
    cohortStatus: randomValue(["NotEligible", "NotActionable", "Actionable"]),
  });
}

type BuilderMethods<T, TBuilder> = {
  [K in keyof T as `with${Capitalize<string & K>}`]: (
    value: T[K]
  ) => TBuilder;
} & {
  [K in keyof T as `and${Capitalize<string & K>}`]: (
    value: T[K]
  ) => TBuilder;
};

class BaseBuilder<T> {
  protected instance: Partial<T> = {};

  build(): T {
    for (const key in this.instance) {
      if (this.instance[key] === undefined) {
        console.warn(`Property '${key}' is undefined on the object being built.`);
      }
    }
    return this.instance as T;
  }
}

function createBuilder<T>(defaults: T): BaseBuilder<T> & BuilderMethods<T, BaseBuilder<T> & BuilderMethods<T, any>> {
  const builder = new BaseBuilder<T>();

  // Set initial default values
  builder['instance'] = { ...defaults };

  for (const key in defaults) {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);

    const withMethodName = `with${capitalizedKey}`;
    (builder as any)[withMethodName] = (value: T[typeof key]) => {
      (builder['instance'] as any)[key] = value;
      return builder;
    };

    const andMethodName = `and${capitalizedKey}`;
    (builder as any)[andMethodName] = (value: T[typeof key]) => {
      (builder as any)[withMethodName](value); // 'and' is just an alias for 'with'
      return builder;
    };
  }

  return builder as any;
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
