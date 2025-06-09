import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["**/*.pact.ts"],
  moduleNameMapper: {
    "^@project/(.*)$": "<rootDir>/$1",
  }
};

export default config;
