// @ts-check
import rootConfig from "../../eslint.config.js";
import { defineConfig } from "eslint/config";

export default defineConfig({
  ...rootConfig,
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
