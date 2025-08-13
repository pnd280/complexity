import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/app.config";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";
import { PluginsStatesService } from "@/services/plugins-states";
import { featureCompatResourceConfig } from "@/services/plugins-states/index.remote-resources";
import {
  initializePluginStates,
  updatePluginStatesWithFeatureCompat,
} from "@/services/plugins-states/utils";
import { isInContentScript } from "@/utils/utils";
import { invariant } from "@/utils/utils";

export default function usePluginsStates() {
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

  const pluginsStates = useMemo(
    () =>
      updatePluginStatesWithFeatureCompat({
        pluginsStates: initializePluginStates(),
        featureCompat: APP_CONFIG.IS_DEV
          ? featureCompatResourceConfig.fallback
          : featureCompat,
        currentVersion: APP_CONFIG.VERSION,
        latestAvailableVersion: latestVersion,
      }),
    [featureCompat, latestVersion],
  );

  const isLoading = isFetchingFeatureCompat || isLoadingLatestVersion;

  return {
    pluginsStates,
    isLoading,
  };
}
