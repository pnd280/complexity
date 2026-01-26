import { APP_CONFIG } from "@/app.config";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { featureCompatResourceConfig } from "@/entrypoints/services/externals/cplx-api/plugins-states/index.remote-resources";
import {
  FeatureCompatibilitySchema,
  type FeatureCompatibility,
} from "@/entrypoints/services/externals/cplx-api/plugins-states/types";
import type { PluginsEnableStates } from "@/entrypoints/services/externals/cplx-api/plugins-states/types";
import {
  getEnableStates,
  initializePluginStates,
  updatePluginStatesWithFeatureCompat,
  type LocalEnableStates as LocalPluginsEnableStates,
} from "@/entrypoints/services/externals/cplx-api/plugins-states/utils";
import { cplxApiQueries } from "@/entrypoints/services/externals/cplx-api/query-keys";
import { getRemoteResource } from "@/entrypoints/services/externals/cplx-api/remote-resources/utils";
import type { CplxVersions } from "@/entrypoints/services/externals/cplx-api/types";
import { isInContentScript } from "@/utils/misc/utils";

export class PluginsStatesV2Service {
  static get featureCompatQuery() {
    return cplxApiQueries.remoteResource.detail({
      resourcePath: featureCompatResourceConfig.resourcePath,
      zodSchema: FeatureCompatibilitySchema,
    });
  }

  static async featureCompatInlineQueryFn() {
    return getRemoteResource(
      featureCompatResourceConfig,
      persistentQueryClient,
    );
  }

  static cachedEnableStates: PluginsEnableStates | null = null;

  static localEnableStates: LocalPluginsEnableStates | null = null;

  static featureCompat: FeatureCompatibility | null = null;

  static cplxVersions: CplxVersions | null = null;

  static getEnableStatesCachedSync(): PluginsEnableStates {
    invariant(
      isInContentScript(),
      "This method can ONLY be used in content script",
    );

    if (this.cachedEnableStates) return this.cachedEnableStates;

    invariant(
      PluginsStatesV2Service.localEnableStates != null,
      "[PluginsStatesService] Local enable states not found or hasnt been initialized yet",
    );

    invariant(
      PluginsStatesV2Service.featureCompat != null,
      "[PluginsStatesService] Feature compat not found or hasnt been initialized yet",
    );

    invariant(
      PluginsStatesV2Service.cplxVersions != null,
      "[PluginsStatesService] Cplx versions not found or hasnt been initialized yet",
    );

    const pluginsStates = initializePluginStates();

    const withFeatureCompat = updatePluginStatesWithFeatureCompat({
      pluginsStates,
      featureCompat: PluginsStatesV2Service.featureCompat,
      currentVersion: APP_CONFIG.VERSION,
      latestAvailableVersion: PluginsStatesV2Service.cplxVersions.latest,
    });

    const enableStates = getEnableStates({
      pluginsStates: withFeatureCompat,
      localEnableStates: PluginsStatesV2Service.localEnableStates,
    });

    this.cachedEnableStates = enableStates;

    return enableStates;
  }
}
