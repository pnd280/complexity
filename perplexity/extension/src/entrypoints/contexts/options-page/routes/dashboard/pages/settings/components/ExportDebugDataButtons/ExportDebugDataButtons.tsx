import AsyncButton from "@/components/AsyncButton";
import { Button } from "@/components/ui/button";
import { ExportDataDialog } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/ExportDebugDataButtons/components/ExportDataDialog";
import { useExportDebugData } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/ExportDebugDataButtons/hooks/useExportDebugData";
import useToggleButtonText from "@/hooks/useToggleButtonText";

import TablerCheck from "~icons/tabler/check";
import TablerLoaderCircle from "~icons/tabler/loader-2";

export default function ExportDebugDataButtons() {
  const {
    dialogState,
    openDialog,
    closeDialog,
    handleConfirm,
    permissions,
    toggleManagementPermission,
  } = useExportDebugData();

  const [copyButtonText, toggleCopyButtonText] = useToggleButtonText({
    defaultText: "Copy",
  });

  const handleCopyClick = async () => {
    openDialog("copy");
  };

  const handleSaveAsFileClick = async () => {
    openDialog("save");
  };

  const handleDialogConfirm = async () => {
    await handleConfirm();
    if (dialogState.action === "copy") {
      toggleCopyButtonText(
        <div className="x:flex x:items-center x:gap-2">
          <TablerCheck />
          <span className="x:text-sm">Copied</span>
        </div>,
      );
    }
  };

  return (
    <>
      <div className="x:flex x:flex-col x:items-end x:gap-4">
        <div className="x:flex x:gap-4">
          <AsyncButton
            variant="outline"
            loadingText={
              <div className="x:flex x:items-center x:gap-2">
                <TablerLoaderCircle className="x:animate-spin" />
                <span className="x:text-sm">Exporting</span>
              </div>
            }
            onClick={handleCopyClick}
          >
            {copyButtonText}
          </AsyncButton>
          <Button onClick={handleSaveAsFileClick}>Save as file</Button>
        </div>
      </div>

      <ExportDataDialog
        dialogState={dialogState}
        hasManagementPermission={
          permissions?.permissions?.includes("management") ?? false
        }
        onClose={closeDialog}
        onConfirm={handleDialogConfirm}
        onToggleManagementPermission={toggleManagementPermission}
      />
    </>
  );
}
