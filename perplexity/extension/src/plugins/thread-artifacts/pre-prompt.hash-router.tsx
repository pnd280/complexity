import type { RouteObject } from "react-router-dom";
import { redirect } from "react-router-dom";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { PluginsStatesService } from "@/plugins/__async-deps__/plugins-states";
import { ArtifactsPrePromptInstallationDialog } from "@/plugins/thread-artifacts/components/PrePromptInstallationDialog";

const artifactsPrePromptInstallationDialogRouterRoute: RouteObject = {
  path: "/cplx/thread-artifacts/install-pre-prompt-as-space",
  loader: () => {
    if (!PluginsStatesService.getEnableStatesCachedSync()["thread:artifacts"]) {
      return redirect("/");
    }

    return null;
  },
  element: (
    <CsUiPluginsGuard desktopOnly dependentPluginIds={["thread:artifacts"]}>
      <ArtifactsPrePromptInstallationDialog />
    </CsUiPluginsGuard>
  ),
};

export default artifactsPrePromptInstallationDialogRouterRoute;
