import { Portal } from "@/components/ui/portal";
import ExportMenu from "@/plugins/thread-export/ExportMenu";
import useCreatePortalContainer from "@/plugins/thread-export/useCreatePortalContainer";

export function ThreadExport() {
  const portalContainer = useCreatePortalContainer();

  return (
    <Portal container={portalContainer}>
      <ExportMenu />
    </Portal>
  );
}
