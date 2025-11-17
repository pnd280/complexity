export const rules = [
  {
    from: "entrypoints",
    allow: ["*"],
  },

  {
    from: "plugin",
    allow: [
      ["plugin", { name: "${from.name}" }],
      ["plugin", { group: "${from.group}", name: "${from.name}" }],
      "entrypoints",
      "plugin-public-exports",
      "shared",
    ],
  },

  {
    from: "plugin",
    disallow: [
      ["plugin-public-exports", { name: "${from.name}" }],
      [
        "plugin-public-exports",
        { group: "${from.group}", name: "${from.name}" },
      ],
    ],
    message: 'Plugin "${from.name}" cannot import its own public exports',
  },

  {
    from: "plugin",
    disallow: [
      ["entrypoints", { context: "background" }],
      ["entrypoints", { context: "options-page" }],
    ],
  },

  {
    from: "plugin-public-exports",
    allow: [
      ["plugin", { name: "${from.name}" }],
      ["plugin", { group: "${from.group}", name: "${from.name}" }],
    ],
  },

  {
    from: "shared",
    allow: ["shared"],
  },

  {
    from: "shared",
    disallow: [
      ["entrypoints", { loader: "bg-worker" }],
      ["entrypoints", { loader: "opt-loader" }],
    ],
  },
];
