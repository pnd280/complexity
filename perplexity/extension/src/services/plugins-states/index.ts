import { APP_CONFIG } from "@/app.config";
import { queryClient } from "@/data/query-client";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { getRemoteResource } from "@/services/cplx-api/remote-resources/utils";
import { CplxVersionsService } from "@/services/cplx-api/remote-resources/versions";
import {
  FeatureCompatibilitySchema,
  type CplxVersions,
  type FeatureCompatibility,
} from "@/services/cplx-api/types";
import { ExtensionSettingsService } from "@/services/extension-settings";
import { featureCompatResourceConfig } from "@/services/plugins-states/index.remote-resources";
import type { PluginsStates } from "@/services/plugins-states/types";
import {
  initializePluginStates,
  getEnableStates,
  updatePluginStatesWithFeatureCompat,
} from "@/services/plugins-states/utils";
import { invariant, isInContentScript } from "@/utils/utils";

export class PluginsStatesService {
  static get featureCompatQuery() {
    return cplxApiQueries.remoteResource.detail({
      resourcePath: featureCompatResourceConfig.resourcePath,
      zodSchema: FeatureCompatibilitySchema,
    });
  }

  static async featureCompatInlineQueryFn() {
    return getRemoteResource(featureCompatResourceConfig);
  }

  static cachedEnableStates: PluginsStates | null = null;

  static getEnableStatesCachedSync(params?: {
    featureCompat: FeatureCompatibility;
    cplxVersions: CplxVersions;
  }): PluginsStates {
    invariant(
      isInContentScript(),
      "This method can ONLY be used in content script",
    );

    if (this.cachedEnableStates) return this.cachedEnableStates;

    const featureCompat =
      params?.featureCompat ??
      queryClient.getQueryData(
        PluginsStatesService.featureCompatQuery.queryKey,
      );

    const cplxVersions =
      params?.cplxVersions ??
      queryClient.getQueryData(CplxVersionsService.query.queryKey);

    const pluginsStates = initializePluginStates();

    const withFeatureCompat = updatePluginStatesWithFeatureCompat({
      pluginsStates,
      featureCompat,
      currentVersion: APP_CONFIG.VERSION,
      latestAvailableVersion: cplxVersions?.latest,
    });

    const enableStates = getEnableStates({
      pluginsStates: withFeatureCompat,
      localEnableStates: ExtensionSettingsService.cachedSync.plugins,
    });

    invariant(
      featureCompat && cplxVersions,
      "[PluginsStatesService] Missing required data",
    );

    this.cachedEnableStates = enableStates;

    return enableStates;
  }
}
