import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/incognito-by-default/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "incognitoByDefault",
  name: "Incognito By Default",
  description: "Automatically turns on incognito mode on new chats",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: [],
  categories: ["misc"],
  uiRouteSegment: "incognito-by-default",
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
