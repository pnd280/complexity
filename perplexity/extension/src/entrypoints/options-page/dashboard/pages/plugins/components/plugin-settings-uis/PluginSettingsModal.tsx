import type { DialogOpenChangeDetails } from "@ark-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PluginSettingsUis } from "@/data/registries/plugin-settings-uis";
import { PluginManifestsRegistry } from "@/data/registries/plugins";
import type { PluginId } from "@/data/registries/plugins/meta.types";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

type PluginSettingsModalProps = {
  pluginId: PluginId;
};

export default function PluginSettingsModal({
  pluginId,
}: PluginSettingsModalProps) {
  const navigate = useNavigate();
  const { isMobile } = useIsMobileStore();
  const location = useLocation();

  const plugin = PluginManifestsRegistry.meta[pluginId];

  const fromPluginList = location.state?.fromPluginList === true;

  const handleClose = ({ open }: DialogOpenChangeDetails) => {
    if (!open) {
      if (fromPluginList) {
        navigate(-1);
      } else {
        navigate("/plugins");
      }
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
