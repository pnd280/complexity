import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ImportDataPasteDialogWrapper from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/ImportDataPasteDialogWrapper";
import { extensionSettingsQueries } from "@/entrypoints/hooks/useSettingsBase";
import { importExtensionData } from "@/entrypoints/services/data-migration/import";
import { tryCatch } from "@/utils/wrappers/try-catch";

export default function ImportDataButtons() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportData = async (data: string) => {
    const [, error] = await tryCatch(async () => {
      await importExtensionData(data);

      await queryClient.invalidateQueries({
        queryKey: extensionSettingsQueries.all(),
      });

      toast({
        description: "✅ Data imported successfully!",
      });

      void navigate("/plugins");
    });

    if (error) {
      console.error(error);
      toast({
        title: "❌ Failed to import data",
        description: "Check the console for more details",
      });
    }
  };

  return (
    <div className="x:flex x:gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="x:hidden"
        onChange={async (event) => {
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
        }}
      />
      <ImportDataPasteDialogWrapper onSubmit={handleImportData}>
        <Button variant="outline">Paste as text</Button>
      </ImportDataPasteDialogWrapper>
      <Button
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        Choose file
      </Button>
    </div>
  );
}
