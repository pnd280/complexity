// @ts-check

export const accessRules = [
  {
    from: "shared",
    allow: ["shared", "plugin-public-exports"],
  },

  {
    from: "entrypoint",
    allow: ["entrypoint", "shared", "plugin-public-exports"],
  },

  {
    from: "plugin-core",
    allow: ["plugin-core", "shared", "plugin", "plugin-public-exports"],
    disallow: ["plugin-public-exports"],
  },

  {
    from: "plugin",
    allow: [
      "plugin-core",
      "plugin-public-exports",
      ["plugin", { pluginName: "${from.pluginName}" }],
      "shared",
    ],
    disallow: [["plugin-public-exports", { pluginName: "${from.pluginName}" }]],
  },

  {
    from: "plugin-public-exports",
    allow: [["plugin", { pluginName: "${from.pluginName}" }]],
  },

  {
    from: "plugin-settings-ui",
    allow: [
      "plugin-core",
      "plugin-public-exports",
      ["plugin", { pluginName: "${from.pluginName}" }],
      ["entrypoint", { entrypointName: "options-page" }],
      "shared",
    ],
    disallow: [["plugin-public-exports", { pluginName: "${from.pluginName}" }]],
  },
];
