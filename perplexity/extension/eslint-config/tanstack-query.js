// @ts-check
import pluginQuery from "@tanstack/eslint-plugin-query";
import { defineConfig } from "eslint/config";

export default defineConfig({
  plugins: {
    // @ts-expect-error - not compatible with defineConfig
    "@tanstack/query": pluginQuery,
  },
  rules: {
    "@tanstack/query/exhaustive-deps": "error",
    "@tanstack/query/infinite-query-property-order": "warn",
    "@tanstack/query/no-void-query-fn": "error",
    "@tanstack/query/no-rest-destructuring": "warn",
  },
});
