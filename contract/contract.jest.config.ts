import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "../",
});

const config: Config = {
  rootDir: "..",
  verbose: true,
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["**/*.contract.ts"],
  moduleNameMapper: {
    "^@project/(.*)$": "<rootDir>/$1",
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@test-data/(.*)$": "<rootDir>/test-data/$1",
  },
};

export default createJestConfig(config);
