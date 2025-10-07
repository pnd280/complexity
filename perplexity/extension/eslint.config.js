// @ts-check
import {
  baseConfig,
  baseImportConfig,
  baseReactConfig,
  baseTypescriptConfig,
} from "@complexity/eslint-config";
import globals from "globals";
import { defineConfig } from "eslint/config";
import boundariesConfig from "./eslint-config/boundaries/index.js";
import tanstackQueryConfig from "./eslint-config/tanstack-query.js";

const commonIgnores = [
  "dist/**",
  "node_modules/**",
  "**/*.config.js",
  "**/*.config.ts",
];

export default defineConfig([
  baseConfig,
  {
    ...baseTypescriptConfig[0],
    ignores: [...commonIgnores, "**/*.js"],
  },
  {
    ...baseImportConfig[0],
    extends: [
      {
        rules: {
          "import/no-unresolved": [
            "error",
            {
              ignore: ["^~icons/"],
            },
          ],
        },
      },
    ],
    ignores: [
      ...commonIgnores,
      "**/*.js",
      "src/manifest.chrome.ts",
      "src/manifest.firefox.ts",
      "src/manifest.base.ts",
      "vite-plugins/**",
    ],
  },
  {
    ...baseReactConfig[0],
    ignores: [...commonIgnores, "e2e/**"],
  },
  boundariesConfig,
  tanstackQueryConfig,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    ignores: [...commonIgnores],
  },
]);
