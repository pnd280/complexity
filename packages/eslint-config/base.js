// @ts-check
import eslintConfigPrettier from "eslint-config-prettier";

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import unicornPlugin from "eslint-plugin-unicorn";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            pascalCase: true,
            kebabCase: true,
            camelCase: true,
          },
          ignore: ["\\.d\\.ts$"],
        },
      ],
    },
  },
]);
