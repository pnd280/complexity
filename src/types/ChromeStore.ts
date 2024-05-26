import { WebAccessFocus } from '@/components/QueryBox/FocusSelector';

import { Nullable } from './Utils';

export type ChromeSessionStoreKey = keyof ChromeSessionStore;

export type ChromeStoreKey = keyof ChromeStore;

export type ChromeStore = {
  defaultFocus: Nullable<WebAccessFocus['code']>;
  defaultCollectionUUID?: Nullable<string>;
  defaultWebAccess: boolean;
} & {
  [key: `sessionStore-${number}`]: ChromeSessionStore;
};

export type ChromeSessionStore = {};
