import type { WxtStorageItem } from "@wxt-dev/storage";

import useSettingsBase from "@/entrypoints/hooks/useSettingsBase";

export default function useSettings<
  TValue,
  TMetadata extends Record<string, unknown>,
>(settingsStorage: WxtStorageItem<TValue, TMetadata>) {
  return useSettingsBase({
    storage: settingsStorage,
  });
}
