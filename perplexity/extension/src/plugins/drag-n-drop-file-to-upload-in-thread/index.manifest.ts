import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/drag-n-drop-file-to-upload-in-thread/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:dragAndDropFileToUploadInThread",
  name: "Drag and Drop File(s) to Upload",
  description:
    "Treat the whole thread page as a drop zone and allow you to directly drag & drop file(s) to upload them as attachment(s)",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "desktopOnly"],
  categories: ["thread"],
  uiRouteSegment: "thread-drag-and-drop-file-to-upload-in-thread",
});

const dependencies = definePluginDependencies({
  plugins: ["spaRouter"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
