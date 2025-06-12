import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["**/*.pact.ts"],
  moduleNameMapper: {
    "^@src/(.*)$": "../src/$1"
  }
};

export default config;
