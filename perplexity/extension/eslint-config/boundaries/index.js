// @ts-check
import boundariesPlugin from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";
import { elements } from "./elements.js";
import { rules } from "./rules.js";

export default tseslint.config(
  {
    plugins: {
      boundaries: boundariesPlugin,
    },

    settings: {
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": elements,
    },

    rules: {
      "boundaries/no-unknown": ["error"],
      "boundaries/no-unknown-files": ["error"],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules,
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
