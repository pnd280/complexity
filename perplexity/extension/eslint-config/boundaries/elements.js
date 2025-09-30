// @ts-check

export const elements = [
  {
    type: "entrypoint",
    mode: "full",
    pattern: [
      "src/__registries__/*/**/*",
      "src/entrypoints/*/**/*",
      "src/plugins/*/**/settings-ui.tsx",
      "src/plugins/*/**/settings-ui/index.tsx",
    ],
  },

  {
    type: "plugin-runtime-deps",
    mode: "full",
    pattern: ["src/plugins/{__async-deps__,__core__,__ui-groups__}/**/*"],
  },

  {
    type: "plugin-public-exports",
    mode: "full",
    capture: ["pluginName"],
    pattern: ["src/plugins/**/*.public.*"],
  },

  {
    type: "plugin",
    mode: "full",
    capture: ["pluginName"],
    pattern: ["src/plugins/*/**/*"],
  },

  {
    type: "shared",
    mode: "full",
    pattern: [
      "src/*.ts",
      "src/{components,assets,hooks,services,types,utils,data}/**/*",
    ],
  },
];
