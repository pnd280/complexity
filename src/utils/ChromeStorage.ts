import { CPLXUserSettings } from "@/types/CPLXUserSettings";

export default class ChromeStorage {
  static async getStorageValue<T extends keyof CPLXUserSettings>(key: T) {
    const { [key]: value } = await chrome.storage.local.get(key);
    return (value || null) as CPLXUserSettings[T];
  }
  static async setStorageValue<T extends keyof CPLXUserSettings>({
    key,
    value,
  }: {
    key: T;
    value: CPLXUserSettings[T];
  }) {
    await chrome.storage.local.set({ [key]: value });
  }
  static async getStore(): Promise<CPLXUserSettings> {
    return (await chrome.storage.local.get()) as CPLXUserSettings;
  }
  static async setStore(store: CPLXUserSettings) {
    await chrome.storage.local.set(store);
  }
}
