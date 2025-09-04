import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "comet:isolatedZoom": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  zoomLevel: z.number().min(0.25).max(5).prefault(1),
});

export default definePlugin({
  manifest: {
    id: "comet:isolatedZoom",
    settingsUiRouteSegment: "comet-isolated-zoom",
    title: "Comet: Isolated Zoom",
    description:
      "Enable interface zoom on Comet Assistant without affecting the main page. Use Ctrl/Cmd + Mouse Wheel or Ctrl/Cmd + 0 to reset zoom.",
    categories: ["comet"],
    tags: ["ui", "cometAssistantOnly"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      zoomLevel: 1,
    },
  },
});
