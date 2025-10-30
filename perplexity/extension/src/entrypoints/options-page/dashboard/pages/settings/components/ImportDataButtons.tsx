import { useQueryClient } from "@tanstack/react-query";
import { storage } from "@wxt-dev/storage";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import type { ExtensionData } from "@/data/dashboard/extension-data.types";
import ImportDataPasteDialogWrapper from "@/entrypoints/options-page/dashboard/pages/settings/components/ImportDataPasteDialogWrapper";
import { transfromFlatSchema } from "@/services/infra/extension-api-wrappers/extension-settings/migrations";
import { extensionSettingsQueries } from "@/services/infra/extension-api-wrappers/extension-settings/query-keys";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";
import { db } from "@/services/infra/indexed-db";

export default function ImportDataButtons() {
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportData = async (data: string) => {
    const [, error] = await tryCatch(async () => {
      const [parsedData] = tryCatch(() => JSON.parse(data) as unknown);

      if (
        parsedData != null &&
        typeof parsedData === "object" &&
        "settings" in parsedData &&
        parsedData.settings != null &&
        typeof parsedData.settings === "object" &&
        "plugins" in parsedData.settings
      ) {
        parsedData.settings = {
          settings: transfromFlatSchema(parsedData.settings),
          settings$: {
            v: 2,
          },
        };
      }

      const typedParsedData = parsedData as ExtensionData;

      const settings =
        "localStorage" in typedParsedData
          ? (typedParsedData.localStorage as {
              settings: ExtensionSettings;
              settings$: { v: number };
            })
          : typedParsedData.settings;

      await storage.setItem<ExtensionSettings>(
        "local:settings",
        settings.settings,
      );
      await storage.setMeta("local:settings", {
        v: settings["settings$"].v,
      });
      await db.import(typedParsedData.db);

      void queryClient.invalidateQueries({
        queryKey: extensionSettingsQueries.all(),
      });
    });

    if (!error) {
      toast({
        title: "✅ Data imported",
      });
    } else {
      console.error(error);
      toast({
        title: "❌ Invalid data",
      });
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await handleImportData(await file.text());
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Failed to read file",
      });
    }

    event.target.value = "";
  };

  return (
    <div className="x:flex x:gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="x:hidden"
        onChange={handleFileChange}
      />
      <ImportDataPasteDialogWrapper onSubmit={handleImportData}>
        <Button variant="outline">Paste as text</Button>
      </ImportDataPasteDialogWrapper>
      <Button onClick={handleChooseFile}>Choose file</Button>
    </div>
  );
}
