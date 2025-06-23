import {
  EligibilityApiResponse,
  EligibilityCohort,
  ProcessedSuggestion
} from "@src/services/eligibility-api/api-types";
import {
  EligibilityContent,
  EligibilityErrorTypes,
  EligibilityForPerson,
  EligibilityStatus,
  StatusContent
} from "@src/services/eligibility-api/types";

export function eligibilityApiResponseBuilder() {
  return createTypeBuilder<EligibilityApiResponse>({
    processedSuggestions: [processedSuggestionBuilder().build(), processedSuggestionBuilder().build()],
  });
}

export function processedSuggestionBuilder() {
  return createTypeBuilder<ProcessedSuggestion>({
    condition: randomValue(["RSV"]),
    status: randomValue(["NotEligible", "NotActionable", "Actionable"]),
    statusText: randomString(10),
    eligibilityCohorts: [eligibilityCohortBuilder().build(), eligibilityCohortBuilder().build()],
  });
}

export function eligibilityCohortBuilder() {
  return createTypeBuilder<EligibilityCohort>({
    cohortCode: randomString(10),
    cohortText: randomString(10),
    cohortStatus: randomValue(["NotEligible", "NotActionable", "Actionable"]),
  });
}

export function eligibilityForPersonBuilder() {
  return createTypeBuilder<EligibilityForPerson>({
    eligibilityStatus: randomValue(Object.values(EligibilityStatus)),
    eligibilityContent: eligibilityContentBuilder().build(),
    eligibilityError: randomValue(Object.values(EligibilityErrorTypes))
  });
}

export function eligibilityContentBuilder() {
  return createTypeBuilder<EligibilityContent>({ status: statusContentBuilder().build() });
}

export function statusContentBuilder() {
  return createTypeBuilder<StatusContent>({
    heading: randomString(10),
    introduction: randomString(10),
    points: [randomString(10), randomString(10)]
  });
}

/**
 * A utility mapped type that programmatically generates the method signatures for a builder.
 *
 * Given an object type `T`, this creates a new type definition that includes
 * `with<PropertyName>` and `and<PropertyName>` methods for each property in `T`.
 * This is the core mechanism that provides static type-checking and enables
 * editor autocompletion for the dynamically generated builder methods.
 *
 * This type is not meant to be used directly in application code, but rather as a
 * building block for the return type of the builder factory functions.
 *
 * @template T The object type (e.g., an interface or a class) from which to derive the builder methods.
 * @template TBuilder The return type of each generated method, which is typically the builder's
 * own type to allow for fluent method chaining.
 * @see {createTypeBuilder}
 * @see {createClassBuilder}
 */
type BuilderMethods<T, TBuilder> = {
  [K in keyof T as `with${Capitalize<string & K>}`]: (
    value: T[K]
  ) => TBuilder;
} & {
  [K in keyof T as `and${Capitalize<string & K>}`]: (
    value: T[K]
  ) => TBuilder;
};

/**
 * @internal
 * A generic base class that holds the state for an object being built.
 *
 * This class is the foundation for the dynamic builder but is not intended
 * to be used directly. Use the `createTypeBuilder` factory function to get a
 * fully functional builder instance.
 *
 * @template T The type of the object being built.
 * @see {createTypeBuilder}
 */
class TypeBuilder<T> {
  public instance: Partial<T> = {};

  constructor(defaults?: Partial<T>) {
    if (defaults) {
      this.instance = { ...defaults };
    }
  }

  build(): T {
    return this.instance as T;
  }
}

/**
 * Creates a dynamic, type-safe builder for any object type or interface.
 *
 * This factory inspects the keys of the `defaults` object and generates a builder
 * instance with corresponding `with<PropertyName>` and `and<PropertyName>` methods.
 * It provides a fluent, chainable API for constructing objects while maintaining
 * full TypeScript type-safety and editor autocompletion.
 *
 * @template T The interface or type of the object to be built.
 * @param {T} defaults An object containing the default values. The keys of this object
 * are used to determine which `with...` and `and...` methods to generate on the builder.
 * @returns {TypeBuilder<T> & BuilderMethods<T, any>} A new builder instance equipped with a
 * `build()` method and dynamic setter methods for all properties in the `defaults` object.
 *
 * @example
 * // 1. Define the type or interface for the object you want to build.
 * type User {
 * id: number;
 * username: string;
 * isVerified: boolean;
 * lastLogin?: Date;
 * }
 *
 * // 2. Create a builder by calling createTypeBuilder with default values.
 * const userBuilder = createTypeBuilder<User>({
 * id: 1,
 * username: 'user',
 * isVerified: false,
 * });
 *
 * // 3. Use the fluent API to configure and build the object.
 * const verifiedUser = userBuilder
 * .withUsername('jane.doe')
 * .andIsVerified(true)
 * .build();
 *
 * // `verifiedUser` is now: { id: 1, username: 'jane.doe', isVerified: true }
 */
export function createTypeBuilder<T extends object>(defaults?: Partial<T>) {
  const builder = new TypeBuilder<T>(defaults);

  // The Proxy fulfills the contract at RUNTIME.
  const proxy = new Proxy(builder, {
    get(target, prop, receiver) {
      const propertyName = String(prop);

      if (propertyName.startsWith("with") || propertyName.startsWith("and")) {
        const key =
          propertyName.charAt(propertyName.startsWith("with") ? 4 : 3).toLowerCase() +
          propertyName.slice(propertyName.startsWith("with") ? 5 : 4);

        return (value: T[keyof T]) => {
          (target.instance as any)[key] = value;
          return receiver;
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });

  // The return signature, using BuilderMethods, is the COMPILE-TIME contract.
  return proxy as any as TypeBuilder<T> & BuilderMethods<T, any>;
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
