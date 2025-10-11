import React from "react";

import { Button } from "@/components/ui/button";
import { useThreadExport } from "@/plugins/thread-export-to-llm/hooks/useThreadExport";

import TablerFileExport from "~icons/tabler/file-export";

function ExportButtonContent() {
  const { exportThread, isExporting, isEnabled } = useThreadExport();

  if (!isEnabled) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={exportThread}
      disabled={isExporting}
      title="Export thread to LLM"
      className="x:h-8 x:w-8"
    >
      <TablerFileExport className="x:h-4 x:w-4" />
    </Button>
  );
}

ExportButtonContent.displayName = "ThreadExportToLlm.ExportButton";

export default ExportButtonContent;
