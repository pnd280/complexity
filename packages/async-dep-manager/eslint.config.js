// @ts-check
import {
  baseConfig,
  baseImportConfig,
  baseTypescriptConfig,
} from "@complexity/eslint-config";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  baseConfig,
  baseTypescriptConfig,
  {
    extends: [baseImportConfig],
    ignores: [
      "dist/**",
      "node_modules/**",
      "*.config.js",
      "*.config.ts",
      "gulpfile.js",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    ignores: ["dist/**", "node_modules/**"],
  },
]);
