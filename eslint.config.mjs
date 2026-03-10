import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";
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
  js.configs.recommended,

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
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // ----------------------------
  // 3) APPLICATION CODE (TS/JS/React)
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
      // react,
      // 'react-hooks': reactHooks,
    },

    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // If you enable React plugins above, you can also enable these:
      // 'react/react-in-jsx-scope': 'off',
      // 'react-hooks/rules-of-hooks': 'error',
      // 'react-hooks/exhaustive-deps': 'warn',
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
  ...compat.config({
    extends: [
      // 'next/core-web-vitals', // couldn't use it because of circular error
      // 'next/typescript',
      "prettier",
      // "next"
    ],
  }),
];

export default eslintConfig;
