import { FlatCompat } from "@eslint/eslintrc";
import compat_plugin from "eslint-plugin-compat";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

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
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier", "next"),
  compat_plugin.configs["flat/recommended"],
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",

      // nhsuk-frontend: https://github.com/nhsuk/nhsuk-frontend/blob/main/docs/contributing/browser-support.md
      // Ref: https://github.com/nhsuk/nhsuk-frontend/blob/main/packages/nhsuk-frontend/.browserslistrc
      // supported browsers are listed in package.json
      "compat/compat": "warn",
    },
  },

  // Override for test files: turn off compat
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}", "test-data/**"],
    rules: {
      "compat/compat": "off",
    },
  },
];

export default eslintConfig;
