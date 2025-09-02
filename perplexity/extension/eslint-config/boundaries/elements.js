// @ts-check

export const elements = [
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
    type: "plugin-core-public-exports",
    mode: "full",
    capture: ["pluginCoreName"],
    pattern: ["src/plugins/_core/*/**/*.public.*"],
  },

  {
    type: "plugin-core",
    mode: "full",
    capture: ["pluginCoreName"],
    pattern: ["src/plugins/_core/*/**/*"],
  },

  {
    type: "plugin-public-exports",
    mode: "full",
    capture: ["pluginName"],
    pattern: ["src/plugins/!(_core)/**/*.public.*"],
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
    pattern: ["src/plugins/!(_core)/**/*"],
  },
];
