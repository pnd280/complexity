import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    cloudflareTimeoutAutoReload: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  behavior: z.enum(["reload", "warn-only"]),
});

export default definePlugin({
  meta: {
    id: "cloudflareTimeoutAutoReload",
    title: "Cloudflare Timeout Auto Reload",
    description: "Auto reload the page on Cloudflare timeout",
    dashboardMeta: {
      tags: [],
      categories: ["misc"],
      uiRouteSegment: "cloudflare-timeout-auto-reload",
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      behavior: "reload",
    },
  },
});
