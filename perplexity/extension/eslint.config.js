// @ts-check
import {
  baseConfig,
  baseImportConfig,
  baseReactConfig,
  baseTypescriptConfig,
} from "@complexity/eslint-config";
import globals from "globals";
import tseslint from "typescript-eslint";

import boundariesConfig from "./eslint-config/boundaries/index.js";
import tanstackQueryConfig from "./eslint-config/tanstack-query.js";

const commonIgnores = [
  "dist/**",
  "node_modules/**",
  "**/*.config.js",
  "**/*.config.ts",
];

export default tseslint.config(
  baseConfig,
  {
    ...baseTypescriptConfig[0],
    ignores: [...commonIgnores, "**/*.js", "src/types/unimport.d.ts"],
  },
  {
    ...baseImportConfig[0],
    ignores: [
      ...commonIgnores,
      "**/*.js",
      "src/manifest.chrome.ts",
      "src/manifest.firefox.ts",
      "src/manifest.base.ts",
      "vite-plugins/**",
    ],
  },
  { ...baseReactConfig[0], ignores: [...commonIgnores, "e2e/**"] },
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
);
