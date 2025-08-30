import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { PplxSubTier } from "@/plugins/_core/plugins-guard/guards";
import type { whereAmI } from "@/utils/utils";

export type PluginGuardsStoreType = {
  grantedPermissions: chrome.runtime.ManifestPermissions[];
  currentLocation: ReturnType<typeof whereAmI>;
  isMobile: boolean;
  isLoggedIn: boolean;
  isOrgMember: boolean;
  hasActiveSub: boolean;
  subTier: PplxSubTier | null;
};

export const pluginGuardsStore = createWithEqualityFn<PluginGuardsStoreType>()(
  subscribeWithSelector(
    immer(
      (): PluginGuardsStoreType => ({
        grantedPermissions: [],
        currentLocation: "unknown",
        isMobile: false,
        isLoggedIn: false,
        isOrgMember: false,
        hasActiveSub: false,
        subTier: null,
      }),
    ),
  ),
);

export const usePluginGuardsStore = pluginGuardsStore;
