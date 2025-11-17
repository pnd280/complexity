import type { RouteObject } from "react-router-dom";
import { redirect } from "react-router-dom";

import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { registerHashRouterRoute } from "@/entrypoints/contexts/content-scripts/services/hash-router/index.loader";
import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { ArtifactsPrePromptInstallationDialog } from "@/plugins/_thread/artifacts/components/PrePromptInstallationDialog";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:thread:artifacts:prePromptInstallationDialog": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:thread:artifacts:prePromptInstallationDialog",
    dependencies: ["cache:pluginsEnableStatesV2"],
    loader: ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
      const artifactsPrePromptInstallationDialogRouterRoute: RouteObject = {
        path: "/cplx/thread-artifacts/install-pre-prompt-as-space",
        loader: () => {
          if (!pluginsEnableStates["thread:artifacts"]) {
            return redirect("/");
          }

          return null;
        },
        element: (
          <CsUiGuard desktopOnly dependentPluginIds={["thread:artifacts"]}>
            <ArtifactsPrePromptInstallationDialog />
          </CsUiGuard>
        ),
      };

      registerHashRouterRoute({
        id: "plugin:thread:artifacts:prePromptInstallationDialog",
        route: artifactsPrePromptInstallationDialogRouterRoute,
      });
    },
  });
}
