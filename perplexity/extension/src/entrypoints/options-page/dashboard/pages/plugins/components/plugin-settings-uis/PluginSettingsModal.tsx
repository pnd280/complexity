import type { DialogOpenChangeDetails } from "@ark-ui/react";
import { useNavigate } from "react-router-dom";

import { PluginSettingsUis } from "@/__registries__/plugin-settings-uis";
import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type { PluginId } from "@/__registries__/plugins/meta.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobileStore } from "@/hooks/is-mobile-store";

type PluginSettingsModalProps = {
  pluginId: PluginId;
};

export default function PluginSettingsModal({
  pluginId,
}: PluginSettingsModalProps) {
  const navigate = useNavigate();
  const { isMobile } = useIsMobileStore();

  const plugin = PluginManifestsRegistry.meta[pluginId];

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
          <DialogTitle>{plugin.title}</DialogTitle>
          <DialogDescription className="x:whitespace-pre-line">
            {plugin.description}
          </DialogDescription>
        </DialogHeader>
        <div className="x:mt-4">{PluginSettingsUis[pluginId]!.component}</div>
      </DialogContentComp>
    </DialogComp>
  );
}
