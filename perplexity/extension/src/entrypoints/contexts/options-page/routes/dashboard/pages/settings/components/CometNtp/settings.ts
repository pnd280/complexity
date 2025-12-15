import { storage } from "@wxt-dev/storage";

export const settingsStorage = storage.defineItem<boolean>(
  `local:misc:cometNtp`,
  {
    fallback: true,
  },
);
