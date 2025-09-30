import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:dragAndDropFileToUploadInThread": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "thread:dragAndDropFileToUploadInThread",
    title: "Drag and Drop File(s) to Upload",
    description:
      "Treat the whole thread page as a drop zone and allow you to directly drag & drop file(s) to upload them as attachment(s)",
    dashboardMeta: {
      tags: ["ui", "desktopOnly"],
      categories: ["thread"],
      uiRouteSegment: "thread-drag-and-drop-file-to-upload-in-thread",
    },
    dependencies: {
      corePlugins: ["spaRouter"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
