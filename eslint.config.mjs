import tsPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import compat_plugin from "eslint-plugin-compat";
import globals from "globals";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/**",
      "dist/**",
      "docs/**",
      "coverage/**",
      "**/.terraform/**",
      ".open-next/**",
      "playwright-report/**",
      "pact/**",
      "performance/report",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettierConfig,
  // ----------------------------
  // APPLICATION CODE (TS/JS/React)
  // ----------------------------
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      compat: compat_plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "compat/compat": "warn",
    },
  },

  // Node-only files
  {
    files: ["*.config.mjs", "*.config.ts", "*.setup.ts", "esbuild.config.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  // ----------------------------
  // TEST FILES
  // ----------------------------
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}", "test-data/**"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      compat: compat_plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "compat/compat": "off",
    },
  },
  // Override for server-only files: browser compat is irrelevant for code that runs in Node.js
  {
    files: [
      "src/_lambda/**",
      "src/app/api/**",
      "src/services/**",
      "src/utils/auth/apim/**",
      "src/utils/auth/callbacks/**",
      "src/utils/auth/generate-auth-payload.ts",
      "src/utils/auth/get-jwt-token.ts",
      "src/utils/auth/pem-to-crypto-key.ts",
    ],
    rules: {
      "compat/compat": "off",
    },
  },
];

export default eslintConfig;
