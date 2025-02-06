/** @type {import("ts-jest").JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleDirectories: ["./src"],
  transform: {
    "^.+.tsx?$": ["ts-jest",
      {
        "useESM": true
      }
    ]
  }
};
