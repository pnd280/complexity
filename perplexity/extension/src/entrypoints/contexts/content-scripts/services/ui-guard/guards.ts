import { APP_CONFIG } from "@/app.config";
import type { PluginsEnableStates } from "@/entrypoints/services/externals/cplx-api/plugins-states/types";
import type { PluginsSettings } from "@/entrypoints/services/plugins/settings/types";
import type { PluginId } from "@/entrypoints/services/plugins/types";
import type { whereAmI } from "@/utils/misc/utils";

const PPLX_SUB_TIER_ENUM = {
  pro: 1,
  max: 2,
} as const;

export type PplxSubTier = keyof typeof PPLX_SUB_TIER_ENUM;

export type GuardConditions = {
  dependentPluginIds?: PluginId[];
  location?: ReturnType<typeof whereAmI>[];
  excludeLocation?: ReturnType<typeof whereAmI>[];
  desktopOnly?: boolean;
  mobileOnly?: boolean;
  requiresLoggedIn?: boolean;
  allowIncognito?: boolean;
  mustHaveActiveSub?: boolean;
  leastTier?: PplxSubTier;
  browser?: ("chrome" | "firefox")[];
  requiredPermissions?: chrome.runtime.ManifestPermission[];
};

export type GuardCheckParams = {
  isMobile: boolean;
  isLoggedIn: boolean;
  isOrgMember: boolean;
  hasActiveSub: boolean;
  subTier: PplxSubTier | null;
  currentLocation: ReturnType<typeof whereAmI>;
  isIncognito: boolean;
  pluginsEnableStates: PluginsEnableStates;
  grantedPermissions: chrome.runtime.ManifestPermission[];
};

export function checkRequiredPermissions(
  { requiredPermissions }: GuardConditions,
  { grantedPermissions }: Pick<GuardCheckParams, "grantedPermissions">,
): boolean {
  if (!requiredPermissions || !requiredPermissions.length) return true;
  return requiredPermissions.every((permission) =>
    grantedPermissions.includes(permission),
  );
}

export function checkDeviceType(
  { desktopOnly, mobileOnly }: GuardConditions,
  { isMobile }: Pick<GuardCheckParams, "isMobile">,
): boolean {
  if (desktopOnly && isMobile) return false;
  if (mobileOnly && !isMobile) return false;
  return true;
}

export function checkAuthStatus(
  { requiresLoggedIn }: GuardConditions,
  { isLoggedIn }: Pick<GuardCheckParams, "isLoggedIn">,
): boolean {
  if (requiresLoggedIn && !isLoggedIn) return false;
  return true;
}

export function checkPplxSubStatus(
  { mustHaveActiveSub, leastTier }: GuardConditions,
  {
    isLoggedIn,
    hasActiveSub,
    subTier,
  }: Pick<
    GuardCheckParams,
    "hasActiveSub" | "isOrgMember" | "isLoggedIn" | "subTier"
  >,
): boolean {
  if (!mustHaveActiveSub) return true;

  if (!isLoggedIn || !hasActiveSub) return false;

  if (leastTier && subTier) {
    if (PPLX_SUB_TIER_ENUM[subTier] < PPLX_SUB_TIER_ENUM[leastTier])
      return false;
  }

  return true;
}

export function checkPluginDependencies(
  { dependentPluginIds }: GuardConditions,
  { pluginsEnableStates }: Pick<GuardCheckParams, "pluginsEnableStates">,
): boolean {
  if (!dependentPluginIds || !dependentPluginIds.length) return true;

  return dependentPluginIds.every((pluginId) => pluginsEnableStates[pluginId]);
}

export function checkLocation(
  { location, excludeLocation }: GuardConditions,
  { currentLocation }: Pick<GuardCheckParams, "currentLocation">,
): boolean {
  if (!location && !excludeLocation) return true;

  invariant(
    !(
      Array.isArray(location) &&
      location.length > 0 &&
      Array.isArray(excludeLocation) &&
      excludeLocation.length > 0
    ),
    "location and excludeLocation cannot be used together",
  );

  if (currentLocation === "unknown") return false;

  if (Array.isArray(location) && location.length > 0) {
    return location.includes(currentLocation);
  }

  if (Array.isArray(excludeLocation) && excludeLocation.length > 0) {
    return !excludeLocation.includes(currentLocation);
  }

  return true;
}

export function checkIncognito(
  { allowIncognito }: GuardConditions,
  { isIncognito }: Pick<GuardCheckParams, "isIncognito">,
): boolean {
  if (allowIncognito === false && isIncognito) return false;
  return true;
}

export function checkBrowser({ browser }: GuardConditions): boolean {
  if (!browser || !browser.length) return true;
  return browser.includes(APP_CONFIG.BROWSER);
}

export type AdditionalCheckParams = {
  inputArgs: GuardConditions;
  pluginsEnableStates: PluginsEnableStates;
  settings: PluginsSettings;
};

export type AdditionalCheckFn = (props: AdditionalCheckParams) => boolean;
