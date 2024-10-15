import { CplxUserSettings } from "@/cplx-user-settings/types/cplx-user-settings.types";

export default class ChromeStorage {
  static async getStorageValue<T extends keyof CplxUserSettings>(key: T) {
    const { [key]: value } = await browser.storage.local.get(key);
    return value as CplxUserSettings[T];
  }
  static async setStorageValue<T extends keyof CplxUserSettings>({
    key,
    value,
  }: {
    key: T;
    value: CplxUserSettings[T];
  }) {
    await browser.storage.local.set({ [key]: value });
  }
  static async getStore(): Promise<CplxUserSettings> {
    return (await browser.storage.local.get()) as CplxUserSettings;
  }
  static async setStore(store: CplxUserSettings) {
    await browser.storage.local.set(store);
  }
}
