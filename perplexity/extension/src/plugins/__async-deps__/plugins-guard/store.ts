import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import type { PplxSubTier } from "@/plugins/__async-deps__/plugins-guard/guards";
import type { whereAmI } from "@/utils/misc/utils";

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
    mutative(
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
