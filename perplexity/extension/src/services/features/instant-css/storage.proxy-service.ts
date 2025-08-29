import { defineProxyService } from "@webext-core/proxy-service";
import { storage } from "@wxt-dev/storage";
import { produce } from "immer";

import type {
  InstantCss,
  InstantCssSettings,
} from "@/services/features/instant-css/types";

export class InstantCssStorage {
  static storageItem = storage.defineItem<InstantCssSettings>(
    "local:instantCss",
    {
      init: () => ({}),
      fallback: {},
    },
  );

  static async get(): Promise<InstantCssSettings> {
    return await InstantCssStorage.storageItem.getValue();
  }

  private static async set(
    updater: (draft: InstantCssSettings) => void,
  ): Promise<void> {
    const newSettings = produce(await InstantCssStorage.get(), updater);
    await InstantCssStorage.storageItem.setValue(newSettings);
  }

  static async reset(): Promise<void> {
    await InstantCssStorage.storageItem.setValue(
      InstantCssStorage.storageItem.fallback,
    );
  }

  static async register(params: InstantCss & { id: keyof InstantCssSettings }) {
    await InstantCssStorage.set((draft) => {
      draft[params.id] = params;
    });
  }

  static async unregister(id: keyof InstantCssSettings) {
    await InstantCssStorage.set((draft) => {
      delete draft[id];
    });
  }

  static async isRegistered(id: keyof InstantCssSettings) {
    const settings = await InstantCssStorage.get();
    return settings[id] !== undefined;
  }
}

export const [registerService, getInstantCssStorageService] =
  defineProxyService("InstantCssStorage", () => InstantCssStorage);
