import { useCallback } from "react";

import { toast } from "@/components/ui/use-toast";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";
import { useExportStore } from "@/plugins/thread-export-to-llm/store";
import {
  collectThreadContext,
  formatThreadContext,
  exportToClipboard,
  openInTargetLlm,
} from "@/plugins/thread-export-to-llm/utils";

export function useThreadExport() {
  const { settings } = useExtensionSettings();
  const { isExporting, setIsExporting, setLastExport } = useExportStore();

  const pluginSettings = settings?.plugins.threadExportToLlm;

  const exportThread = useCallback(async () => {
    if (!pluginSettings?.enabled) {
      toast({
        title: "❌ Plugin not enabled",
        description: "Please enable the Thread Export to LLM plugin in settings",
      });
      return;
    }

    setIsExporting(true);

    try {
      // Collect thread context
      const context = await collectThreadContext();

      // Format based on settings
      const format = pluginSettings.exportFormat || "markdown";
      const includeMetadata = pluginSettings.includeMetadata ?? true;

      // If metadata should not be included, remove it
      if (!includeMetadata) {
        context.metadata = {
          threadId: "",
          title: "",
          createdAt: "",
          model: "",
          url: "",
        };
      }

      const formattedContent = formatThreadContext(context, format);

      // Copy to clipboard
      await exportToClipboard(formattedContent);

      // Store the last export
      setLastExport(formattedContent);

      // Show success toast
      toast({
        title: "✅ Thread exported",
        description: `Content copied to clipboard as ${format}`,
      });

      // Open target LLM
      const targetLlm = pluginSettings.targetLlm || "ai-studio";
      const customEndpoint = pluginSettings.customApiEndpoint;

      openInTargetLlm(targetLlm, customEndpoint);
    } catch (error) {
      console.error("Error exporting thread:", error);
      toast({
        title: "❌ Export failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsExporting(false);
    }
  }, [pluginSettings, setIsExporting, setLastExport]);

  return {
    exportThread,
    isExporting,
    isEnabled: pluginSettings?.enabled ?? false,
  };
}
