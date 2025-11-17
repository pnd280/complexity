import { storage } from "@wxt-dev/storage";

export type ProductionDevMode = {
  enabled: boolean;
  options: {
    overrideSubscriptionTier: "pro" | "max" | null;
  };
};

export const settingsStorage = storage.defineItem<ProductionDevMode>(
  `local:misc:productionDevMode`,
  {
    fallback: {
      enabled: false,
      options: {
        overrideSubscriptionTier: null,
      },
    },
  },
);
