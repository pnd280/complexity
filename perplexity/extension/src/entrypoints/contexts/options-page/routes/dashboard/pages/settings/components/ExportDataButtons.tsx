import AsyncButton from "@/components/AsyncButton";
import { Button } from "@/components/ui/button";
import { exportExtensionData } from "@/entrypoints/services/data-migration/export";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import downloadFile from "@/utils/misc/download-file";

import TablerCheck from "~icons/tabler/check";
import TablerLoaderCircle from "~icons/tabler/loader-2";

export default function ExportDataButtons() {
  const [copyButtonText, toggleCopyButtonText] = useToggleButtonText({
    defaultText: "Copy",
  });

  return (
    <div className="x:flex x:gap-4">
      <AsyncButton
        variant="outline"
        loadingText={
          <div className="x:flex x:items-center x:gap-2">
            <TablerLoaderCircle className="x:animate-spin" />
            <span className="x:text-sm">Exporting</span>
          </div>
        }
        onClick={async () => {
          const settings = await exportExtensionData();
          await navigator.clipboard.writeText(settings);
          toggleCopyButtonText(
            <div className="x:flex x:items-center x:gap-2">
              <TablerCheck />
              <span className="x:text-sm">Copied</span>
            </div>,
          );
        }}
      >
        {copyButtonText}
      </AsyncButton>
      <Button
        onClick={async () => {
          const settings = await exportExtensionData();
          await downloadFile({
            data: settings,
            filename: `complexity-settings-${new Date().toISOString()}.json`,
          });
        }}
      >
        Save as file
      </Button>
    </div>
  );
}
