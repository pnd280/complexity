import { useQuery } from "@tanstack/react-query";
import semver from "semver";

import { APP_CONFIG } from "@/app.config";
import { CplxVersionsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/versions";

export default function useExtensionUpdate() {
  const { data: versions, isLoading } = useQuery(CplxVersionsService.query);

  const isUpdateAvailable = versions
    ? (() => {
        const currentVersion = APP_CONFIG.VERSION;
        const latestVersion = versions.latest;

        if (!semver.valid(currentVersion) || !semver.valid(latestVersion)) {
          return false;
        }

        return semver.gt(latestVersion, currentVersion);
      })()
    : false;

  return {
    isUpdateAvailable,
    latestVersion: versions?.latest,
    isLoading,
  };
}
