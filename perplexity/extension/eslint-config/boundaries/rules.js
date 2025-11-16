export const rules = [
  {
    from: "module-registries",
    allow: ["*"],
  },

  {
    from: "extension-entrypoints",
    allow: ["*"],
  },

  {
    from: "plugin",
    allow: [
      ["plugin", { pluginName: "${from.pluginName}" }],
      "plugin-public-exports",
      "plugin-runtime-deps",
      "shared",
      "module-registries",
    ],
    disallow: [["plugin-public-exports", { pluginName: "${from.pluginName}" }]],
    message:
      'Plugin "${from.pluginName}" cannot import its own public exports - use direct imports instead',
  },

  {
    from: "plugin-public-exports",
    allow: [["plugin", { pluginName: "${from.pluginName}" }]],
  },

  {
    from: "plugin-runtime-deps",
    allow: ["plugin-runtime-deps", "shared", "module-registries"],
  },

  {
    from: "shared",
    allow: ["shared", "module-registries"],
  },
];
