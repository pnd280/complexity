import { storage } from "@wxt-dev/storage";
import { create } from "mutative";

import type {
  InstantCss,
  InstantCssSettings,
} from "@/services/features/instant-css/types";

export const backgroundProxyServiceName = "instantCssStorageService";

export class InstantCssStorageServiceImpl {
  static storageItem = storage.defineItem<InstantCssSettings>(
    "local:instantCss",
    {
      init: () => ({}),
      fallback: {},
    },
  );

  static async get(): Promise<InstantCssSettings> {
    return await InstantCssStorageServiceImpl.storageItem.getValue();
  }

  private static async set(
    updater: (draft: InstantCssSettings) => void,
  ): Promise<void> {
    const newSettings = create(
      await InstantCssStorageServiceImpl.get(),
      updater,
    );
    await InstantCssStorageServiceImpl.storageItem.setValue(newSettings);
  }

  static async reset(): Promise<void> {
    await InstantCssStorageServiceImpl.storageItem.setValue(
      InstantCssStorageServiceImpl.storageItem.fallback,
    );
  }

  static async register(params: InstantCss & { id: keyof InstantCssSettings }) {
    await InstantCssStorageServiceImpl.set((draft) => {
      draft[params.id] = params;
    });
  }

  static async unregister(id: keyof InstantCssSettings) {
    await InstantCssStorageServiceImpl.set((draft) => {
      delete draft[id];
    });
  }

  static async isRegistered(id: keyof InstantCssSettings) {
    const settings = await InstantCssStorageServiceImpl.get();
    return settings[id] !== undefined;
  }
}

export type InstantCssStorageService = typeof InstantCssStorageServiceImpl;
