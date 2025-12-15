import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/message-tts/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:messageTts",
  name: "Message Text-to-Speech",
  description:
    "Enable text-to-speech for messages in threads. Only works on logged in sessions (Pro status not needed).",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "cometAssistant"],
  categories: ["thread", "comet"],
  uiRouteSegment: "thread-message-tts",
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
