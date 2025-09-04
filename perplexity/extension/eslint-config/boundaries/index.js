// @ts-check
import boundariesPlugin from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";
import { boundaryElements } from "./boundaryElements.js";
import { accessRules } from "./accessRules.js";

export default tseslint.config(
  {
    plugins: {
      boundaries: boundariesPlugin,
    },

    settings: {
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": boundaryElements,
    },

    rules: {
      "boundaries/no-unknown": ["error"],
      "boundaries/no-unknown-files": ["error"],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: accessRules,
        },
      ],
    },
  },

  {
    files: ["**/_locales/**/*"],
    rules: {
      "boundaries/no-unknown-files": ["off"],
    },
  },
);
