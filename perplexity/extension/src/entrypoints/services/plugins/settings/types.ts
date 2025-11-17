import type { WxtStorageItem } from "@wxt-dev/storage";
import type { Draft } from "mutative";

import type {
  PluginId,
  PluginManifestExports,
  PluginsRegistry,
} from "@/entrypoints/services/plugins/types";
import type { NullablePartial } from "@/types/utils.types";

export type PluginSettingsMetadata<TMetadata = Record<string, unknown>> =
  NullablePartial<
    TMetadata & {
      v: number;
    }
  >;

export type IPluginSettingsService<
  TValue = unknown,
  TMetadata = Record<string, unknown>,
> = {
  id: PluginId;
  storageItem: WxtStorageItem<TValue, PluginSettingsMetadata<TMetadata>>;
  getValue(): Promise<TValue>;
  getMeta(): Promise<PluginSettingsMetadata<TMetadata>>;
  setValue(value: TValue): Promise<void>;
  setMeta(meta: PluginSettingsMetadata<TMetadata>): Promise<void>;
  updateValue(
    updateFn: (value: Draft<TValue>) => TValue | void,
  ): Promise<TValue>;
};

export type InferSettingsValue<T> =
  T extends Record<
    keyof Pick<PluginManifestExports, "settingsStorage">,
    IPluginSettingsService<infer V, Record<string, unknown>>
  >
    ? V
    : never;

export type PluginsSettings = {
  [K in PluginId as InferSettingsValue<PluginsRegistry[K]> extends never
    ? never
    : K]: InferSettingsValue<PluginsRegistry[K]>;
};
