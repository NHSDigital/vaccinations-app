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
  [K in keyof T as `with${Capitalize<string & K>}`]: (value: T[K]) => TBuilder;
} & {
  [K in keyof T as `and${Capitalize<string & K>}`]: (value: T[K]) => TBuilder;
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

  const proxy = new Proxy(builder, {
    get(target, prop, receiver) {
      const propertyName = String(prop);
      let prefix: string | null = null;

      if (propertyName.startsWith("with")) {
        prefix = "with";
      } else if (propertyName.startsWith("and")) {
        prefix = "and";
      }

      if (prefix) {
        const keyFragment = propertyName.substring(prefix.length);

        // This is our new, robust logic to determine the final key.
        let finalKey: string;

        if (keyFragment.length > 1 && keyFragment.charAt(1) === keyFragment.charAt(1).toUpperCase()) {
          finalKey = keyFragment;
        } else {
          finalKey = keyFragment.charAt(0).toLowerCase() + keyFragment.slice(1);
        }

        return (value: T[keyof T]) => {
          (target.instance as any)[finalKey] = value;
          return receiver; // Return the proxy for chaining
        };
      }

      return Reflect.get(target, prop, receiver);
    },
  });

  return proxy as any as TypeBuilder<T> & BuilderMethods<T, any>;
}

export function randomString(length: number) {
  let result: string = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i: number = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function randomURL() {
  return new URL(`https://${randomString(10)}.example.com`);
}

export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randomValue<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}
