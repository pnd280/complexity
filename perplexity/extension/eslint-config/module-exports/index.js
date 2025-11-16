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
    ["src/plugins/__core__/**/index.manifest.core.ts"],
    [
      {
        type: "default",
        tsType: {
          name: "CorePluginManifest",
          path: "@/__registries__/core-plugins/types",
        },
      },
    ],
  ),
  createTypedExportsRule(
    ["src/plugins/*/index.manifest.ts"],
    [
      {
        type: "default",
        tsType: {
          name: "PluginManifest",
          path: "@/__registries__/plugins/types",
        },
      },
    ],
  ),
  createTypedExportsRule(
    ["src/{services,plugins,entrypoints}/**/*.bg-worker.ts"],
    [
      {
        type: "default",
        tsType: {
          name: "DefaultExportFunction",
          path: "@/__registries__/types",
        },
        message: "Must export default a valid function.",
      },
    ],
  ),
  createTypedExportsRule(
    ["src/plugins/**/*.hash-router.ts"],
    [
      {
        type: "default",
        tsType: {
          name: "ReactRouterRouteObject",
          path: "@/__registries__/types",
        },
        message:
          "Must export default a valid React Router route object `RouteObject`.",
      },
    ],
  ),
  createTypedExportsRule(
    ["src/plugins/**/loader.*", "src/plugins/**/*.loader.*"],
    [
      {
        type: "default",
        tsType: {
          name: "DefaultExportFunction",
          path: "@/__registries__/types",
        },
        message: "Must export default a valid function.",
      },
    ],
  ),
  createTypedExportsRule(
    ["src/plugins/*/settings-ui.tsx", "src/plugins/*/settings-ui/index.tsx"],
    [
      {
        type: "default",
        tsType: {
          name: "ReactComponent",
          path: "@/__registries__/types",
        },
        message: "Must export default a valid React component.",
      },
      {
        type: "named",
        exportName: "pluginId",
        tsType: {
          name: "PluginId",
          path: "@/__registries__/plugins/meta.types",
        },
        message: "Must export a string which matches a valid `pluginId`.",
      },
    ],
  ),
]);
