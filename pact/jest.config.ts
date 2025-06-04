import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  testMatch: ["**/*.pact.ts"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1"
  },
};

export default config;
