// @ts-check

export const rules = [
  {
    from: "shared",
    allow: ["shared", "plugin-core-public-exports", "plugin-public-exports"],
  },

  {
    from: "entrypoint",
    allow: [
      "entrypoint",
      "shared",
      "plugin-core-public-exports",
      "plugin-public-exports",
    ],
  },

  {
    from: "plugin-core",
    allow: [
      "plugin-core",
      "plugin-core-public-exports",
      "plugin",
      "plugin-public-exports",
      "shared",
    ],
    disallow: [
      [
        "plugin-core-public-exports",
        { pluginCoreName: "${from.pluginCoreName}" },
      ],
    ],
    message:
      "Core plugin '${from.pluginCoreName}' cannot import its own public exports - use direct imports instead",
  },

  {
    from: "plugin",
    allow: [
      "plugin-core",
      "plugin-core-public-exports",
      "plugin-public-exports",
      ["plugin", { pluginName: "${from.pluginName}" }],
      "shared",
    ],
    disallow: [["plugin-public-exports", { pluginName: "${from.pluginName}" }]],
    message:
      "Plugin '${from.pluginName}' cannot import its own public exports - use direct imports instead",
  },

  {
    from: "plugin-public-exports",
    allow: [["plugin", { pluginName: "${from.pluginName}" }]],
  },

  {
    from: "plugin-settings-ui",
    allow: [
      "plugin-core-public-exports",
      "plugin-public-exports",
      ["plugin", { pluginName: "${from.pluginName}" }],
      ["entrypoint", { entrypointName: "options-page" }],
      "shared",
    ],
    disallow: [["plugin-public-exports", { pluginName: "${from.pluginName}" }]],
    message:
      "Settings UI '${from.pluginName}' cannot import its own public exports - use direct imports instead",
  },
];
