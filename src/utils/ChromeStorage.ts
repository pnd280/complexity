import { ChromeStore, ChromeStoreKey } from "@/types/ChromeStore";

export default class ChromeStorage {
  static async getStorageValue<T extends ChromeStoreKey>(key: T) {
    const { [key]: value } = await chrome.storage.local.get(key);
    return (value || null) as ChromeStore[T];
  }
  static async setStorageValue<T extends ChromeStoreKey>({
    key,
    value,
  }: {
    key: T;
    value: ChromeStore[T];
  }) {
    await chrome.storage.local.set({ [key]: value });
  }
  static async getStore(): Promise<ChromeStore> {
    return (await chrome.storage.local.get()) as ChromeStore;
  }
  static async setStore(store: ChromeStore) {
    await chrome.storage.local.set(store);
  }
}
