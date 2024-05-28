import {
  ChromeSessionStore,
  ChromeSessionStoreKey,
  ChromeStore,
  ChromeStoreKey,
} from '@/types/ChromeStore';

import { getTabId } from './utils';

export const chromeStorage = {
  async getStorageValue<T extends ChromeStoreKey>(key: T) {
    const { [key]: value } = await chrome.storage.local.get(key);
    return value as ChromeStore[T];
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

async function getSessionStore(): Promise<ChromeSessionStore> {
  return await chromeStorage.getStorageValue(
    `sessionStore-${await getTabId()}`
  );
}

export async function setSessionStoreValue<K extends ChromeSessionStoreKey>({
  key,
  value,
}: {
  key: K;
  value: ChromeSessionStore[K];
}) {
  const tabId = await getTabId();
  const sessionStore = await getSessionStore();
  sessionStore[key] = value;
  await chromeStorage.setStorageValue({
    key: `sessionStore-${tabId}`,
    value: sessionStore,
  });
}
