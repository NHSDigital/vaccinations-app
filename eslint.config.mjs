import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    }
  },
  globalIgnores([
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
  ]),
]);

export default eslintConfig;
