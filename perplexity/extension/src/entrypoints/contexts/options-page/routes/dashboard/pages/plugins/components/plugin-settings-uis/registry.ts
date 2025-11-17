import type { PublicPlugins } from "@/entrypoints/services/plugins/types";
import { createUiGroupRegistry } from "@/entrypoints/utils/ui-registry-factory";

export const {
  registry: pluginSettingsUiRegistry,
  Components: PluginSettingsUiComponents,
  useRegistry,
} = createUiGroupRegistry();

export function usePluginSettingsUiRegistry({
  pluginId,
}: {
  pluginId: keyof PublicPlugins;
}) {
  return useRegistry((store) => store.components.get(pluginId));
}

export function registerSettingsUi({
  pluginId,
  ui,
}: {
  pluginId: keyof PublicPlugins;
  ui: React.ReactElement;
}) {
  pluginSettingsUiRegistry.getState().add({ id: pluginId, component: ui });
}
