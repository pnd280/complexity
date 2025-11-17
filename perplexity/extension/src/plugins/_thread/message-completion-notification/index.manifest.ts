import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/message-completion-notification/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:messageCompletionNotification",
  name: "Message Completion Notification",
  description:
    "Show system notifications when normal searches/answers (not including Research/Labs) are completed.\nRequires browser notifications to be enabled.",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: [],
  categories: ["thread", "featured"],
  uiRouteSegment: "thread-message-completion-notification",
});

const dependencies = definePluginDependencies({
  plugins: ["networkIntercept"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
