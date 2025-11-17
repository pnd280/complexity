import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/message-metrics/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:messageMetrics",
  name: "Message Metrics",
  description:
    "Show metrics for each message in the thread (words, characters, (estimated) tokens)",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "cometAssistant"],
  categories: ["thread", "comet"],
  uiRouteSegment: "thread-message-metrics",
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
