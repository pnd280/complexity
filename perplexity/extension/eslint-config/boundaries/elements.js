export const elements = [
  {
    type: "entrypoints",
    mode: "full",
    capture: ["path", "loaderType"],
    pattern: ["src/**/{bg-worker,opt-loader}.*"],
  },

  {
    type: "entrypoints",
    mode: "full",
    capture: ["path", "prefix", "loader"],
    pattern: ["src/**/*.{bg-worker,opt-loader}.*"],
  },

  {
    type: "entrypoints",
    mode: "full",
    capture: ["context"],
    pattern: ["src/entrypoints/contexts/{background,options-page,content-scripts}/**/*"],
  },

  {
    type: "entrypoints",
    mode: "full",
    pattern: ["src/entrypoints/**/*"],
  },

  {
    type: "plugin-public-exports",
    mode: "full",
    capture: ["group", "name"],
    pattern: ["src/plugins/_*/*/**/public.*", "src/plugins/_*/*/**/*.public.*"],
  },

  {
    type: "plugin-public-exports",
    mode: "full",
    capture: ["name"],
    pattern: ["src/plugins/*/**/public.*", "src/plugins/*/**/*.public.*"],
  },

  {
    type: "plugin",
    mode: "full",
    capture: ["group", "name"],
    pattern: ["src/plugins/_*/*/**/*"],
  },

  {
    type: "plugin",
    mode: "full",
    capture: ["name"],
    pattern: ["src/plugins/*/**/*"],
  },

  {
    type: "shared",
    mode: "full",
    capture: ["type"],
    pattern: [
      "src/*/**/*",
    ],
  },

  {
    type: "shared",
    mode: "full",
    pattern: [
      "src/*.ts",
    ],
  },
];
