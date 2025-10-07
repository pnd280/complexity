import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "comet:isolatedZoom": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  zoomLevel: z.number().min(0.25).max(5).prefault(1),
});

export default definePlugin({
  meta: {
    id: "comet:isolatedZoom",
    title: "Comet: Isolated Zoom",
    description:
      "Enable interface zoom on Comet Assistant without affecting the main page. Use Ctrl/Cmd + Mouse Wheel or Ctrl/Cmd + 0 to reset zoom.",
    dashboardMeta: {
      tags: ["ui", "cometAssistantOnly"],
      categories: [],
      uiRouteSegment: "comet-isolated-zoom",
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      zoomLevel: 1,
    },
  },
});
