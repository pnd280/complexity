import { APP_CONFIG } from "@/app.config";
import { featureCompatResourceConfig } from "@/plugins/__async-deps__/plugins-states/index.remote-resources";
import type { PluginsEnableStates } from "@/plugins/__async-deps__/plugins-states/types";
import {
  initializePluginStates,
  getEnableStates,
  updatePluginStatesWithFeatureCompat,
} from "@/plugins/__async-deps__/plugins-states/utils";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { getRemoteResource } from "@/services/externals/cplx-api/remote-resources/utils";
import { CplxVersionsService } from "@/services/externals/cplx-api/remote-resources/versions";
import {
  FeatureCompatibilitySchema,
  type CplxVersions,
  type FeatureCompatibility,
} from "@/services/externals/cplx-api/types";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { queryClient } from "@/services/infra/query-client";
import { invariant, isInContentScript } from "@/utils/misc/utils";

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

  static cachedEnableStates: PluginsEnableStates | null = null;

  static getEnableStatesCachedSync(params?: {
    featureCompat: FeatureCompatibility;
    cplxVersions: CplxVersions;
  }): PluginsEnableStates {
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
