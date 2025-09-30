// @ts-check

export const rules = [
  {
    from: "entrypoint",
    allow: ["*"],
  },

  {
    from: "plugin",
    allow: [
      ["plugin", { pluginName: "${from.pluginName}" }],
      "plugin-public-exports",
      "plugin-runtime-deps",
      "shared",
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
    allow: ["plugin-runtime-deps", "shared"],
  },

  {
    from: "shared",
    allow: ["shared"],
  },
];
