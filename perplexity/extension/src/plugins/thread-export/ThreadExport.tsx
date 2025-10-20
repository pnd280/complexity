import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache/index.lib-loader";
import ExportMenu from "@/plugins/thread-export/ExportMenu";
import { hideOpenInAppBtnCssResourceConfig } from "@/plugins/thread-export/index.remote-resources";
import useCreatePortalContainer from "@/plugins/thread-export/useCreatePortalContainer";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

const hideOpenInAppBtnCss = await getVersionedRemoteResource(
  hideOpenInAppBtnCssResourceConfig,
  persistentQueryClient,
);

export function ThreadExport() {
  const portalContainer = useCreatePortalContainer();

  useInsertCss({
    id: "hide-open-in-app-btn",
    css: hideOpenInAppBtnCss,
  });

  return (
    <Portal container={portalContainer}>
      <ExportMenu />
    </Portal>
  );
}
