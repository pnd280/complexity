export interface CorePluginsRegistry {}

export type CorePluginId = keyof CorePluginsRegistry;

export type CorePluginManifest<T extends CorePluginId> = {
  id: T;
  dependencies?: readonly CorePluginId[];
};

export type CorePluginMetaMap = {
  [K in CorePluginId]: CorePluginManifest<K>;
};

export type CorePluginsEnableStates = Record<CorePluginId, boolean>;
