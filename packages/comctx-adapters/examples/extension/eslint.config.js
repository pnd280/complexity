// @ts-check
import rootConfig from "../../eslint.config.js";
import tseslint from "typescript-eslint";

export default tseslint.config(...rootConfig, {
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
