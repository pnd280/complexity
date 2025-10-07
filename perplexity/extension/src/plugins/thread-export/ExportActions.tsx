import FaFileExport from "@/components/icons/FaFileExport";
import { Button } from "@/components/ui/button";

import TablerCopy from "~icons/tabler/copy";

type ExportActionsProps = {
  onDownload: () => void;
  onCopy: () => void;
};

export function ExportActions({ onDownload, onCopy }: ExportActionsProps) {
  return (
    <div className="x:flex x:gap-2">
      <Button className="x:flex x:items-center x:gap-2" onClick={onDownload}>
        <FaFileExport />
        <span>{t("plugin-thread-export.actions.download")}</span>
      </Button>
      <Button className="x:flex x:items-center x:gap-2" onClick={onCopy}>
        <TablerCopy />
        <span>{t("plugin-thread-export.actions.copy")}</span>
      </Button>
    </div>
  );
}
