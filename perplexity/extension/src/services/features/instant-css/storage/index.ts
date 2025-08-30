import { storage } from "@wxt-dev/storage";
import { produce } from "immer";

import type {
  InstantCss,
  InstantCssSettings,
} from "@/services/features/instant-css/types";

export const backgroundProxyServiceName = "instantCssStorageService";

export class InstantCssStorageService {
  static storageItem = storage.defineItem<InstantCssSettings>(
    "local:instantCss",
    {
      init: () => ({}),
      fallback: {},
    },
  );

  static async get(): Promise<InstantCssSettings> {
    return await InstantCssStorageService.storageItem.getValue();
  }

  private static async set(
    updater: (draft: InstantCssSettings) => void,
  ): Promise<void> {
    const newSettings = produce(await InstantCssStorageService.get(), updater);
    await InstantCssStorageService.storageItem.setValue(newSettings);
  }

  static async reset(): Promise<void> {
    await InstantCssStorageService.storageItem.setValue(
      InstantCssStorageService.storageItem.fallback,
    );
  }

  static async register(params: InstantCss & { id: keyof InstantCssSettings }) {
    await InstantCssStorageService.set((draft) => {
      draft[params.id] = params;
    });
  }

  static async unregister(id: keyof InstantCssSettings) {
    await InstantCssStorageService.set((draft) => {
      delete draft[id];
    });
  }

  static async isRegistered(id: keyof InstantCssSettings) {
    const settings = await InstantCssStorageService.get();
    return settings[id] !== undefined;
  }
}
