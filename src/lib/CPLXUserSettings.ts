import { produce } from "immer";

import { ChromeStore } from "@/types/ChromeStore";
import ChromeStorage from "@/utils/ChromeStorage";

export default class CPLXUserSettings {
  private static userSettings: ChromeStore;

  static async init() {
    CPLXUserSettings.userSettings = await CPLXUserSettings.fetch();
  }

  static async fetch() {
    CPLXUserSettings.userSettings = await ChromeStorage.getStore();
    return CPLXUserSettings.userSettings;
  }

  static get() {
    return CPLXUserSettings.userSettings;
  }

  static async set(updater: (draft: ChromeStore) => void) {
    const userSettings = await CPLXUserSettings.fetch();

    const newSettings = produce(userSettings, (draft) => {
      updater(draft as ChromeStore);
    });

    await ChromeStorage.setStore(newSettings);

    CPLXUserSettings.userSettings = newSettings;

    return newSettings;
  }
}
