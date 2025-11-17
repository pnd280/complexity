import { describe, it, expect, vi } from "vitest";

import {
  checkDeviceType,
  checkAuthStatus,
  checkPplxSubStatus,
  checkPluginDependencies,
  checkRequiredPermissions,
  checkLocation,
  checkIncognito,
  checkBrowser,
  type GuardConditions,
  type GuardCheckParams,
} from "@/entrypoints/contexts/content-scripts/services/ui-guard/guards";
import type { PluginsEnableStates } from "@/entrypoints/services/externals/cplx-api/plugins-states/types";

// Mock APP_CONFIG
vi.mock("@/app.config", () => ({
  APP_CONFIG: {
    BROWSER: "chrome",
  },
}));

describe("Guard Functions", () => {
  describe("checkRequiredPermissions", () => {
    it("should return true when no permissions required", () => {
      const conditions: GuardConditions = {};
      const params: Pick<GuardCheckParams, "grantedPermissions"> = {
        grantedPermissions: [],
      };
      expect(checkRequiredPermissions(conditions, params)).toBe(true);
    });

    it("should return true when requiredPermissions is empty array", () => {
      const conditions: GuardConditions = { requiredPermissions: [] };
      const params: Pick<GuardCheckParams, "grantedPermissions"> = {
        grantedPermissions: [],
      };
      expect(checkRequiredPermissions(conditions, params)).toBe(true);
    });

    it("should return true when all required permissions are granted", () => {
      const conditions: GuardConditions = {
        requiredPermissions: ["storage", "tabs"],
      };
      const params: Pick<GuardCheckParams, "grantedPermissions"> = {
        grantedPermissions: ["storage", "tabs", "cookies"],
      };
      expect(checkRequiredPermissions(conditions, params)).toBe(true);
    });

    it("should return false when one required permission is missing", () => {
      const conditions: GuardConditions = {
        requiredPermissions: ["storage", "tabs"],
      };
      const params: Pick<GuardCheckParams, "grantedPermissions"> = {
        grantedPermissions: ["storage"],
      };
      expect(checkRequiredPermissions(conditions, params)).toBe(false);
    });

    it("should return false when all required permissions are missing", () => {
      const conditions: GuardConditions = {
        requiredPermissions: ["storage", "tabs"],
      };
      const params: Pick<GuardCheckParams, "grantedPermissions"> = {
        grantedPermissions: [],
      };
      expect(checkRequiredPermissions(conditions, params)).toBe(false);
    });

    it("should return true when single required permission is granted", () => {
      const conditions: GuardConditions = {
        requiredPermissions: ["storage"],
      };
      const params: Pick<GuardCheckParams, "grantedPermissions"> = {
        grantedPermissions: ["storage", "tabs"],
      };
      expect(checkRequiredPermissions(conditions, params)).toBe(true);
    });

    it("should return false when single required permission is not granted", () => {
      const conditions: GuardConditions = {
        requiredPermissions: ["storage"],
      };
      const params: Pick<GuardCheckParams, "grantedPermissions"> = {
        grantedPermissions: ["tabs"],
      };
      expect(checkRequiredPermissions(conditions, params)).toBe(false);
    });
  });

  describe("checkDeviceType", () => {
    it("should return true when no device restrictions", () => {
      const conditions: GuardConditions = {};
      const params: Pick<GuardCheckParams, "isMobile"> = { isMobile: false };
      expect(checkDeviceType(conditions, params)).toBe(true);
    });

    it("should return false when desktop only and on mobile", () => {
      const conditions: GuardConditions = { desktopOnly: true };
      const params: Pick<GuardCheckParams, "isMobile"> = { isMobile: true };
      expect(checkDeviceType(conditions, params)).toBe(false);
    });

    it("should return false when mobile only and on desktop", () => {
      const conditions: GuardConditions = { mobileOnly: true };
      const params: Pick<GuardCheckParams, "isMobile"> = { isMobile: false };
      expect(checkDeviceType(conditions, params)).toBe(false);
    });
  });

  describe("checkAuthStatus", () => {
    it("should return true when no auth required", () => {
      const conditions: GuardConditions = {};
      const params: Pick<GuardCheckParams, "isLoggedIn"> = {
        isLoggedIn: false,
      };
      expect(checkAuthStatus(conditions, params)).toBe(true);
    });

    it("should return false when auth required but not logged in", () => {
      const conditions: GuardConditions = { requiresLoggedIn: true };
      const params: Pick<GuardCheckParams, "isLoggedIn"> = {
        isLoggedIn: false,
      };
      expect(checkAuthStatus(conditions, params)).toBe(false);
    });

    it("should return true when auth required and logged in", () => {
      const conditions: GuardConditions = { requiresLoggedIn: true };
      const params: Pick<GuardCheckParams, "isLoggedIn"> = { isLoggedIn: true };
      expect(checkAuthStatus(conditions, params)).toBe(true);
    });
  });

  describe("checkPplxSubStatus", () => {
    it("should return true when no subscription restrictions", () => {
      const conditions: GuardConditions = {};
      const params: Pick<
        GuardCheckParams,
        "hasActiveSub" | "isOrgMember" | "isLoggedIn" | "subTier"
      > = {
        hasActiveSub: false,
        isOrgMember: false,
        isLoggedIn: true,
        subTier: null,
      };
      expect(checkPplxSubStatus(conditions, params)).toBe(true);
    });

    it("should return false when subscription required but user has none", () => {
      const conditions: GuardConditions = { mustHaveActiveSub: true };
      const params: Pick<
        GuardCheckParams,
        "hasActiveSub" | "isOrgMember" | "isLoggedIn" | "subTier"
      > = {
        hasActiveSub: false,
        isOrgMember: false,
        isLoggedIn: true,
        subTier: null,
      };
      expect(checkPplxSubStatus(conditions, params)).toBe(false);
    });

    it("should return true when subscription required and user has one", () => {
      const conditions: GuardConditions = { mustHaveActiveSub: true };
      const params: Pick<
        GuardCheckParams,
        "hasActiveSub" | "isOrgMember" | "isLoggedIn" | "subTier"
      > = {
        hasActiveSub: true,
        isOrgMember: false,
        isLoggedIn: true,
        subTier: "pro",
      };
      expect(checkPplxSubStatus(conditions, params)).toBe(true);
    });

    it("should return false when minimum tier is not met", () => {
      const conditions: GuardConditions = {
        mustHaveActiveSub: true,
        leastTier: "max",
      };
      const params: Pick<
        GuardCheckParams,
        "hasActiveSub" | "isOrgMember" | "isLoggedIn" | "subTier"
      > = {
        hasActiveSub: true,
        isOrgMember: false,
        isLoggedIn: true,
        subTier: "pro",
      };
      expect(checkPplxSubStatus(conditions, params)).toBe(false);
    });

    it("should return true when minimum tier is met", () => {
      const conditions: GuardConditions = {
        mustHaveActiveSub: true,
        leastTier: "max",
      };
      const params: Pick<
        GuardCheckParams,
        "hasActiveSub" | "isOrgMember" | "isLoggedIn" | "subTier"
      > = {
        hasActiveSub: true,
        isOrgMember: false,
        isLoggedIn: true,
        subTier: "max",
      };
      expect(checkPplxSubStatus(conditions, params)).toBe(true);
    });
  });

  describe("checkPluginDependencies", () => {
    it("should return true when no dependencies", () => {
      const conditions: GuardConditions = {};
      const params: Pick<GuardCheckParams, "pluginsEnableStates"> = {
        pluginsEnableStates: {} as PluginsEnableStates,
      };
      expect(checkPluginDependencies(conditions, params)).toBe(true);
    });

    it("should return false when required plugin is disabled", () => {
      const conditions: GuardConditions = {
        dependentPluginIds: ["queryBox:languageModelSelector"],
      };
      const params: Pick<GuardCheckParams, "pluginsEnableStates"> = {
        pluginsEnableStates: {
          "queryBox:languageModelSelector": false,
        } as PluginsEnableStates,
      };
      expect(checkPluginDependencies(conditions, params)).toBe(false);
    });
  });

  describe("checkLocation", () => {
    it("should return true when no location restrictions", () => {
      const conditions: GuardConditions = {};
      const params: Pick<GuardCheckParams, "currentLocation"> = {
        currentLocation: "home",
      };
      expect(checkLocation(conditions, params)).toBe(true);
    });

    it("should return false when location doesn't match", () => {
      const conditions: GuardConditions = { location: ["thread"] };
      const params: Pick<GuardCheckParams, "currentLocation"> = {
        currentLocation: "home",
      };
      expect(checkLocation(conditions, params)).toBe(false);
    });

    it("should return false when currentLocation is undefined", () => {
      const conditions: GuardConditions = { location: ["thread"] };
      const params: Pick<GuardCheckParams, "currentLocation"> = {
        currentLocation:
          undefined as unknown as GuardCheckParams["currentLocation"],
      };
      expect(checkLocation(conditions, params)).toBe(false);
    });
  });

  describe("checkIncognito", () => {
    it("should return true when incognito allowed", () => {
      const conditions: GuardConditions = { allowIncognito: true };
      const params: Pick<GuardCheckParams, "isIncognito"> = {
        isIncognito: true,
      };
      expect(checkIncognito(conditions, params)).toBe(true);
    });

    it("should return false when incognito not allowed and in incognito", () => {
      const conditions: GuardConditions = { allowIncognito: false };
      const params: Pick<GuardCheckParams, "isIncognito"> = {
        isIncognito: true,
      };
      expect(checkIncognito(conditions, params)).toBe(false);
    });

    it("should return true when incognito not allowed but not in incognito", () => {
      const conditions: GuardConditions = { allowIncognito: false };
      const params: Pick<GuardCheckParams, "isIncognito"> = {
        isIncognito: false,
      };
      expect(checkIncognito(conditions, params)).toBe(true);
    });
  });

  describe("checkBrowser", () => {
    it("should return true when no browser restrictions", () => {
      const conditions: GuardConditions = {};
      expect(checkBrowser(conditions)).toBe(true);
    });

    it("should return true when current browser is in allowed list", () => {
      const conditions: GuardConditions = { browser: ["chrome", "firefox"] };
      expect(checkBrowser(conditions)).toBe(true);
    });

    it("should return false when current browser is not in allowed list", () => {
      const conditions: GuardConditions = { browser: ["firefox"] };
      expect(checkBrowser(conditions)).toBe(false);
    });

    it("should return true when browser list is empty", () => {
      const conditions: GuardConditions = { browser: [] };
      expect(checkBrowser(conditions)).toBe(true);
    });
  });
});
