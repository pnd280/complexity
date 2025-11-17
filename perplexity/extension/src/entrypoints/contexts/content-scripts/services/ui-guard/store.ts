import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import type { PplxSubTier } from "@/entrypoints/contexts/content-scripts/services/ui-guard/guards";
import type { whereAmI } from "@/utils/misc/utils";

export type PluginGuardsStoreType = {
  grantedPermissions: chrome.runtime.ManifestPermission[];
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
