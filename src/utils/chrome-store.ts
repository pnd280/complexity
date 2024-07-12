import {
  ChromeStore,
  ChromeStoreKey
} from '@/types/ChromeStore';

export const chromeStorage = {
  async getStorageValue<T extends ChromeStoreKey>(key: T) {
    const { [key]: value } = await chrome.storage.local.get(key);
    return (value || null) as ChromeStore[T];
  },
  async setStorageValue<T extends ChromeStoreKey>({
    key,
    value,
  }: {
    key: T;
    value: ChromeStore[T];
  }) {
    await chrome.storage.local.set({ [key]: value });
  },
  async getStore(): Promise<ChromeStore> {
    return (await chrome.storage.local.get()) as ChromeStore;
  },
  async setStore(store: ChromeStore) {
    await chrome.storage.local.set(store);
  },
};
