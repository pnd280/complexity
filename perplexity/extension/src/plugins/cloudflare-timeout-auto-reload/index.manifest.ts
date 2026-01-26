import {
  definePluginDashboardMeta,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/cloudflare-timeout-auto-reload/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "cloudflareTimeoutAutoReload",
  name: "Cloudflare Timeout Auto Reload",
  description: "Auto reload the page on Cloudflare timeout",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: [],
  categories: ["misc"],
  uiRouteSegment: "cloudflare-timeout-auto-reload",
});

const manifest = {
  meta,
  dashboardMeta,
  settingsStorage,
  settingsSchemas,
} satisfies PluginManifestExports;

export default manifest;
