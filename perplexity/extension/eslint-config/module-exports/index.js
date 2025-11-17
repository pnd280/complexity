import { defineConfig } from "eslint/config";
import { typedExportsPlugin } from "@complexity/eslint-config";

const typedExportsPluginConfig = {
  plugins: {
    "typed-exports": {
      rules: {
        "typed-exports": typedExportsPlugin,
      },
    },
  },
};

const createTypedExportsRule = (files, requirements) => ({
  ...typedExportsPluginConfig,
  files,
  rules: {
    "typed-exports/typed-exports": ["error", requirements],
  },
});

export default defineConfig([
  createTypedExportsRule(
    ["src/{entrypoints,plugins}/**/index.manifest.ts"],
    [
      {
        type: "default",
        tsType: {
          name: "PluginManifestExports",
          path: "@/entrypoints/services/plugins/types/index",
        },
        message: "Must export a valid plugin manifest.",
      },
    ],
  ),
  createTypedExportsRule(
    ["src/{entrypoints,plugins}/**/_locales/index.ts"],
    [
      {
        type: "named",
        tsType: {
          name: "String",
          path: "@/types/utils.types",
        },
        message: "Must export a valid locale namespace.",
      },
    ],
  ),
  createTypedExportsRule(
    [
      "src/{entrypoints,plugins}/**/bg-worker.ts",
      "src/{entrypoints,plugins}/**/*.bg-worker.ts",
      "src/{entrypoints,plugins}/**/opt-loader.*",
      "src/{entrypoints,plugins}/**/*.opt-loader.*",
      "src/{entrypoints,plugins}/**/loader.*",
      "src/{entrypoints,plugins}/**/*.loader.*",
    ],
    [
      {
        type: "default",
        tsType: {
          name: "ContextLoaderExport",
          path: "@/types/utils.types",
        },
        message: "Must export default a valid function.",
      },
    ],
  ),
]);
