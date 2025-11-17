import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/better-message-copy-buttons/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:betterMessageCopyButtons",
  name: "Better Message Copy Buttons",
  description:
    "Copy message content without citations. More formatting options coming soon",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "cometAssistant"],
  categories: ["thread", "comet"],
  uiRouteSegment: "thread-better-message-copy-buttons",
});

const dependencies = definePluginDependencies({
  plugins: ["domObservers:thread:messageBlocks"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
