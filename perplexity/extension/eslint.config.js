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
import moduleExportsConfig from "./eslint-config/module-exports/index.js";

const commonIgnores = [
  "*.js",
  "dist/**",
  "node_modules/**",
  "**/*.config.js",
  "**/*.config.ts",
];

export default defineConfig([
  baseConfig,
  {
    extends: [baseTypescriptConfig],
    ignores: [...commonIgnores, "**/*.js", "eslint-config/**"],
  },
  {
    extends: [
      baseImportConfig,
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
    extends: [baseReactConfig],
    rules: {
      "react/jsx-no-undef": "off",
    },
    ignores: [...commonIgnores, "e2e/**"],
  },
  {
    files: ["**/*.loader.*", "**/*.opt-loader.*"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  boundariesConfig,
  moduleExportsConfig,
  tanstackQueryConfig,
  {
    rules: {
      "unicorn/filename-case": "off",
    },
    files: ["src/**/_locales/*.ts"],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        projectService: true,
      },
    },
    ignores: [...commonIgnores, "eslint-config/**"],
  },
]);
