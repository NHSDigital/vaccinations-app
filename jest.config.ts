import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  clearMocks: true,
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@project/(.*)$": "<rootDir>/$1",
    "^@public/(.*)$": "<rootDir>/public/$1",
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@test-data/(.*)$": "<rootDir>/mocks/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/e2e/", "<rootDir>/.open-next/"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
