import type {
  PluginCategory,
  PluginTag,
} from "@/entrypoints/services/plugins/dashboard-meta/types";

export const PLUGIN_CATEGORIES = {
  featured: {
    label: "Featured",
    description: "Newly added/updated plugins",
  },
  comet: {
    label: "Comet Assistant",
    description: "Supported on the Comet Assistant sidecar",
  },
  thread: {
    label: "Thread Utilities",
    description:
      "Provide extra functionalities, productivity tweaks to the AI conversation thread",
  },
  queryBox: {
    label: "Query Box Utilities",
    description: "Add functionalities/tweaks to the query box",
  },
  sidebar: {
    label: "Sidebar Utilities",
    description:
      "Add extra functionalities, productivity tweaks to the sidebar",
  },
  misc: {
    label: "Miscellaneous",
    description: "Personal preferences",
  },
} as const satisfies PluginCategory;

export const PLUGIN_TAGS = {
  experimental: {
    label: "Experimental",
    description:
      "Experimental plugins. Subject to change or removal without prior notice",
  },
  beta: {
    label: "Beta",
    description: "Official plugins but still in testing/development",
  },
  new: {
    label: "New",
    description: "Recently added plugins",
  },
  updated: {
    label: "Updated",
    description: "Recently updated plugins",
  },
  chromiumOnly: {
    label: "Chromium Only",
    description: "Can only be used on Chromium-based browsers",
  },
  cometAssistant: {
    label: "Comet Assistant",
    description: "Supported on Comet Assistant",
  },
  cometAssistantOnly: {
    label: "Comet Assistant Only",
    description: "Can only be used on Comet Assistant",
  },
  ui: {
    label: "UI",
    description: "Add/Modify UI Elements on the page",
  },
  slashCommand: {
    label: "Slash Command",
    description: "Can be used by typing a slash (/) in prompt input field",
  },
  desktopOnly: {
    label: "Desktop Only",
    description: "Can only be used on desktop/screen width > 768px",
  },
  privacy: {
    label: "Privacy",
    description: "Privacy related plugins",
  },
  pplxPro: {
    label: "Perplexity Pro",
    description: "Requires an active Perplexity Pro subscription",
  },
  highPerfImpact: {
    label: "Performance",
    description: "May have a noticeable impact on performance in large threads",
  },
  deprecated: {
    label: "Deprecated",
    description:
      "Will not receive any updates and subject to removal without prior notice",
  },
} as const satisfies PluginTag;
