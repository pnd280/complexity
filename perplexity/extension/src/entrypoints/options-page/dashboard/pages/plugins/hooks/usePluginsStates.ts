import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/app.config";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";
import { PluginsStatesService } from "@/plugins/__async-deps__/plugins-states";
import { featureCompatResourceConfig } from "@/plugins/__async-deps__/plugins-states/index.remote-resources";
import {
  initializePluginStates,
  updatePluginStatesWithFeatureCompat,
} from "@/plugins/__async-deps__/plugins-states/utils";
import { isInContentScript } from "@/utils/misc/utils";

export default function usePluginsStates() {
  "use memo";

  invariant(
    !isInContentScript(),
    "usePluginsStates can not be used in content script",
  );

  const { data: featureCompat, isLoading: isFetchingFeatureCompat } = useQuery({
    ...PluginsStatesService.featureCompatQuery,
    retry: false,
    enabled: !APP_CONFIG.IS_DEV,
  });

  const { latestVersion, isLoading: isLoadingLatestVersion } =
    useExtensionUpdate();

  const pluginsStates = (() =>
    updatePluginStatesWithFeatureCompat({
      pluginsStates: initializePluginStates(),
      featureCompat: APP_CONFIG.IS_DEV
        ? featureCompatResourceConfig.fallback
        : featureCompat,
      currentVersion: APP_CONFIG.VERSION,
      latestAvailableVersion: latestVersion,
    }))();

  const isLoading = isFetchingFeatureCompat || isLoadingLatestVersion;

  return {
    pluginsStates,
    isLoading,
  };
}
