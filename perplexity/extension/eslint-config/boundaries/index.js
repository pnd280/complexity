import boundariesPlugin from "eslint-plugin-boundaries";
import { elements } from "./elements.js";
import { rules } from "./rules.js";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    plugins: {
      boundaries: boundariesPlugin,
    },

    settings: {
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": elements,
    },

    rules: {
      "boundaries/no-unknown": ["off"],
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
