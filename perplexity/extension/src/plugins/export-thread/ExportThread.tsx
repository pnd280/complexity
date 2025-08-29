import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import ExportButton from "@/plugins/export-thread/ExportButton";
import { hideOpenInAppBtnCssResourceConfig } from "@/plugins/export-thread/index.remote-resources";
import useCreatePortalContainer from "@/plugins/export-thread/useCreatePortalContainer";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

const hideOpenInAppBtnCss = await getVersionedRemoteResource(
  hideOpenInAppBtnCssResourceConfig,
);

export function ExportThread() {
  const portalContainer = useCreatePortalContainer();

  useInsertCss({
    id: "hide-open-in-app-btn",
    css: hideOpenInAppBtnCss,
  });

  return (
    <Portal container={portalContainer}>
      <ExportButton />
    </Portal>
  );
}
