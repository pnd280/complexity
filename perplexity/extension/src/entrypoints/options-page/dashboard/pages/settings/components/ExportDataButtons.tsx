import { LuCheck, LuLoaderCircle } from "react-icons/lu";

import AsyncButton from "@/components/AsyncButton";
import { Button } from "@/components/ui/button";
import type { ExtensionData } from "@/data/dashboard/extension-data.types";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { ExtensionSettingsService } from "@/services/infra/extension-settings";
import { db as indexedDb } from "@/services/infra/indexed-db";

export default function ExportDataButtons() {
  const [copyButtonText, toggleCopyButtonText] = useToggleButtonText({
    defaultText: "Copy",
  });

  const getExportData = useCallback(async (): Promise<string> => {
    await sleep(300);
    return JSON.stringify(
      {
        settings: {
          settings: await ExtensionSettingsService.storageItem.getValue(),
          settings$: await ExtensionSettingsService.storageItem.getMeta(),
        } as ExtensionData["settings"],
        db: await indexedDb.exportAll(),
      } satisfies ExtensionData,
      null,
      2,
    );
  }, []);

  const handleCopy = useCallback(async () => {
    const settings = await getExportData();
    await navigator.clipboard.writeText(settings);
    toggleCopyButtonText(
      <div className="x:flex x:items-center x:gap-2">
        <LuCheck />
        <span className="x:text-sm">Copied</span>
      </div>,
    );
  }, [getExportData, toggleCopyButtonText]);

  const handleSaveAsFile = useCallback(async () => {
    try {
      const settings = await getExportData();
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: `complexity-settings-${new Date().toISOString()}.json`,
        types: [
          {
            description: "JSON File",
            accept: { "application/json": [".json"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(settings);
      await writable.close();
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Failed to save file:", error);
      }
    }
  }, [getExportData]);

  return (
    <div className="x:flex x:gap-4">
      <AsyncButton
        variant="outline"
        loadingText={
          <div className="x:flex x:items-center x:gap-2">
            <LuLoaderCircle className="x:animate-spin" />
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
