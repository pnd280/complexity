import type { DialogOpenChangeDetails } from "@ark-ui/react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePluginSettingsUiRegistry } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import type {
  PluginId,
  PluginManifestExports,
  PublicPlugins,
} from "@/entrypoints/services/plugins/types";
import { getPluginManifest } from "@/entrypoints/services/plugins/utils";
import { useViewport } from "@/hooks/useViewport";

type PluginSettingsModalProps = {
  pluginId: PluginId;
};

export default function PluginSettingsModal({
  pluginId,
}: PluginSettingsModalProps) {
  const navigate = useNavigate();
  const { isMobile } = useViewport();

  const {
    meta: { name, description },
  } = getPluginManifest(pluginId) as PluginManifestExports;

  const settingsUi = usePluginSettingsUiRegistry({
    pluginId: pluginId as keyof PublicPlugins,
  });

  if (settingsUi == null) {
    return null;
  }

  const handleClose = ({ open }: DialogOpenChangeDetails) => {
    if (!open) {
      void navigate(-1);
    }
  };

  const DialogComp = isMobile ? Sheet : Dialog;
  const DialogContentComp = isMobile ? SheetContent : DialogContent;

  return (
    <DialogComp open onOpenChange={handleClose}>
      <DialogContentComp
        className="x:md:max-w-max"
        side={isMobile ? "bottom" : undefined}
      >
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription className="x:whitespace-pre-line">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="x:mt-4">{settingsUi}</div>
      </DialogContentComp>
    </DialogComp>
  );
}
