import { CplxUserSettings } from "@/types/cplx-user-settings.types";

export default class ChromeStorage {
  static async getStorageValue<T extends keyof CplxUserSettings>(key: T) {
    const { [key]: value } = await chrome.storage.local.get(key);
    return value as CplxUserSettings[T];
  }
  static async setStorageValue<T extends keyof CplxUserSettings>({
    key,
    value,
  }: {
    key: T;
    value: CplxUserSettings[T];
  }) {
    await chrome.storage.local.set({ [key]: value });
  }
  static async getStore(): Promise<CplxUserSettings> {
    return (await chrome.storage.local.get()) as CplxUserSettings;
  }
  static async setStore(store: CplxUserSettings) {
    await chrome.storage.local.set(store);
  }
}
