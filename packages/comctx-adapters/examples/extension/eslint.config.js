// @ts-check
import rootConfig from "../../eslint.config.js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...rootConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
