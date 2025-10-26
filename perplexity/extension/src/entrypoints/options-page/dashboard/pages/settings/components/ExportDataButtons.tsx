import AsyncButton from "@/components/AsyncButton";
import { Button } from "@/components/ui/button";
import type { ExtensionData } from "@/data/dashboard/extension-data.types";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { ExtensionSettingsStorageService } from "@/services/infra/extension-api-wrappers/extension-settings/storage/service-init.bg-worker";
import { db as indexedDb } from "@/services/infra/indexed-db";
import downloadFile from "@/utils/misc/download-file";

import TablerCheck from "~icons/tabler/check";
import TablerLoaderCircle from "~icons/tabler/loader-2";

export default function ExportDataButtons() {
  const [copyButtonText, toggleCopyButtonText] = useToggleButtonText({
    defaultText: "Copy",
  });

  const getExportData = async (): Promise<string> => {
    await sleep(300);
    return JSON.stringify(
      {
        settings: {
          settings: await ExtensionSettingsStorageService.Instance.getValue(),
          settings$: await ExtensionSettingsStorageService.Instance.getMeta(),
        } as ExtensionData["settings"],
        db: await indexedDb.exportAll(),
      } satisfies ExtensionData,
      null,
      2,
    );
  };

  const handleCopy = async () => {
    const settings = await getExportData();
    await navigator.clipboard.writeText(settings);
    toggleCopyButtonText(
      <div className="x:flex x:items-center x:gap-2">
        <TablerCheck />
        <span className="x:text-sm">Copied</span>
      </div>,
    );
  };

  const handleSaveAsFile = async () => {
    const settings = await getExportData();
    await downloadFile({
      data: settings,
      filename: `complexity-settings-${new Date().toISOString()}.json`,
    });
  };

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
        onClick={handleCopy}
      >
        {copyButtonText}
      </AsyncButton>
      <Button onClick={handleSaveAsFile}>Save as file</Button>
    </div>
  );
}
