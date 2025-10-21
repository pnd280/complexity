import { APP_CONFIG } from "@/app.config";
import AsyncButton from "@/components/AsyncButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import TablerLoaderCircle from "~icons/tabler/loader-2";

import type { ExportDialogState } from "../hooks/useExportDebugData";

type ExportDataDialogProps = {
  dialogState: ExportDialogState;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  hasManagementPermission: boolean;
  onToggleManagementPermission: () => void;
};

export function ExportDataDialog({
  dialogState,
  onClose,
  onConfirm,
  hasManagementPermission,
  onToggleManagementPermission,
}: ExportDataDialogProps) {
  const { isOpen, action, metadata } = dialogState;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Debug Data</DialogTitle>
          <DialogDescription>
            Choose what information to include in your debug data export.
          </DialogDescription>
        </DialogHeader>

        <div className="x:space-y-4">
          <div className="x:space-y-3">
            <Checkbox
              disabled
              checked
              label={`Version: ${metadata?.cplxVersion ?? ""}`}
              size="lg"
            />
            <Checkbox
              disabled
              checked
              label={`Platform: ${metadata?.platform ?? ""}`}
              size="lg"
            />
            <Checkbox
              disabled
              checked
              label={`Browser: ${metadata?.browser ?? ""}`}
              size="lg"
            />
            <Checkbox
              disabled
              checked
              label={`User Agent: ${metadata?.ua ?? ""}`}
              size="lg"
            />
          </div>

          <div className="x:border-t x:pt-4">
            <Checkbox
              checked={hasManagementPermission}
              label={`Include potentially-conflicting ${APP_CONFIG.BROWSER === "chrome" ? "extensions" : "addons"}`}
              size="lg"
              onCheckedChange={onToggleManagementPermission}
            />
          </div>
        </div>

        <div className="x:flex x:justify-end x:gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <AsyncButton
            loadingText={
              <div className="x:flex x:items-center x:gap-2">
                <TablerLoaderCircle className="x:animate-spin" />
                <span className="x:text-sm">
                  {action === "copy" ? "Copying" : "Saving"}
                </span>
              </div>
            }
            onClick={onConfirm}
          >
            {action === "copy" ? "Copy" : "Save"}
          </AsyncButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
