// @ts-check

export const boundaryElements = [
  {
    type: "shared",
    mode: "full",
    pattern: [
      "src/*.ts",
      "src/components/**/*",
      "src/assets/**/*",
      "src/hooks/**/*",
      "src/services/**/*",
      "src/types/**/*",
      "src/utils/**/*",
      "src/data/**/*",
    ],
  },

  {
    type: "entrypoint",
    mode: "full",
    capture: ["entrypointName"],
    pattern: ["src/entrypoints/*/**/*"],
  },

  {
    type: "plugin-public-exports",
    mode: "full",
    capture: ["pluginName"],
    pattern: [
      "src/plugins/*/**/*.public.*",
      "src/plugins/(_core|_api)/**/*.public.*",
    ],
  },

  {
    type: "plugin-core",
    mode: "full",
    pattern: ["src/plugins/_api/**/*", "src/plugins/_core/**/*"],
  },

  {
    type: "plugin-settings-ui",
    mode: "full",
    capture: ["pluginName"],
    pattern: ["src/plugins/*/**/settings-ui.tsx"],
  },

  {
    type: "plugin",
    mode: "full",
    capture: ["pluginName"],
    pattern: ["src/plugins/*/**/*"],
  },
];
