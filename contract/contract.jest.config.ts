import type { Config } from "jest";

const config: Config = {
  rootDir: "..",
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["**/*.contract.ts"],
  moduleNameMapper: {
    "^@project/(.*)$": "<rootDir>/$1",
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@test-data/(.*)$": "<rootDir>/test-data/$1",
  },
};

export default config;
